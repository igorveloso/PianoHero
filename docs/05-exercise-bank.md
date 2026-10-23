# 05 — Banco de Exercícios

## Estrutura e Primeiros 40 Exercícios

O banco de exercícios é a espinha dorsal do produto. Todo exercício é escrito manualmente, testado pedagogicamente, e nunca gerado por IA. A qualidade pedagógica desses exercícios é o que separa o Piano Hero de qualquer concorrente.

---

## Schema de Exercício

```typescript
interface Exercise {
  id: string;           // Prefixo + número: "C1", "D3", "R15", "M23"
  type: ExerciseType;
  layer: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  composer?: string;
  description: string;  // Para o usuário: o que vai praticar
  pedagogyNote: string; // Contexto para a IA: o que observar
  bpm: number;          // BPM alvo
  bpmRange: [number, number]; // [min aceitável, max]
  timeSignature: [number, number];
  keySignature: string;
  hands: 'right' | 'left' | 'both';
  genre?: Genre;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  passingAccuracy: number; // 0-100
  estimatedMinutes: number;
  focusNotes: number[]; // MIDI notes que merecem atenção especial
  notes: NoteEvent[];
}

// Prefixos de ID por tipo:
// C = recognition (Camada 1)
// D = position/dedilhado (Camada 2)
// R = rhythm (Camada 3)
// M = melody (Camada 4)
// H = harmony (Camada 5)
// I = independence (Camada 6)
// P = repertoire/performance (Camada 7)
```

---

## Camada 1 — Reconhecimento (C1 a C20)

### C1 — Dó Central
```
Título: "Dó Central"
Descrição: "Encontre e toque o Dó central (C4) — a nota do meio do teclado."
Nota pedagógica: "C4 é a nota de referência do piano. Usuário deve
                  memorizar sua posição visual antes de qualquer outra."
BPM: Sem tempo (modo livre)
Mão: Direita
Dificuldade: 1/5
Pré-requisitos: nenhum
Precisão mínima: 100% (1 nota, não tem erro possível repetido)
Notas: [C4 × 5 repetições]
Foco: Localização de C4, posição do polegar
```

### C2 — Dó em Oitavas
```
Título: "Família Dó"
Descrição: "Existem 8 Dós no piano. Vamos conhecer cada um."
BPM: Sem tempo
Notas: C2, C3, C4, C5, C6, C7 (graves ao agudo)
Foco: Padrão visual de C em qualquer oitava
Pré-requisitos: C1
```

### C3 — Dó, Ré, Mi
```
Título: "Três primeiras notas"
Descrição: "C, D, E — as três primeiras notas da escala de Dó."
BPM: 60 (com tempo, mas janela larga: ±500ms)
Notas: C4, D4, E4 em sequência, 3 repetições cada
Foco: Posição relativa das notas brancas próximas
Pré-requisitos: C2
```

### C4 — Fa, Sol, Lá, Si
```
Título: "Completando a escala"
Descrição: "F, G, A, B — as quatro notas restantes."
BPM: 60
Notas: F4, G4, A4, B4 em sequência
Pré-requisitos: C3
```

### C5 — Escala de Dó (ascendente)
```
Título: "Escala de Dó — subindo"
Descrição: "Todas as 8 notas de Dó a Dó, subindo."
BPM: 60
Notas: C4, D4, E4, F4, G4, A4, B4, C5
Pré-requisitos: C3, C4
Nota pedagógica: "Erro mais comum: confundir F com E. São vizinhas."
```

### C6 — Escala de Dó (descendente)
```
Título: "Escala de Dó — descendo"
Descrição: "De Dó agudo a Dó grave. Mesmo conteúdo, sentido inverso."
BPM: 60
Notas: C5, B4, A4, G4, F4, E4, D4, C4
Pré-requisitos: C5
```

### C7 — Notas pretas: Dó# e Ré#
```
Título: "Primeiras teclas pretas"
Descrição: "C# e D# — as duas primeiras notas pretas. Elas ficam em par."
BPM: Sem tempo
Notas: C#4, D#4 (3× cada)
Nota pedagógica: "As pretas em par (C# e D#) ficam à esquerda do grupo de 3.
                  Erro comum: pressionar E em vez de D#."
Pré-requisitos: C6
```

### C8 — Notas pretas: Fá#, Sol#, Lá#
```
Título: "Grupo de três teclas pretas"
Descrição: "F#, G#, A# — o grupo de três teclas pretas."
BPM: Sem tempo
Notas: F#4, G#4, A#4 (3× cada)
Pré-requisitos: C7
```

### C9 — Reconhecimento aleatório (notas brancas)
```
Título: "Qual nota é essa?"
Descrição: "O app toca uma nota aleatória. Você encontra ela no teclado."
BPM: Sem tempo (modo quiz)
Notas: C4 a B4, ordem aleatória
Pré-requisitos: C6
Nota pedagógica: "Modo diagnóstico. Erros frequentes indicam qual nota 
                  precisa de mais reforço."
```

### C10 — Reconhecimento aleatório (todas as notas)
```
Título: "Quiz completo"
Descrição: "Notas brancas e pretas. Qual nota está soando?"
BPM: Sem tempo
Notas: C4 a B4 (todas, incluindo pretas), ordem aleatória
Pré-requisitos: C8, C9
```

*(C11 a C20 expandem para outras oitavas e misturam registros)*

---

## Camada 2 — Posição (D1 a D25)

### D1 — Posição de mão para Dó
```
Título: "A posição de Dó"
Descrição: "Polegar no Dó. Cinco dedos, cinco notas brancas consecutivas."
BPM: 60 (lento, janela larga)
Mão: Direita
Dedilhado: 1=C4, 2=D4, 3=E4, 4=F4, 5=G4
Notas: C4, D4, E4, F4, G4 (em sequência, depois inverso)
Nota pedagógica: "Dedo 1 = polegar, 5 = mínimo. Punho relaxado. 
                  Dedos curvados como se segurasse uma laranja pequena."
Pré-requisitos: C5
```

### D2 — Exercício de Hanon simplificado
```
Título: "Exercício 1-2-3-4-5"
Descrição: "Cada dedo toca sua nota, em ordem. Lento e preciso."
BPM: 60
Mão: Direita
Dedilhado: Fixo (1-2-3-4-5-4-3-2-1)
Notas: C4-D4-E4-F4-G4-F4-E4-D4-C4
Nota pedagógica: "Dedo 4 (anelar) é o mais fraco. Erros no F4 são normais.
                  Não acelerar enquanto o 4 não estiver confortável."
Pré-requisitos: D1
```

### D3 a D10 — Progressão de dedilhado
*(Exercícios de posicionamento para mão esquerda, cruzamento de polegar,
posição na região média-grave, etc.)*

### D11 — Introdução à mão esquerda
```
Título: "Mão esquerda — Dó"
Descrição: "A mão esquerda tem a mesma posição de 5 dedos, mas mais grave."
BPM: 60
Mão: Esquerda
Dedilhado: 5=C3, 4=D3, 3=E3, 2=F3, 1=G3
Notas: C3, D3, E3, F3, G3
Pré-requisitos: D2
```

---

## Camada 3 — Ritmo (R1 a R40)

### R1 — Semínimas em Dó
```
Título: "Quatro tempos, uma nota"
Descrição: "Toque o Dó 4 vezes, uma por tempo. Simples e no tempo."
BPM: 60
Compasso: 4/4
Mão: Direita
Notas: C4 × 4 (semínimas)
Janela de acerto: ±100ms (mais larga no início)
Nota pedagógica: "Erros de timing aqui revelam falta de pulso interno.
                  Se errar >20%, reduzir BPM para 50."
Pré-requisitos: D1
```

### R2 — Escala em semínimas
```
Título: "Escala no tempo"
Descrição: "A escala de Dó, mas agora com ritmo. Uma nota por tempo."
BPM: 60
Notas: C4-D4-E4-F4-G4-A4-B4-C5 (semínimas)
Pré-requisitos: R1, C5
```

### R3 — Introdução à mínima
```
Título: "Nota longa (2 tempos)"
Descrição: "A mínima dura 2 tempos. Segura a tecla até o próximo som."
BPM: 60
Notas: C4 (mínima) × 2, D4 (mínima) × 2
Nota pedagógica: "Erro comum: soltar cedo. O usuário precisa sentir
                  a nota soando por 2 tempos completos."
Pré-requisitos: R1
```

### R4 — Mix: semínimas e mínimas
```
Título: "Longa e curta"
Descrição: "Alterna notas de 1 tempo e notas de 2 tempos."
BPM: 60
Notas: C4(♩) D4(♩) E4(𝅗𝅥) | F4(♩) G4(♩) A4(𝅗𝅥)
Pré-requisitos: R2, R3
```

### R5 — Pausa de semínima
```
Título: "O silêncio também é música"
Descrição: "Em alguns momentos, você não toca. Conte o tempo em silêncio."
BPM: 60
Notas: C4 ♩ | pausa ♩ | D4 ♩ | pausa ♩
Nota pedagógica: "Pausa é cognitivamente difícil para iniciantes.
                  Eles tendem a preencher o silêncio com uma nota qualquer."
Pré-requisitos: R2
```

### R6-R15 — Progressão rítmica
*(Colcheias, mix de valores, síncopes básicas, compassos 3/4)*

### R16 — Introdução à colcheia
```
Título: "Duas notas por tempo"
Descrição: "A colcheia dura meio tempo. Duas colcheias = uma semínima."
BPM: 60 (♩=60, mas colcheias a 120 notas/min)
Janela de acerto: ±60ms (mais apertada)
Notas: C4(♪♪) D4(♪♪) E4(♪♪) F4(♪♪)
Pré-requisitos: R4, R5
Nota pedagógica: "A transição para colcheias é o primeiro grande salto rítmico.
                  BPM 60 pode ser alto demais inicialmente. Reduzir para 50."
```

---

## Camada 4 — Melodia (M1 a M60)

### M1 — Ode à Alegria (intro simplificada)
```
Título: "Ode à Alegria — Introdução"
Compositor: "Beethoven (Sinfonia 9, 4º movimento)"
Descrição: "A melodia mais reconhecível do mundo. Só notas brancas."
BPM: 72
Compasso: 4/4
Mão: Direita
Tonalidade: Dó maior
Dificuldade: 1/5
Notas: E4(♩) E4(♩) F4(♩) G4(♩) | G4(♩) F4(♩) E4(♩) D4(♩) |
        C4(♩) C4(♩) D4(♩) E4(♩) | E4(𝅗𝅥) D4(♩) D4(𝅗𝅥)
Foco: [F4, D4] — notas mais erradas nessa melodia
Pré-requisitos: R6, D2
Nota pedagógica: "A mudança E→F no compasso 1 pega muitos iniciantes.
                  Dedos 3→4 é a transição mais estranha no início."
```

### M2 — Ode à Alegria (continuação)
```
Título: "Ode à Alegria — Parte 2"
Notas: Os 8 compassos seguintes da melodia original
BPM: 72
Pré-requisitos: M1
```

### M3 — Brilha Brilha Estrelinha
```
Título: "Brilha Brilha Estrelinha"
Descrição: "A melodia mais simples do repertório clássico infantil."
BPM: 80
Notas: C4 C4 G4 G4 A4 A4 G4(𝅗𝅥) | F4 F4 E4 E4 D4 D4 C4(𝅗𝅥)
Foco: [G4, A4] — salto de terça que confunde iniciantes
Pré-requisitos: R4, C6
```

### M10 — Garota de Ipanema (introdução)
```
Título: "Garota de Ipanema — Melodia principal"
Compositor: "Tom Jobim"
Descrição: "A melodia mais tocada do Brasil. 16 primeiros compassos."
BPM: 64
Compasso: 4/4
Tonalidade: Fá maior
Dificuldade: 3/5
Foco: [F#4, Bb4] — notas acidentadas frequentes
Pré-requisitos: M3, C8, R10
Nota pedagógica: "O F# que aparece no compasso 5 é onde 80% dos iniciantes 
                  tropeçam. O braço tende a ir para o F natural por hábito."
```

### M20 — Aquarela (Toquinho) — intro
```
Título: "Aquarela — Melodia principal"
Compositor: "Toquinho / Vinícius de Moraes"
BPM: 76
Tonalidade: Sol maior
Dificuldade: 3/5
Pré-requisitos: M10, R16
```

---

## Controle de Qualidade do Banco

Antes de qualquer exercício entrar no banco de produção, ele passa por:

1. **Revisão pedagógica:** Está na ordem certa? Não introduz dois conceitos novos?
2. **Revisão musical:** As notas estão corretas? O dedilhado faz sentido?
3. **Teste de timing:** O BPM e a janela de acerto estão calibrados?
4. **Teste com iniciante real:** Um não-músico consegue fazer sentido desse exercício?
5. **Revisão de nota pedagógica:** A IA tem contexto suficiente para feedback relevante?

Exercício que não passa em todos os 5 pontos não entra no banco.

---

## Estrutura de Arquivos

```
/exercises
  /recognition
    C01.json
    C02.json
    ...
    C20.json
  /position
    D01.json
    ...
    D25.json
  /rhythm
    R01.json
    ...
    R40.json
  /melody
    M01.json
    ...
    M60.json
  /harmony
    H01.json
    ...
    H50.json
  /independence
    I01.json
    ...
    I40.json
  /repertoire
    P01.json
    ...

/graph.json          — Grafo de dependências completo
/index.json          — Índice de todos os exercícios com metadata leve
```
