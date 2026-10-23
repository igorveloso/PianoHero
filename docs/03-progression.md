# 03 — Sistema de Progressão

## Filosofia: Progresso Tangível, Não Abstrato

XP é uma mentira bem intencionada. Você acumula 10.000 XP e não sabe o que isso significa no mundo real. Piano Hero mede progresso em coisas reais:

1. **Músicas no repertório** — o que você consegue tocar
2. **Velocidade máxima sustentada** — BPM que você mantém com 90%+ de precisão
3. **Cobertura do teclado** — quais notas você dominou (a constelação)
4. **Tempo de prática real** — minutos tocando, não minutos no app

---

## A Constelação — Visualização Principal de Progresso

### O conceito

A tela de progresso central não é um gráfico de barras. É uma **constelação de 88 estrelas** — uma para cada tecla do piano.

Cada estrela tem estados visuais:

| Estado | Visual | Significado |
|---|---|---|
| **Não tocada** | Ponto cinza muito pequeno, quase invisível | Nunca foi trabalhada |
| **Introduzida** | Ponto branco pequeno, estático | Apareceu em exercícios |
| **Em aprendizado** | Círculo azul-pálido pulsando suavemente | Aparece com erros frequentes |
| **Em consolidação** | Círculo branco médio, pulso lento | Precisa de mais repetição |
| **Dominada** | Estrela dourada brilhante | Precisão >90% consistente |
| **Masterizada** | Estrela dourada com glow e partículas ocasionais | >95% em velocidade avançada |

### O efeito visual

As estrelas estão organizadas exatamente como as 88 teclas — da mais grave (esquerda) à mais aguda (direita), com as pretas levemente acima das brancas. A constelação reflete a anatomia real do piano.

Conforme você avança, a constelação vai se iluminando da esquerda para a direita, do centro para as extremidades — seguindo a progressão pedagógica natural do instrumento.

### Interação

- Toque em qualquer estrela para ver: nome da nota, suas estatísticas (% de acerto, última vez que foi treinada, exercícios completados)
- Pinch para zoom: ver a constelação inteira ou focar em uma região
- A constelação é a tela de abertura do app — você sempre começa vendo seu progresso

---

## O Mapa de Aprendizado

### O conceito

Inspirado no mapa do Duolingo, mas com estética de partitura antiga e não infantilizada.

O mapa é um **grafo visual** onde cada nó é uma habilidade musical. Habilidades desbloqueadas ficam claras e acessíveis. Habilidades bloqueadas ficam escuras com um cadeado sutil.

### Estrutura do mapa

```
[NOTAS NATURAIS] ─── [NOTAS PRETAS] ─── [OITAVAS]
       │                    │                 │
[POSIÇÃO MÃO D]      [POSIÇÃO MÃO E]   [ESCALAS MAIORES]
       │                    │                 │
[RITMO BÁSICO] ─────────────┴─────────[ESCALAS MENORES]
       │                                      │
[MELODIA MPB] ──── [MELODIA CLÁSSICA] ──[ARPEJOS]
       │                    │                 │
[ACORDES MAIORES] ──[ACORDES MENORES]──[CAMPO HARMÔNICO]
       │                    │                 │
       └────────────[DUAS MÃOS]───────────────┘
                          │
              [REPERTÓRIO AVANÇADO]
```

### Bifurcações de gênero

No nível de melodia, o usuário escolhe seu caminho principal:
- **Trilha MPB:** Bossa nova, samba, baião
- **Trilha Clássica:** Períodos barroco, clássico, romântico
- **Trilha Pop/Rock:** Pop contemporâneo, rock, R&B
- **Trilha Jazz:** Blues, jazz básico, improvisação

Cada trilha leva ao mesmo destino (independência de mãos e repertório), mas por músicas diferentes. O usuário pode percorrer múltiplas trilhas.

---

## O Repertório — O Indicador Mais Importante

### A lista de músicas aprendidas

A "Library" do usuário é uma lista permanente de músicas que ele consegue tocar. Uma música entra na Library quando:
- Precisão média ≥ 85% por 3 sessões consecutivas
- Velocidade ≥ 80% do BPM original
- Duas mãos (quando aplicável)

Uma música nunca some da Library. É a prova irrefutável do que você conquistou.

### Exibição visual

Cada música na Library mostra:
- Capa/arte gerada proceduralmente baseada no título
- Data em que entrou no repertório
- BPM máximo atingido
- Seu "recorde pessoal" de precisão
- Botão para tocar novamente (modo performance ou modo prática)

---

## Streak e Sessões

### Streak diário

O streak existe, mas não é o foco principal. Perde-se o streak apenas se ficar 2 dias sem praticar (não 1 dia — vida acontece).

O streak é exibido discretamente, não na tela principal. Não é o protagonista.

### Streak semanal (mais importante)

O "weekly score" mostra: quantos minutos você praticou nessa semana vs. semana passada. Sem julgamento moral — só dado.

### Sessão de recuperação

Se você ficar mais de 5 dias sem abrir o app, ao retornar o app faz um "aquecimento de retorno" de 5 minutos: revisão rápida das notas mais trabalhadas, sem pressão. Não pune. Reconecta.

---

## XP — O Papel Secundário

XP existe, mas como moeda secundária para desbloquear conteúdo cosmético:
- Temas visuais alternativos para o app
- Sons alternativos de piano (grand piano, upright, electric piano)
- Esquemas de cor para as notas caindo

XP **nunca** é usado para desbloquear conteúdo pedagógico. Aprendizado não tem paywall.

---

## Marcos de Progressão

Marcos são momentos especiais de celebração, raros o suficiente para importar:

| Marco | Gatilho | Celebração |
|---|---|---|
| **Primeira nota** | Primeira nota tocada corretamente | Animação única de abertura |
| **Escala completa** | Primeira escala de Dó maior completa | Teclado acende da esq. à dir. |
| **Primeira melodia** | Primeira música completa na Library | Tela especial, compartilhável |
| **Duas mãos** | Primeira música com duas mãos | Animação mais elaborada do app |
| **10 músicas** | 10 músicas na Library | "Recital" — lista especial |
| **30 dias** | Streak de 30 dias | Desbloqueio de tema especial |
| **1 ano** | 365 dias de uso | Easter egg ainda não definido |

Marcos **nunca** interrompem o fluxo do app desnecessariamente. São celebrações rápidas, elegantes, não modais que exigem clique para fechar.

---

## Dados de Progresso Exibidos

### Tela de perfil
- Tempo total de prática (horas)
- Músicas no repertório (número)
- Nota mais precisa (qual nota você toca melhor)
- Nota mais problemática (qual você mais erra)
- Velocidade máxima sustentada por música
- Gráfico de minutos praticados por semana (últimas 8 semanas)

### Após cada exercício
- Precisão (%)
- Timing médio (ms de desvio)
- Notas com mais erro (lista curta)
- Comparação com sua média histórica ("melhor que sua média em 3%")

### Após cada sessão
- Resumo de 30 segundos: o que você praticou, quanto melhorou
- "Próxima sessão vai focar em:" — o app já te diz o que vem
