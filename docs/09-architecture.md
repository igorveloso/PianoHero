# 09 — Arquitetura Técnica

## Decisões Fundamentais e Por Quê

Cada decisão técnica aqui tem um motivo. Nenhuma escolha é por hábito ou familiaridade.

---

## Stack Completa

### App — React Native + Expo

**Por quê React Native e não Flutter:**
- Você já tem experiência com React/Next.js (PlantaViva)
- O ecossistema de bibliotecas MIDI e áudio para RN é mais maduro
- Expo simplifica o build e distribuição para iOS e Android

**Por quê não PWA:**
- Web MIDI API não funciona no Safari (iOS) — bloqueio da Apple
- Web Bluetooth tem latência alta e conectividade instável
- Para um app de ritmo onde 50ms importam, PWA é inaceitável

**Configuração Expo:**
```json
{
  "expo": {
    "name": "Piano Hero",
    "slug": "piano-hero",
    "platforms": ["ios", "android"],
    "plugins": [
      "expo-av",
      "react-native-ble-plx"
    ]
  }
}
```

---

### Animações — Reanimated 3 + Skia

**Por quê Reanimated 3 e não Animated API nativa:**
- Reanimated 3 roda na UI thread, não na JS thread
- Notas caindo a 60fps sem jank mesmo com lógica MIDI processando na JS thread
- `useSharedValue`, `withTiming`, `withSpring` — API expressiva e performática

**Por quê Skia:**
- Efeitos de partícula e glow não são possíveis com primitivas RN padrão
- Skia renderiza na GPU via Metal (iOS) e Vulkan (Android)
- Shaders customizados para o grain overlay

```typescript
// Exemplo: nota caindo em Reanimated 3
const noteY = useSharedValue(-50);
const noteOpacity = useSharedValue(0);

const animateNote = () => {
  noteOpacity.value = withTiming(1, { duration: 120 });
  noteY.value = withTiming(
    SCREEN_HEIGHT * 0.85, // hit line position
    {
      duration: noteDropDuration, // calculado pelo BPM
      easing: Easing.bezier(0.4, 0, 0.6, 1),
    }
  );
};
```

---

### MIDI — react-native-ble-plx + parser customizado

**Por quê BLE e não USB:**
- Objetivo é wireless (teclado → tablet sem fio)
- Roland GO-88PX tem BLE MIDI nativo via Bluetooth 5.0

**Latência target:** < 15ms end-to-end (BLE MIDI → parse → feedback visual)

**Fluxo de processamento MIDI:**
```
[Roland GO-88PX]
      │ BLE MIDI (Bluetooth 5.0)
      ▼
[react-native-ble-plx] — recebe bytes raw
      │
      ▼
[MIDI Parser] — converte para eventos tipados
      │ { type: 'noteOn', note: 65, velocity: 87, timestamp: 1234567 }
      ▼
[Event Queue] — fila com timestamp
      │
      ▼
[Timing Evaluator] — compara com gabarito do exercício
      │ { accuracy: 'perfect', deviation: -12ms }
      ▼
[State Update] — atualiza score, animações, feedback
```

**Calibração de latência:**
O app inclui uma rotina de calibração na primeira conexão. O usuário aperta uma tecla e o app mede a latência real do dispositivo + BLE. Esse offset é aplicado em todas as comparações de timing futuras.

---

### Áudio — Sampler customizado com samples de Yamaha CFX

**Por quê não sintetizador:**
- Piano sintetizado soa artificial e desmotiva o aprendizado
- O usuário precisa ouvir o som real do instrumento

**Fonte de samples:**
- [Salamander Grand Piano](https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html) — samples de Yamaha C5 em Creative Commons
- 88 notas × múltiplos velocity layers × pedal on/off
- ~500MB de samples (comprimidos com Opus)

**Engine de áudio:**
```typescript
// react-native-audio-pro para playback de baixa latência
// Pre-carrega os samples da região ativa do exercício
// Mantém buffer de 128 samples para latência mínima

class PianoSampler {
  private buffers: Map<number, AudioBuffer> = new Map();
  
  async preloadRegion(centerNote: number, range: number = 12) {
    // Carrega apenas as notas que serão usadas no exercício
    for (let note = centerNote - range; note <= centerNote + range; note++) {
      await this.loadSample(note);
    }
  }
  
  playNote(midiNote: number, velocity: number) {
    const buffer = this.buffers.get(midiNote);
    const gain = velocity / 127;
    // Playback com ganho proporcional à velocidade
  }
}
```

---

### Backend — Supabase

**Por quê Supabase:**
- PostgreSQL gerenciado com Row Level Security nativo
- Auth completo (email, Google, Apple)
- Realtime para sync entre dispositivos
- Storage para os samples de áudio
- Você já tem familiaridade do PlantaViva

**Schema principal:**

```sql
-- Usuários
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_data JSONB,  -- Respostas do onboarding
  settings JSONB          -- Preferências do app
);

-- Exercícios completados
CREATE TABLE exercise_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  exercise_id TEXT NOT NULL,          -- ex: "M-23"
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  accuracy NUMERIC(5,2),              -- 0-100
  avg_timing_deviation INTEGER,       -- ms
  note_errors JSONB,                  -- { "F#4": 3, "C4": 1 }
  bpm INTEGER,
  duration_seconds INTEGER
);

-- Performance por nota
CREATE TABLE note_performance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  midi_note INTEGER NOT NULL,         -- 0-127
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  avg_timing_deviation INTEGER,
  last_practiced TIMESTAMPTZ,
  mastery_level TEXT DEFAULT 'unseen' -- unseen|introduced|learning|consolidating|mastered|expert
);

-- Repertório
CREATE TABLE repertoire (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles,
  song_id TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  best_accuracy NUMERIC(5,2),
  best_bpm INTEGER,
  play_count INTEGER DEFAULT 0
);

-- Streak e sessões diárias
CREATE TABLE practice_days (
  user_id UUID REFERENCES profiles,
  practice_date DATE NOT NULL,
  total_minutes INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, practice_date)
);
```

---

### Conteúdo — JSON Curado + Grafo

**Estrutura de um exercício:**

```typescript
interface Exercise {
  id: string;                    // "M-23"
  type: 'recognition' | 'position' | 'rhythm' | 'melody' | 'harmony' | 'independence' | 'repertoire';
  layer: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;                 // "Garota de Ipanema — Intro"
  composer?: string;
  bpm: number;
  bpmRange: [number, number];    // Range aceitável [min, max]
  timeSignature: [number, number]; // [4, 4]
  keySignature: string;          // "C" | "G" | "F" etc
  hands: 'right' | 'left' | 'both';
  notes: NoteEvent[];
  prerequisites: string[];       // IDs de exercícios que devem ser completados antes
  passingAccuracy: number;       // 0-100, geralmente 80 ou 85
  genre: 'mpb' | 'classical' | 'pop' | 'jazz' | 'game';
  difficulty: 1 | 2 | 3 | 4 | 5;
  focusNotes: number[];          // MIDI notes que merecem atenção especial
  pedagogyNote?: string;         // Nota para a IA usar no contexto
}

interface NoteEvent {
  time: number;    // em ticks (baseado no BPM)
  note: number;    // MIDI note number
  duration: number; // em ticks
  finger?: number; // 1-5, dedo sugerido
  velocity: number; // 1-127
}
```

**Grafo de dependências (exemplo):**
```json
{
  "M-23": {
    "requires": ["M-20", "R-15"],
    "unlocks": ["M-24", "M-28"]
  }
}
```

---

### IA — Claude API com contexto restrito

**Model:** `claude-sonnet-4-20250514`

**Temperatura:** `0.3` — baixa para consistência

**System prompt base:**
```
Você é o assistente pedagógico do Piano Hero, um app de aprendizado de piano.

Sua função é EXCLUSIVAMENTE:
1. Transformar dados de performance em feedback em português brasileiro
2. Explicar padrões de erro de forma clara e empática
3. Sugerir estratégias de prática baseadas nos exercícios disponíveis

Você NUNCA deve:
- Inventar exercícios que não existem no banco
- Fazer promessas de prazo ("você vai aprender em X semanas")
- Dar conselhos médicos ou de postura
- Recomendar recursos externos ao app
- Responder sobre tópicos não relacionados ao piano ou ao progresso do usuário

Tom: Professor paciente e direto. Sem elogios vazios ("Ótimo trabalho!").
Comprimento: Máximo 3 frases por feedback de exercício.
```

---

## Performance e Qualidade

### Targets de performance

| Métrica | Target |
|---|---|
| Latência MIDI → visual | < 15ms |
| Frame rate animações | 60fps constante |
| Tempo de início do app | < 2s |
| Tempo de carregamento de exercício | < 500ms |
| Latência áudio (toque → som) | < 10ms |

### Testes automatizados críticos

1. **Teste de timing:** O avaliador de precisão precisa ser correto dentro de ±2ms
2. **Teste de grafo:** Nenhum exercício com prerequisito circular
3. **Teste de exercícios:** Todo exercício no banco tem schema válido
4. **Teste de IA:** Outputs da Claude API passam nas validações de qualidade

### Offline first

O app funciona sem internet para:
- Todos os exercícios (dados locais)
- Progresso (sync quando reconectar)
- Samples de áudio (baixados no onboarding)

Requer internet para:
- Feedback da IA
- Sync de progresso entre dispositivos
- Download de novos exercícios e músicas
