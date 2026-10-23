# 02 — Arquitetura Pedagógica

## Princípio: Camadas, Não Níveis

A maioria dos apps de música organiza conteúdo em "níveis" lineares. Isso é um erro pedagógico. Piano não é linear — é uma rede de habilidades interdependentes.

Piano Hero organiza o aprendizado em **7 camadas**, onde cada camada desenvolve uma habilidade cognitiva distinta. O aluno pode estar na camada 3 em escalas e na camada 1 em acordes simultaneamente. Isso reflete a realidade do aprendizado musical.

---

## As 7 Camadas

### Camada 1 — Reconhecimento Auditivo-Motor
**Habilidade:** Ouvir uma nota e apertar a tecla certa. Sem ritmo ainda.

**Por que começa aqui:** O cérebro precisa construir o mapa entre som e posição antes de qualquer coisa. Aprender nome, posição visual e som simultâneamente é sobrecarga cognitiva.

**Como funciona no app:**
- O app toca uma nota. Você encontra ela no teclado.
- Sem pressão de tempo. Sem notas caindo.
- Feedback imediato: acertou ou errou, qual era a nota certa.
- Progressão: notas brancas → notas pretas → combinações

**Duração estimada:** 1-2 semanas de prática diária (15 min)

**Exercícios:** C1 a C20 no banco de exercícios

---

### Camada 2 — Posição e Dedilhado
**Habilidade:** Posição correta de mão. Qual dedo toca qual nota.

**Por que essa camada existe:** Dedilhado errado no início cria hábitos que levam meses para desfazer. Tendinite e lesão por esforço repetitivo vêm de posição errada aprendida cedo.

**Como funciona no app:**
- O app mostra a posição da mão em 3D sobre o teclado
- Cada nota tem o número do dedo correto indicado
- O app detecta via MIDI quais teclas foram pressionadas, mas não pode detectar qual dedo — por isso usa exercícios que forçam o dedilhado correto estruturalmente
- Alertas visuais para erros de dedilhado inferidos

**Nota importante:** Esta é a única camada onde não existe "notas caindo". É deliberadamente lenta e contemplativa.

**Duração estimada:** 2-3 semanas paralelas às outras camadas

**Exercícios:** D1 a D25 no banco de exercícios

---

### Camada 3 — Ritmo Básico
**Habilidade:** Tocar notas no tempo certo. Aqui entram as notas caindo.

**Por que apenas agora:** O usuário já sabe onde estão as notas. O cérebro pode focar no timing sem buscar a posição simultaneamente.

**Como funciona no app:**
- Notas caem em trilhas correspondentes às teclas
- Janela de acerto: ±80ms = perfeito, ±150ms = bom, ±250ms = ok, além disso = erro
- BPM começa em 60, sobe gradualmente
- Metronome visual pulsa no fundo da tela

**Valores rítmicos introduzidos progressivamente:**
1. Semínimas (1 batida)
2. Mínimas (2 batidas)
3. Semibreves (4 batidas)
4. Colcheias (½ batida)
5. Pausas (silêncios)
6. Semicolcheias e síncopes (camadas avançadas)

**Duração estimada:** Permanente — ritmo é refinado para sempre

**Exercícios:** R1 a R40 no banco de exercícios

---

### Camada 4 — Melodia
**Habilidade:** Tocar sequências musicais reais. Uma mão. Uma linha melódica.

**Por que é a camada mais importante:** É aqui que o cérebro começa a associar piano com música de verdade, não com exercício. A recompensa emocional explode aqui.

**Como funciona no app:**
- Fragmentos de músicas reais, começando simples
- Mão direita (melodia) por padrão. Opção de treinar mão esquerda separadamente.
- O usuário escolhe o gênero: MPB, clássico, pop, jazz
- O sistema seleciona melodias adequadas ao nível

**Músicas de entrada por gênero:**
- MPB: Aquarela (Toquinho), Garota de Ipanema (melodia), Asa Branca
- Clássico: Ode à Alegria, Minueto em Sol (Bach), Fur Elise (intro)
- Pop: Let It Be (intro), Someone Like You (melodia), Believer
- Game: Tetris theme, Zelda's Lullaby, Simple Piano themes

**Duração estimada:** 4-8 semanas por gênero antes de avançar

**Exercícios:** M1 a M60 no banco de exercícios

---

### Camada 5 — Harmonia
**Habilidade:** Acordes. A mão esquerda entra pela primeira vez.

**Por que é cognitivamente difícil:** O cérebro precisa processar múltiplas notas simultâneas como uma unidade sonora, não como notas individuais. Isso requer retreinamento perceptual.

**Como funciona no app:**
- Acordes apresentados como blocos visuais, não trilhas individuais
- Progressão: tríades maiores → tríades menores → acordes de 7ª → inversões
- Campo harmônico: os 7 acordes de cada tonalidade
- Cifras (C, Am, F, G) exibidas acima das notas caindo

**Acordes obrigatórios para "nível intermediário":**
C, Dm, Em, F, G, Am, Bdim (campo de Dó maior)
G, Am, Bm, C, D, Em, F#dim (campo de Sol maior)
+ relativas menores de ambos

**Duração estimada:** 6-12 semanas

**Exercícios:** H1 a H50 no banco de exercícios

---

### Camada 6 — Independência de Mãos
**Habilidade:** As duas mãos tocam coisas diferentes simultaneamente.

**Por que é o maior salto:** É a habilidade que define se alguém "sabe tocar piano" ou não. O cérebro precisa criar dois streams motores independentes. Isso é neurológicamente desafiador para adultos.

**Como funciona no app:**
- Modo de treino dividido: primeiro só mão esquerda, depois só direita, depois juntas
- Velocidade reduzida: começa em 50% do BPM original
- Visualização em dois trilhos separados por cor
- Destaque alternante: quando uma mão erra, o trilho dela pisca

**Técnica pedagógica:** Prática de "mãos separadas" é validada cientificamente. O app força isso antes de juntar.

**Duração estimada:** 8-16 semanas. Não existe atalho aqui.

**Exercícios:** I1 a I40 no banco de exercícios

---

### Camada 7 — Repertório e Expressão
**Habilidade:** Tocar músicas completas com dinâmica, expressão e musicalidade.

**Por que é o destino, não o fim:** Não existe "terminar" o piano. Esta camada é infinita por definição.

**Como funciona no app:**
- Músicas completas em MIDI, sincronizadas com partitura
- Marcadores de dinâmica: piano (p), forte (f), crescendo
- Análise de expressividade: o app detecta variação de velocidade e velocidade de toque
- Modo "performance": sem notas caindo, só partitura. O usuário toca como músico.

**O destino final:** O usuário desliga o app, senta no piano, e toca.

---

## Grafo de Dependências

```
Camada 1 (Reconhecimento)
    └──> Camada 2 (Posição) ──> Camada 6 (Independência)
    └──> Camada 3 (Ritmo) ──> Camada 4 (Melodia) ──> Camada 6
                                    └──> Camada 5 (Harmonia) ──> Camada 6
                                                                      └──> Camada 7 (Repertório)
```

O usuário não pode entrar na Camada 6 sem ter completado pelo menos 70% das camadas 2, 4 e 5.

---

## Sessão Ideal (15-30 minutos)

Cada sessão tem estrutura fixa:

1. **Aquecimento (3 min):** Exercício de escala ou arpejo da aula anterior. Sem pressão, só aquecimento.
2. **Revisão (5 min):** Repetição espaçada — o sistema traz os exercícios onde você errou mais na última sessão.
3. **Novo conteúdo (10 min):** Um conceito novo ou avanço no exercício atual.
4. **Aplicação (7 min):** O novo conceito aplicado em fragmento musical real.
5. **Resumo (30 seg):** Tela de progresso. O que você aprendeu hoje. Qual é o próximo passo.

Sessões menores (5-10 min) são suportadas — o app adapta a estrutura.

---

## Princípios Pedagógicos Que Nunca Quebramos

1. **Nunca introduza dois conceitos novos na mesma sessão.** Um novo conceito por vez.
2. **Nunca avance com menos de 80% de precisão.** O app não permite pular. Rigor é respeito.
3. **Sempre termine com algo que soa bem.** A última experiência da sessão precisa ser positiva.
4. **Feedback imediato é inegociável.** Latência de feedback acima de 100ms prejudica o aprendizado motor.
5. **Velocidade lenta não é derrota.** O app celebra tocando devagar e certo, não rápido e errado.
