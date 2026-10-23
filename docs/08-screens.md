# 08 — Telas e Fluxo de UX

## Mapa de Navegação

```
[Splash / Onboarding]
         │
         ▼
[Home — Constelação]
    │         │
    ▼         ▼
[Praticar] [Repertório]
    │
    ▼
[Mapa de Aprendizado]
    │
    ▼
[Exercício]
    │
    ▼
[Resultado]
```

---

## Tela 01 — Splash

**Propósito:** Primeira impressão. Define o tom do produto em 2 segundos.

**Visual:**
- Fundo: `#0A0A0F` puro
- Centro: Um único ícone — um ponto dourado que pulsa suavemente
- Abaixo: "Piano Hero" em Playfair Display, fade in
- Sem tagline. Sem logo corporativo. Silêncio visual.

**Duração:** Mínima necessária para carregar (max 2s). Se o app já carregou, 800ms.

**Transição:** Dissolve para a Home.

---

## Tela 02 — Onboarding (apenas no primeiro uso)

**Propósito:** Diagnóstico inicial. Não é tutorial — é conversa.

**Tom:** Como um professor perguntando antes da primeira aula. Não um formulário.

**Fluxo:**

**2a — Boas-vindas**
```
"Vamos começar do jeito certo."
[Subtítulo em Instrument Sans: "Algumas perguntas rápidas para personalizar
seu aprendizado. Leva menos de 2 minutos."]
[Botão: "Vamos lá" em ouro]
```

**2b — Experiência anterior**
```
Pergunta: "Você já tocou piano antes?"
Opções (cards selecionáveis):
  □ Nunca toquei
  □ Aprendi um pouco (aulas, etc.)
  □ Aprendi e parei há mais de 1 ano
  □ Toco regularmente
```

**2c — Leitura de partitura**
```
Pergunta: "Você consegue ler partitura?"
  □ Não sei o que é
  □ Sei que existe, mas não leio
  □ Conheço as notas básicas
  □ Leio com facilidade
```

**2d — Objetivo musical**
```
Pergunta: "O que você mais quer tocar?"
  □ MPB e Bossa Nova
  □ Clássico
  □ Pop e Rock
  □ Jazz
  □ Trilhas de filmes/games
  □ Quero explorar tudo
```

**2e — Tempo disponível**
```
Pergunta: "Quanto tempo você tem por dia para praticar?"
  □ 5-10 minutos
  □ 15-20 minutos
  □ 30 minutos ou mais
  □ Varia muito
```

**2f — Teste prático (opcional)**
```
"Opcional: vamos ver onde você está agora."
[O app toca 5 notas simples. O usuário tenta identificar no teclado virtual.]
[Sem julgamento — só diagnóstico]
[Botão alternativo: "Pular — começar do zero"]
```

**2g — Resultado do diagnóstico**
```
"Perfeito, [nome]."
[Parágrafo curto sobre o plano inicial personalizado]
[Botão: "Começar meu primeiro exercício" em ouro]
```

---

## Tela 03 — Home (Constelação)

**Propósito:** Centro gravitacional do app. Onde você sempre retorna.

**Layout:**
```
┌─────────────────────────────────┐
│  Piano Hero          [Perfil]   │  ← Header mínimo
│  ─────────────────────────────  │
│                                 │
│   [CONSTELAÇÃO — tela cheia]    │  ← 70% da tela
│   88 estrelas                   │
│   interativas                   │
│                                 │
│  ─────────────────────────────  │
│  "Você está trabalhando em:     │
│   Melodia — Garota de Ipanema"  │  ← Card de contexto
│                                 │
│  [Praticar agora]  [Ver mapa]   │  ← 2 CTAs principais
└─────────────────────────────────┘
```

**Detalhes:**
- A constelação é interativa — toque em qualquer estrela para ver detalhes
- O card de contexto diz exatamente o que está em curso
- Nenhuma notificação intrusiva nessa tela
- Streak é exibido discretamente no header (ex: "🔥 12" em texto pequeno)

---

## Tela 04 — Mapa de Aprendizado

**Propósito:** Visão completa do currículo. Onde você está, para onde vai.

**Layout:**
```
┌─────────────────────────────────┐
│  ← Voltar    Seu Mapa           │
│  ─────────────────────────────  │
│                                 │
│  [Grafo de habilidades]         │
│  • Nós desbloqueados: claros    │
│  • Nós bloqueados: escuros      │
│  • Nó atual: pulsando em ouro   │
│                                 │
│  [Scroll vertical]              │
│                                 │
└─────────────────────────────────┘
```

**Interação:**
- Toque em qualquer nó desbloqueado: vai para os exercícios daquela habilidade
- Toque em nó bloqueado: mostra o que precisa ser completado para desbloquear
- Pinch: zoom in/out no mapa

---

## Tela 05 — Pré-Exercício

**Propósito:** Preparar o usuário. Definir expectativa. 10 segundos.

**Layout:**
```
┌─────────────────────────────────┐
│  ← Voltar                       │
│                                 │
│  Habilidade: Melodia — Camada 4 │  ← Label em DM Mono
│                                 │
│  "Garota de Ipanema"            │  ← Título em Playfair Display LG
│  — Tom Jobim                    │
│                                 │
│  Intro — Primeiros 8 compassos  │
│  Mão direita · 72 BPM           │
│                                 │
│  ────────────────               │
│  Foco de hoje:                  │  ← Insight da IA (2 linhas max)
│  "Presta atenção nas colcheias  │
│   nos compassos 3 e 7."         │
│  ────────────────               │
│                                 │
│  [Praticar]          [Ouvir →]  │  ← Ouvir toca o exercício sem input
└─────────────────────────────────┘
```

---

## Tela 06 — Exercício (a tela mais importante)

**Propósito:** O coração do app. Onde o aprendizado acontece.

**Layout portrait — tablet:**
```
┌─────────────────────────────────┐
│  [Score]    [BPM: 72]  [✕ Sair] │  ← HUD topo — 8% da altura
│═════════════════════════════════│
│                                 │
│  │  │ │  │  │  │ │  │ │  │  │  │  ← 12 trilhas de notas (2 oitavas)
│  │  │ │  │  │  │ │  │ │  │  │  │
│  │  ▓ │  │  │  │ │  │ │  │  │  │  ← ▓ = nota em queda
│  │  │ │  │  │  │ │  │ │  │  │  │
│  │  │ │  │  │  │ │  │ │  │  │  │
│  │  │ │  │  │  │ │  │ │  │  │  │
│                                 │
│  ═══════════════════════════════│  ← Linha de acerto (sutil)
│                                 │  ← 62% da altura
│  [██ ██ ██ ██ ██ ██ ██ ██ ██]  │  ← Teclado virtual — 25% da altura
└─────────────────────────────────┘
```

**HUD (cabeçalho):**
- Score: em DM Mono 32px, atualiza em tempo real com micro-bounce
- BPM: exibido constantemente
- Saída: botão discreto, sem confirmação no meio do exercício (pausa primeiro)

**Trilho de notas:**
- Fundo: striped subtis para cada trilha (as linhas das teclas)
- Linha de acerto: 1px dourado a 85% da altura da tela
- Metronome visual: fundo pulsa em opacity +2% nos beats (imperceptível conscientemente, sentido subconscientemente)

**Teclado virtual:**
- 14 teclas visíveis (2 oitavas centradas na região do exercício)
- Destaque das teclas que serão pressionadas: glow sutil dourado "pré-ilumina" a tecla 200ms antes da nota chegar à linha de acerto

---

## Tela 07 — Pausa

**Propósito:** Respirar sem perder contexto.

**Visual:**
- Blur no conteúdo da tela de exercício ao fundo
- Card central com:
  - Progresso atual (compassos completados / total)
  - Precisão até agora
  - Botões: "Continuar", "Recomeçar", "Sair"
- Simples, rápida, sem distrações

---

## Tela 08 — Resultado do Exercício

**Propósito:** Feedback claro + motivação para continuar.

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│  ✓ Exercício concluído          │  ← Ícone + label
│                                 │
│        87%                      │  ← Número grande, Playfair Display
│     Precisão                    │
│                                 │
│  Timing: -12ms médio            │  ← Detalhes em DM Mono
│  Streak máximo: 14 notas        │
│                                 │
│  ─────────────────────          │
│  "Seu timing está ótimo.        │  ← Feedback da IA
│   Atenção ao Fá# no compasso   │
│   3 — você antecipou 3x."       │
│  ─────────────────────          │
│                                 │
│  ▓ Fá# está em aprendizado      │  ← Nota na constelação atualizada
│                                 │
│  [Próximo exercício →]          │  ← CTA principal
│  [Repetir]  [Ver detalhes]      │  ← Secundários
└─────────────────────────────────┘
```

---

## Tela 09 — Resumo de Sessão

**Propósito:** Fechar o loop da sessão. Sair sentindo que valeu.

**Layout:**
```
┌─────────────────────────────────┐
│  Sessão de hoje                 │
│  ─────────────────────          │
│                                 │
│  23 min praticados              │
│  4 exercícios                   │
│  89% de precisão média          │
│                                 │
│  Você melhorou em:              │
│  ★ Fá# (+15% de acerto)         │
│  ★ Timing geral (-8ms)          │
│                                 │
│  Próxima sessão vai focar em:   │
│  → Mão esquerda, compassos 5-8  │
│                                 │
│  [Encerrar]  [Mais 10 minutos]  │
└─────────────────────────────────┘
```

---

## Tela 10 — Repertório

**Propósito:** Sua biblioteca de músicas conquistadas.

**Layout:**
```
┌─────────────────────────────────┐
│  ← Voltar    Seu Repertório     │
│  3 músicas                      │
│  ─────────────────────────────  │
│                                 │
│  [Card] Ode à Alegria           │
│         Beethoven               │
│         Adicionada: Jan 2026    │
│         Melhor: 94% · 88 BPM    │
│                                 │
│  [Card] Aquarela                │
│         Toquinho                │
│         Adicionada: Fev 2026    │
│         Melhor: 91% · 76 BPM    │
│                                 │
│  [+ Em progresso]               │
│  Garota de Ipanema — 67%        │
│                                 │
└─────────────────────────────────┘
```

**Interação em cada card:**
- Toque: vai para tela de detalhes da música
- Toque longo: opções (tocar em modo performance, tocar em modo prática, ver histórico)

---

## Tela 11 — Perfil e Estatísticas

**Propósito:** Visão completa do progresso histórico.

**Seções:**
1. Estatísticas gerais (horas totais, músicas, streak)
2. Gráfico de minutos por semana (8 semanas)
3. Notas mais fortes e mais fracas
4. Configurações do app

---

## Fluxo Crítico — Conexão MIDI

**Quando o teclado físico não está conectado:**
- Teclado virtual funciona normalmente
- Banner discreto no topo: "Conecte seu Roland para melhor experiência"
- Sem bloqueio de funcionalidade

**Fluxo de conexão:**
```
1. Usuário abre Configurações → "Conectar teclado"
2. App busca dispositivos BLE MIDI
3. Lista aparece com nome do dispositivo
4. Usuário seleciona "Roland GO-88PX"
5. Conexão estabelecida: feedback visual + som de confirmação
6. Banner verde discreto por 2 segundos: "Roland GO-88PX conectado"
```

**Perda de conexão durante exercício:**
- Pausa automática (não interrompe — pausa)
- Banner: "Conexão perdida. Reconectando..."
- Ao reconectar: retoma exatamente de onde parou
