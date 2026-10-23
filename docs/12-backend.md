# 12 — Backend

## Supabase — Arquitetura e Schema

### Por que Supabase

- PostgreSQL gerenciado com Row Level Security nativo
- Auth completo com Apple Sign In (essencial para iOS)
- Realtime subscriptions para sync entre devices
- Storage para samples de áudio
- Familiaridade prévia (PlantaViva)
- Tier gratuito generoso para uso pessoal

---

## Schema Completo

```sql
-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_data JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{
    "sampleVolume": 0.8,
    "noteSpeed": 1.0,
    "showFingerNumbers": true,
    "hapticFeedback": true,
    "language": "pt-BR"
  }'
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their own profile"
  ON profiles FOR ALL USING (auth.uid() = id);

-- EXERCISE SESSIONS
CREATE TABLE exercise_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles NOT NULL,
  exercise_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  accuracy NUMERIC(5,2) CHECK (accuracy BETWEEN 0 AND 100),
  avg_timing_deviation INTEGER,        -- ms, positivo=atrasado, negativo=adiantado
  note_errors JSONB DEFAULT '{}',      -- {"F#4": 3, "C4": 1}
  bpm INTEGER,
  duration_seconds INTEGER,
  streak_max INTEGER DEFAULT 0,        -- maior streak na sessão
  passed BOOLEAN GENERATED ALWAYS AS (accuracy >= 80) STORED
);

CREATE INDEX idx_sessions_user_exercise ON exercise_sessions(user_id, exercise_id);
CREATE INDEX idx_sessions_completed_at ON exercise_sessions(completed_at DESC);

ALTER TABLE exercise_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own sessions"
  ON exercise_sessions FOR ALL USING (auth.uid() = user_id);

-- NOTE PERFORMANCE
CREATE TABLE note_performance (
  user_id UUID REFERENCES profiles NOT NULL,
  midi_note INTEGER NOT NULL CHECK (midi_note BETWEEN 21 AND 108),
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  timing_deviations INTEGER[] DEFAULT '{}',  -- Últimas 20 deviações em ms
  last_practiced TIMESTAMPTZ,
  mastery_level TEXT DEFAULT 'unseen'
    CHECK (mastery_level IN ('unseen','introduced','learning','consolidating','mastered','expert')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, midi_note)
);

-- View calculada para accuracy por nota
CREATE VIEW note_accuracy AS
SELECT 
  user_id,
  midi_note,
  mastery_level,
  CASE WHEN total_attempts > 0 
    THEN ROUND((correct_attempts::NUMERIC / total_attempts) * 100, 1)
    ELSE 0 
  END AS accuracy_pct,
  total_attempts,
  last_practiced
FROM note_performance;

ALTER TABLE note_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own note performance"
  ON note_performance FOR ALL USING (auth.uid() = user_id);

-- REPERTOIRE
CREATE TABLE repertoire (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles NOT NULL,
  song_id TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  best_accuracy NUMERIC(5,2),
  best_bpm INTEGER,
  play_count INTEGER DEFAULT 0,
  last_played TIMESTAMPTZ,
  UNIQUE(user_id, song_id)
);

ALTER TABLE repertoire ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own repertoire"
  ON repertoire FOR ALL USING (auth.uid() = user_id);

-- PRACTICE DAYS (para streak)
CREATE TABLE practice_days (
  user_id UUID REFERENCES profiles NOT NULL,
  practice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_minutes INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, practice_date)
);

-- View de streak atual
CREATE VIEW current_streak AS
WITH consecutive_days AS (
  SELECT 
    user_id,
    practice_date,
    practice_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY practice_date))::INTEGER AS grp
  FROM practice_days
  WHERE total_minutes > 0
),
streaks AS (
  SELECT 
    user_id,
    MIN(practice_date) AS streak_start,
    MAX(practice_date) AS streak_end,
    COUNT(*) AS days
  FROM consecutive_days
  GROUP BY user_id, grp
)
SELECT 
  user_id,
  days AS streak_days,
  streak_end
FROM streaks
WHERE streak_end >= CURRENT_DATE - 1  -- Inclui ontem (não perde por fuso)
ORDER BY streak_end DESC;

ALTER TABLE practice_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own practice days"
  ON practice_days FOR ALL USING (auth.uid() = user_id);

-- AI FEEDBACK CACHE
-- Evita chamar a API desnecessariamente para o mesmo padrão de erro
CREATE TABLE ai_feedback_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  error_pattern_hash TEXT NOT NULL,    -- hash do padrão de erro
  exercise_id TEXT NOT NULL,
  feedback_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  use_count INTEGER DEFAULT 1,
  UNIQUE(error_pattern_hash, exercise_id)
);
```

---

## Sync: Offline First

O app funciona sem internet. Quando voltar a ter conexão, sincroniza.

### Estratégia

```
[App local — SQLite via expo-sqlite]
  │
  │ Sync periódico (a cada 5 min em background)
  │ ou imediato quando sair do exercício com internet
  │
  ▼
[Supabase PostgreSQL]
```

### Resolução de conflito

Last-write-wins para dados de sessão — não há conflito real porque o progresso só avança. Se o app estiver em dois devices e ambos registrarem a mesma sessão:

```typescript
// Usa upsert com a sessão de maior accuracy
const { error } = await supabase
  .from('exercise_sessions')
  .upsert(session, { 
    onConflict: 'user_id,exercise_id,completed_at',
    ignoreDuplicates: false 
  });
```

Para `note_performance`, o sync agrega (soma `total_attempts` e `correct_attempts`), nunca sobrescreve.

---

## Funções PostgreSQL Importantes

```sql
-- Recalcula mastery_level baseado em performance recente
CREATE OR REPLACE FUNCTION update_note_mastery(
  p_user_id UUID,
  p_midi_note INTEGER
) RETURNS TEXT AS $$
DECLARE
  v_accuracy NUMERIC;
  v_total INTEGER;
  v_new_level TEXT;
BEGIN
  SELECT 
    ROUND((correct_attempts::NUMERIC / NULLIF(total_attempts, 0)) * 100, 1),
    total_attempts
  INTO v_accuracy, v_total
  FROM note_performance
  WHERE user_id = p_user_id AND midi_note = p_midi_note;
  
  v_new_level := CASE
    WHEN v_total = 0 THEN 'unseen'
    WHEN v_total < 5 THEN 'introduced'
    WHEN v_accuracy < 60 THEN 'learning'
    WHEN v_accuracy < 80 THEN 'consolidating'
    WHEN v_accuracy < 95 THEN 'mastered'
    ELSE 'expert'
  END;
  
  UPDATE note_performance
  SET mastery_level = v_new_level, updated_at = NOW()
  WHERE user_id = p_user_id AND midi_note = p_midi_note;
  
  RETURN v_new_level;
END;
$$ LANGUAGE plpgsql;
```

---

## Edge Functions

### `process-session` — Processa sessão concluída

```typescript
// supabase/functions/process-session/index.ts
// Chamada após cada exercício concluído

// 1. Salva a sessão
// 2. Atualiza note_performance para cada nota da sessão
// 3. Recalcula mastery_level para notas afetadas
// 4. Atualiza practice_days
// 5. Verifica se alguma música entra no Repertório
// 6. Retorna o resumo para o app exibir
```

### `get-ai-feedback` — Busca ou gera feedback da IA

```typescript
// 1. Monta o hash do padrão de erro
// 2. Verifica o cache
// 3. Se cache miss, chama Claude API
// 4. Valida o output
// 5. Salva no cache
// 6. Retorna o texto
```

---

## Storage — Samples de Áudio

```
supabase/storage/
  piano-samples/
    sf2/                    — Arquivo SoundFont original
    ogg/                    — Samples individuais por nota e velocity
      A0_pp.ogg             — Lá0, pianissimo
      A0_mf.ogg             — Lá0, mezzo-forte  
      A0_ff.ogg             — Lá0, fortíssimo
      ...
      C8_pp.ogg
      C8_mf.ogg
      C8_ff.ogg
    manifest.json           — Índice de todos os samples disponíveis
```

Samples baixados no primeiro uso do app (~80MB comprimidos) e cacheados localmente. Nunca redownload a menos que explicitamente solicitado.
