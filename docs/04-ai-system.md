# 04 — Sistema de IA

## Princípio Fundamental: IA Como Diagnóstico, Nunca Como Professora

Este é o princípio mais importante do produto e o que mais diferencia Piano Hero de qualquer concorrente.

**A IA não inventa conteúdo pedagógico. Nunca.**

Todo exercício, toda progressão, toda teoria musical no app foi escrita e revisada por humanos com conhecimento musical. A IA opera exclusivamente sobre dados de performance do usuário para fazer três coisas específicas e bem-delimitadas.

---

## O Que a IA Faz

### 1. Diagnóstico de Padrão de Erro

**Input:** Dados de performance das últimas N sessões
- Quais notas foram erradas
- Em qual posição do compasso o erro ocorreu
- Se foi nota errada ou timing errado
- Frequência e consistência do erro

**Output:** Identificação de padrões específicos

Exemplos de diagnósticos válidos:
- "Você erra consistentemente o Fá# quando ele aparece após uma colcheia"
- "Seu timing na mão esquerda atrasa ~40ms em relação à direita em compassos com acordes"
- "Notas na região das teclas pretas do registro médio têm 23% menos precisão"
- "Você antecipa as notas no final de frases — erro comum de ansiedade rítmica"

**O que a IA NÃO diagnostica:**
- Postura corporal (não tem câmera, não pode ver)
- Tensão muscular
- Qualquer coisa que requer observação física

---

### 2. Seleção Inteligente de Exercícios

O banco de exercícios tem ~800 exercícios. A IA decide a ordem em que você os faz.

**Algoritmo simplificado:**
1. Mapa de pré-requisitos (exercício B requer 80%+ no exercício A)
2. Fila de repetição espaçada (exercícios com erros recentes sobem na fila)
3. Preferência de gênero do usuário (MPB vs clássico vs pop)
4. Duração da sessão disponível (5 min vs 30 min = playlists diferentes)
5. Momento do dia (sessão da manhã = mais técnica, noite = mais musical)

**O que a IA nunca faz:** Criar um exercício novo. Ela escolhe entre exercícios existentes.

---

### 3. Linguagem de Feedback

Dado o diagnóstico, a IA transforma dados técnicos em linguagem humana, empática e específica em português.

**Exemplo de input para a IA:**
```json
{
  "exercise": "M-23",
  "note_errors": ["F#4", "F#4", "F#4"],
  "timing_errors": {"F#4": -45},
  "pattern": "early_arrival_after_eighth_note",
  "user_level": "camada_3",
  "sessions_with_error": 4
}
```

**Exemplo de output esperado:**
> "Você está chegando um pouco cedo no Fá# — isso acontece 3 vezes nesse exercício. É comum quando a nota anterior é uma colcheia, porque o braço tende a antecipar o movimento. Tenta tocar a colcheia anterior mais devagar e *esperar* o Fá# chegar até você, não ir atrás dele."

**Prompt engineering para garantir qualidade:**
- O modelo recebe sempre o dado exato do erro, nunca interpreta
- O modelo nunca sugere exercícios fora do banco curado
- O modelo nunca dá conselhos de postura ou saúde
- O modelo responde sempre em português brasileiro, tom de professor paciente
- Temperatura baixa (0.3) para consistência e precisão

---

## O Que a IA Nunca Faz

Esta seção é tão importante quanto a anterior.

**A IA nunca:**

1. **Cria exercícios novos.** O risco de um exercício pedagogicamente incorreto causar hábitos ruins é real. Todo exercício é humano.

2. **Inventa teoria musical.** Se o usuário pergunta "por que esse acorde é menor?", o app direciona para conteúdo estático escrito por músicos, não para resposta gerada.

3. **Promete prazos.** "Você vai aprender isso em 2 semanas" é uma mentira. A IA não faz previsões de tempo.

4. **Avalia expressividade subjetivamente.** "Você tocou com sentimento" é impossível de avaliar sem humano ouvindo. A IA só avalia dados mensuráveis.

5. **Substitui professor para níveis avançados.** A partir da Camada 6, o app ativamente sugere que o usuário busque um professor humano para feedback presencial.

6. **Opera sem dados suficientes.** Se o usuário tem menos de 3 sessões de dados, a IA não diagnostica — apenas segue a progressão padrão do currículo.

---

## Arquitetura Técnica do Sistema de IA

### Fluxo de dados

```
[Sessão de prática]
       │
       ▼
[Captura de eventos MIDI] ─── note_on, note_off, velocity, timestamp
       │
       ▼
[Processador de performance] ─── compara com gabarito do exercício
       │
       ▼
[Banco de dados de erros] ─── Supabase, por nota, por exercício, por sessão
       │
       ▼
[Análise de padrão] ─── algoritmo local (não IA) identifica recorrências
       │
       ▼
[Claude API] ─── recebe JSON estruturado, retorna texto em PT-BR
       │
       ▼
[Interface do usuário] ─── exibe feedback no momento certo
```

### Quando a IA é chamada

- **Não em tempo real durante o exercício.** Isso criaria latência e distração.
- **No final de cada exercício:** Feedback imediato sobre o que acabou de acontecer.
- **No início de cada sessão:** "Bom dia. Aqui está o que vamos trabalhar hoje e por quê."
- **Quando o usuário trava:** Se 3 tentativas consecutivas em um exercício ficam abaixo de 60%, a IA intervém.

### Controle de qualidade do output

Toda resposta da IA passa por:
1. Validação de comprimento (máx. 3 frases no feedback de exercício)
2. Checagem de que não contém nomes de exercícios inexistentes no banco
3. Checagem de que não contém promessas de prazo
4. Checagem de linguagem (português, sem anglicismos desnecessários)

Se a resposta não passa na validação, o app exibe um fallback estático adequado ao tipo de erro — nunca exibe resposta inválida.

---

## Onboarding e Personalização Inicial

### Sessão 0 — Diagnóstico de entrada

Antes do primeiro exercício, o app faz um diagnóstico de 5 minutos:

1. **Você já tocou piano antes?** (nunca / um pouco / sim, mas faz tempo / sim, regularmente)
2. **Você consegue ler partitura?** (não / notas básicas / sim)
3. **Qual gênero você mais quer tocar?** (MPB / clássico / pop / jazz / game music)
4. **Quanto tempo você tem por dia?** (5-10 min / 15-20 min / 30+ min)
5. **Teste prático:** O app toca 5 notas e pede que você as identifique no teclado — sem pressão, só diagnóstico

Com essas informações, a IA monta o plano de estudos inicial e define o ponto de entrada no grafo de exercícios.

---

## Privacidade e Dados

- Dados de performance ficam no Supabase do usuário
- Nenhum dado de áudio é capturado — apenas eventos MIDI (nota + timing + velocidade)
- A Claude API recebe apenas JSON estruturado de performance, nunca dados pessoais identificáveis
- O usuário pode exportar todos os seus dados a qualquer momento
- O usuário pode deletar todos os seus dados permanentemente
