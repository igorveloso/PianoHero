# 13 — Roadmap de Build

## Filosofia: Funcionar Antes de Polir

O roadmap está organizado para que em cada fase exista algo usável e motivador. Não existe "fase de fundação invisível de 3 meses". Em 2 semanas, você já consegue tocar e ter feedback.

---

## Fase 0 — Fundação (Antes do Teclado Chegar)
**Duração estimada:** 1-2 semanas  
**Objetivo:** Tudo que pode ser feito sem o hardware

### O que construir

**Design System completo:**
- [ ] Paleta de cores em CSS variables / Tamagui tokens
- [ ] Fontes carregadas e testadas (Playfair Display, DM Mono, Instrument Sans)
- [ ] Componentes base: Button, Card, Label, Badge
- [ ] Grain overlay implementado
- [ ] Dark theme configurado

**Banco de exercícios — Camadas 1 a 3:**
- [ ] Estrutura JSON validada (schema TypeScript)
- [ ] 20 exercícios de reconhecimento (C1-C20)
- [ ] 15 exercícios de posição e dedilhado (D1-D15)
- [ ] 20 exercícios de ritmo básico (R1-R20)
- [ ] Grafo de dependências para esses exercícios

**Algoritmo de seleção de exercícios:**
- [ ] Lógica de repetição espaçada (baseada em Anki SM-2)
- [ ] Respeito ao grafo de dependências
- [ ] Adaptação por duração de sessão (5/15/30 min)

**Protótipo visual (sem funcionalidade):**
- [ ] Tela Home com constelação estática
- [ ] Tela de exercício com layout definido
- [ ] Tela de resultado mockada

**Deliverable:** Um protótipo clicável no Expo Go que mostra o visual final, sem MIDI ainda.

---

## Fase 1 — MVP Jogável
**Duração estimada:** 1-2 semanas  
**Objetivo:** Jogo funcionando com teclado virtual. Sem backend.

### O que construir

**Engine de gameplay:**
- [ ] Trilho de notas em Reanimated 3 (notas caindo em 60fps)
- [ ] Teclado virtual com touch input
- [ ] Avaliador de timing (nota correta + janela de tempo)
- [ ] Sistema de score em tempo real
- [ ] HUD: score, BPM, botão de pausa

**Animações core:**
- [ ] Nota em queda com todos os 4 estados (perfeito/bom/ok/miss)
- [ ] Tecla pressionada (translateY + glow)
- [ ] Anel de onda (ripple)
- [ ] Partículas de acerto perfeito (via Skia)
- [ ] Streak visual (brilho progressivo)

**Fluxo básico:**
- [ ] Onboarding simplificado (3 perguntas)
- [ ] Seleção de exercício
- [ ] Exercício → Resultado → Próximo exercício
- [ ] Progresso local (AsyncStorage)

**Deliverable:** Você consegue sentar, selecionar um exercício, tocar no teclado virtual, e ver feedback preciso de acerto/erro. O app parece o produto final visualmente.

---

## Fase 2 — MIDI Real + Constelação
**Duração estimada:** 2-3 semanas  
**Objetivo:** Roland GO-88PX conectado. Progressão visível.

### O que construir

**Integração MIDI:**
- [ ] Setup BLE com react-native-ble-plx
- [ ] Parser BLE MIDI completo
- [ ] Rotina de calibração de latência
- [ ] Reconexão automática com backoff
- [ ] Fallback para teclado virtual quando desconectado

**Constelação:**
- [ ] 88 estrelas com posicionamento correto
- [ ] 6 estados visuais por estrela
- [ ] Animação de entrada (stagger wave)
- [ ] Interação: toque em estrela mostra detalhes
- [ ] Atualização em tempo real após cada exercício

**Sistema de progresso local:**
- [ ] Tracking de performance por nota
- [ ] Cálculo de mastery level por nota
- [ ] Persistência em SQLite local (expo-sqlite)
- [ ] Tela de resultado completa com dados reais

**Mapa de aprendizado:**
- [ ] Renderização do grafo (react-native-svg)
- [ ] Estados: desbloqueado / bloqueado / em progresso / completo
- [ ] Navegação por toque

**Deliverable:** Você conecta o Roland, toca, e vê a constelação mudando. Você vê sua progressão real acontecendo.

---

## Fase 3 — Backend + IA
**Duração estimada:** 2-3 semanas  
**Objetivo:** Dados persistidos. IA dando feedback real.

### O que construir

**Supabase:**
- [ ] Schema criado (ver doc 12-backend.md)
- [ ] Auth (Apple Sign In prioritário para iOS)
- [ ] Sync de progresso: local SQLite → Supabase
- [ ] Resolução de conflitos (offline first)
- [ ] Row Level Security configurado

**Sistema de IA:**
- [ ] Análise de padrão de erro (algoritmo local)
- [ ] Integração Claude API
- [ ] Prompt engineering validado
- [ ] Validação de output (comprimento, conteúdo, português)
- [ ] Fallback estático para quando API está indisponível
- [ ] Cache de respostas para erros repetidos

**Streak e sessões:**
- [ ] Tracking de dias de prática
- [ ] Streak display no header
- [ ] Sessão de recuperação (retorno após inatividade)
- [ ] Resumo de sessão

**Deliverable:** Você toca, o app salva na nuvem, e ao terminar um exercício a IA explica em português o que exatamente você precisa trabalhar.

---

## Fase 4 — Repertório + Músicas Reais
**Duração estimada:** 3-4 semanas  
**Objetivo:** Músicas completas. A biblioteca começa a crescer.

### O que construir

**Engine de repertório:**
- [ ] Import e parse de arquivos MIDI padrão
- [ ] Segmentação de música em seções (intro, verso, chorus)
- [ ] Modo "mãos separadas" automático
- [ ] Modo "velocidade reduzida" (50%, 75%, 100%)
- [ ] Marcadores de progresso por seção

**Biblioteca inicial de músicas (MPB):**
- [ ] Garota de Ipanema (tom Jobim) — versão completa
- [ ] Aquarela (Toquinho) — versão completa
- [ ] Asa Branca (Luiz Gonzaga) — versão simplificada
- [ ] Chega de Saudade (Tom Jobim) — intro

**Biblioteca inicial (clássico):**
- [ ] Ode à Alegria (Beethoven) — versão simplificada
- [ ] Minueto em Sol (Bach)
- [ ] Fur Elise — intro (as 20 primeiras notas)
- [ ] Prelúdio em Dó (Bach, Bem Temperado)

**Tela de Repertório:**
- [ ] Lista de músicas conquistadas
- [ ] Cards com arte procedural por música
- [ ] Modo performance (sem notas caindo, só partitura)
- [ ] Estatísticas por música

**Partitura básica (VexFlow):**
- [ ] Renderização de notas na pauta
- [ ] Destaque da nota atual tocando
- [ ] Clave de Sol e Fá
- [ ] Alterações (sustenidos e bemóis)

**Deliverable:** Você toca Garota de Ipanema do começo ao fim e ela entra no seu Repertório.

---

## Fase 5 — Polimento e Lançamento Pessoal
**Duração estimada:** 2 semanas  
**Objetivo:** Produto final. Sem bugs. Sem arestas.

### O que construir

**Qualidade:**
- [ ] Testes de latência MIDI em diferentes dispositivos
- [ ] Testes de animação em 30fps (dispositivos mais lentos)
- [ ] Todos os fluxos de erro cobertos (sem internet, BLE cai, etc.)
- [ ] Acessibilidade básica (Dynamic Type no iOS)

**Onboarding final:**
- [ ] Fluxo completo das 6 perguntas
- [ ] Teste prático de diagnóstico
- [ ] Plano personalizado gerado pela IA

**Marcos e celebrações:**
- [ ] Animação de primeira nota
- [ ] Animação de progressão de nível
- [ ] Animação de entrada no Repertório
- [ ] Milestone de 30 dias

**Configurações:**
- [ ] Ajuste de volume de samples
- [ ] Velocidade de notas caindo (ajuste de dificuldade)
- [ ] Conectar/desconectar Roland
- [ ] Exportar dados de progresso

**Deliverable:** Produto completo. Você usa todos os dias.

---

## Métricas de Cada Fase

| Fase | Métrica de sucesso |
|---|---|
| 0 | Visual aprovado. Parece o produto final. |
| 1 | Consegue completar 5 exercícios sem travar. |
| 2 | Roland conecta em <10s. Constelação atualiza após cada sessão. |
| 3 | IA dá feedback relevante em >80% das sessões. |
| 4 | Primeira música no Repertório. |
| 5 | Usa diariamente por 2 semanas sem abrir issue. |

---

## O Que Este Roadmap Não Inclui (Por Enquanto)

- **Android:** Foco em iOS primeiro (iPad é o caso de uso ideal). Android na Fase 6.
- **Modo social:** Comparar progresso com outros usuários.
- **Importação de MIDI próprio:** Usuário traz suas próprias músicas.
- **Reconhecimento de improviso:** IA avalia escalas e improvisação livre.
- **Integração com professor:** O professor vê o progresso do aluno no app.

Todos esses são caminhos para o produto evoluir — mas não são necessários para o produto ser ótimo.
