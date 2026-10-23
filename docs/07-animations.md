# 07 — Sistema de Animações

## Princípio: Animação Como Informação

Animação ruim é movimento sem propósito. Toda animação no Piano Hero existe por uma razão funcional — ela comunica algo que texto ou cor sozinhos não conseguiriam. Se uma animação pode ser removida sem perda de informação ou emoção, ela não deveria existir.

**Regras globais:**
- Todas as animações respeitam `prefers-reduced-motion`
- Animações de gameplay (notas caindo) rodam na thread de UI, nunca na JS thread
- Nenhuma animação bloqueia input do usuário
- Timing de todas as animações é múltiplo do BPM atual quando possível

---

## Animações de Gameplay

### 1. Nota em queda (a animação mais importante do app)

**O que comunica:** "Esta nota vai ser tocada. Prepare-se."

**Anatomia visual:**
```
Estado 1 — Nascimento (topo da tela)
  • Fade in de 120ms
  • Escala: 0.8 → 1.0 com easing overshoot leve
  • Cor: accent-hit com 40% opacity

Estado 2 — Descida (70% do percurso)
  • Velocidade constante (linear) — previsibilidade é essencial para timing
  • Glow cresce linearmente: de 4px para 12px
  • Opacity: 40% → 100%

Estado 3 — Zona de acerto (últimos 30% antes do teclado)
  • Glow pulsa no BPM da música
  • Borda ganha 1px adicional
  • Leve aceleração (cubic-bezier(0.4, 0, 0.6, 1)) — cria sensação de gravidade

Estado 4a — Acerto perfeito
  • A nota "explode" em partículas que sobem (direção oposta à queda)
  • Anel de onda se expande a partir da base da nota
  • Duração: 300ms
  • Partículas: 8-12, velocidade e ângulo aleatórios dentro de ±30° do vertical

Estado 4b — Acerto "bom"
  • Versão reduzida do acerto perfeito: menos partículas, anel menor
  • Sem o glow final

Estado 4c — Acerto "ok"
  • A nota some com fade rápido (150ms)
  • Flash âmbar na tecla correspondente

Estado 4d — Miss (nota passou sem ser tocada)
  • A nota continua a tela, desce e some abaixo do teclado com fade
  • Flash vermelho sutil no trilho
  • Sem vibração — vibração excessiva é punitiva e quebra concentração
```

**Implementação:** Reanimated 3 com `withTiming` para a descida, `withSpring` para o overshoot do nascimento.

---

### 2. Tecla do teclado ao ser pressionada

**O que comunica:** Confirmação de que o MIDI foi recebido.

**Animação:**
```
Tecla branca:
  Press:   translateY: 0 → 3px, bg: key-white → key-white-pressed (80ms, ease-out)
  Release: translateY: 3 → 0px, bg: restore (120ms, ease-in)

Tecla preta:
  Press:   translateY: 0 → 2px, bg: key-black → key-black-pressed (80ms, ease-out)
  Release: translateY: 2 → 0px, bg: restore (120ms, ease-in)

Em acerto perfeito (extra):
  Glow radial de accent-hit sobe da tecla por 200ms, opacity 0 → 0.8 → 0
```

**Por que física importa:** A tecla precisa parecer que está sendo pressionada de verdade. Sem isso, o feedback visual é artificial e não reforça a memória muscular.

---

### 3. Anel de onda (ripple)

**O que comunica:** "Você tocou aqui." Âncora espacial do acerto.

**Animação:**
```
Origem: Centro da tecla pressionada
Expansão: raio 0 → 80px, duration: 400ms, easing: ease-out
Opacity: 0.8 → 0, simultâneo com expansão
Cor: Correspondente ao tipo de acerto (hit, good, ok, miss)
Border: 2px sólido, sem fill
```

---

### 4. Partículas de acerto perfeito

**O que comunica:** Recompensa máxima. Catarse visual.

**Animação:**
```
Número de partículas: 10-14 (aleatório)
Forma: Círculos de 3-6px (aleatório)
Cor: Mix de accent-hit e gold, aleatório por partícula
Trajetória: Arcos com física de gravidade (sobem e depois caem)
  - velocidade_inicial: 200-400px/s (aleatória)
  - ângulo: -150° a -30° (amplo arco para cima)
  - gravidade: 800px/s²
Duração total: 600-900ms
Opacity: 1.0 → 0 na segunda metade da trajetória
```

---

### 5. Streak visual progressivo

**O que comunica:** Você está em fluxo. Não pare.

```
Streak 1-4:    Sem efeito especial
Streak 5-9:    As notas ficam 10% mais brilhantes
Streak 10-14:  Glow das teclas aumenta. Fundo pulsa levemente no BPM (opacity ±2%)
Streak 15-19:  Partículas douradas emergem aleatoriamente das teclas tocadas
Streak 20+:    Estado "ignição" — bordas do trilho ganham glow dourado pulsante
               Cada acerto gera micro-flash dourado no HUD de score
```

**Ao quebrar o streak:**
```
Flash vermelho no HUD de score: 200ms, opacity 0 → 0.6 → 0
Glow do streak volta ao estado neutro: 500ms, ease-in
Sem vibração, sem som extra — já existe o feedback do miss
```

---

## Animações de Navegação e Transição

### 6. Transição entre exercícios

**O que comunica:** Respiração. Este momento é deliberado, não um loading.

```
Fase 1 — Saída (400ms):
  • Trilho de notas: fade out + translateY: 0 → -20px
  • Teclado: permanece, fade para 30% opacity
  • Score: fica em posição

Fase 2 — Resultado (600ms no centro):
  • Card de resultado: scale: 0.9 → 1.0, fade in (200ms)
  • Números de precisão e timing: counter animado (como odômetro)
  • Notas mais erradas: aparecem em sequência com stagger de 80ms

Fase 3 — Entrada do próximo exercício (400ms):
  • Card de resultado: fade out + translateY: 0 → 20px
  • Novo trilho: fade in + translateY: -20px → 0
  • Teclado: volta para 100% opacity
```

---

### 7. Início de sessão

**O que comunica:** Presença. Concentração. O piano esperou por você.

```
1. Fundo: já está na tela (sem transição aqui)
2. Teclado: aparece do rodapé, translateY: 100px → 0, 600ms, ease-out
3. Título do exercício: fade in, 400ms, delay 200ms
4. Contagem regressiva (se habilitada): 3, 2, 1 — cada número
   • Scale: 2.0 → 1.0 com bounce, fade in/out simultâneo
   • Duration por número: 800ms
5. Início: trilho desce com a primeira nota
```

---

### 8. Progressão de nível

**O que comunica:** Você chegou em algum lugar.

Esta é a animação mais elaborada do app. Acontece raramente — por isso pode durar mais.

```
Duração total: 3-4 segundos

1. Fade out suave do conteúdo atual (300ms)
2. Tela escurece para #0A0A0F puro (200ms)
3. O teclado virtual acende nota a nota, da esquerda para a direita
   • Cada tecla: flash de accent-hit → retorna para marfim
   • Timing: 30ms por tecla × 88 teclas = ~2.6 segundos
   • É uma escala cromática completa ascendente em velocidade real
   • O áudio toca cada nota correspondente (volume suave)
4. Ao chegar na última tecla: todas as teclas douradas por 500ms
5. Título do novo nível aparece em Playfair Display XL com fade in
6. Transição suave para a próxima tela
```

---

### 9. Entrada de música no Repertório

**O que comunica:** Conquista permanente. Esta música é sua agora.

```
1. Card da música: aparece com escala 0.8 → 1.0 + fade in (300ms, spring)
2. Título em Playfair Display: digitado letra por letra (typewriter effect)
   • Velocidade: 40ms por caractere
3. Data: fade in após o título completar
4. Ícone de "adicionada ao repertório": scale 0 → 1.2 → 1.0 (bounce, 400ms)
5. Pulso dourado que sai do card e se dissolve no fundo (400ms)
```

---

## Animações da Constelação

### 10. Estrela ao ser dominada

**O que comunica:** Esta nota é sua agora.

```
Transição: learning → mastered
  • Cor: azul → dourado, 800ms, ease-in-out
  • Tamanho: cresce 40% e volta (spring, 300ms)
  • Glow: aparece gradualmente nos 800ms
  • Micro-partículas: 4-6 pontos dourados que se dispersam e some

A estrela então "assenta" no estado mastered — pulso suave, orgânico,
como se respirasse. Frequência: uma pulsação a cada 3-4 segundos.
```

### 11. Visão geral da constelação ao abrir

```
As estrelas não aparecem todas de uma vez.
Elas surgem com stagger de 5-10ms, em ordem de posição
(esquerda para direita, como uma onda).
Stars que já foram dominadas têm um micro-twinkle aleatório
nas primeiras 2 segundos, antes de assentar no estado normal.
Total duration: ~1.5 segundos para a constelação completa.
```

---

## Animações de Feedback da IA

### 12. Card de feedback emergindo

```
Origem: abaixo da tela
Animação: translateY: 100% → 0, spring (damping: 20, stiffness: 200)
Fundo: bg-elevated com border gold-dim
Texto: digita-se progressivamente (typewriter, 25ms/char)
Dismiss: swipe down ou tap fora
```

---

## Timing de Referência

```
Micro (feedback imediato):    80-120ms
Curto (confirmação):          200-300ms
Médio (transição):            400-600ms
Longo (celebração):           800-1200ms
Épico (milestone):            2000-4000ms
```

**Regra:** Micro e Curto são imperceptíveis como animação — sentidos como responsividade. Médio é percebido, Longo é apreciado, Épico é memorável.

---

## Implementação — Bibliotecas

**React Native Reanimated 3** — para todas as animações de UI
- `withTiming` — transições lineares com easing customizado
- `withSpring` — física de mola para acertos e modais
- `withSequence` — composição de animações em série
- `withDelay` — stagger de elementos

**React Native Skia** — para efeitos de partícula e glow
- Renderização na GPU, sem impacto na JS thread
- Shaders customizados para o grain overlay e glow das notas

**Lottie** (apenas para marcos especiais)
- Animações de milestone que são muito complexas para code
- Renderiza arquivos .lottie nativamente
