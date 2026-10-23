# 14 — Hardware: Roland GO-88PX

## Por Que Este Modelo

O Roland GO-88PX (modelo 2025, ref. GO-88PX) é a escolha ideal pelo cruzamento de três fatores: **88 teclas em tamanho real**, **Bluetooth MIDI 5.0 nativo**, e **suporte de partitura incluído**. Esses três juntos significam que você coloca o tablet no suporte, conecta wireless, e a experiência é exatamente como imaginou — tablet na posição de partitura, você tocando.

---

## Especificações Relevantes para o App

| Spec | Valor | Relevância |
|---|---|---|
| Teclas | 88, tamanho padrão, Ivory Feel | Técnica correta desde o início |
| Ação | Semi-weighted (Box-shape Keys) | Leve, boa para iniciantes, sem fadiga |
| Polyphony | 64 vozes | Suficiente para todas as camadas do app |
| Sons onboard | 40 timbres + 256 GM2 via app | Não relevante — o app usa seus próprios samples |
| Bluetooth | 5.0, perfil GATT (BLE MIDI) | Core da integração |
| Bluetooth audio | A2DP (SBC) | Para ouvir samples do app pelo alto-falante do Roland |
| USB | USB-C (MIDI + Audio) | Fallback para cabo quando necessário |
| Alimentação | 8 pilhas AA ou adaptador | Wireless total possível |
| Peso | 5,8 kg | Portátil, mas fica bem no suporte |
| Dimensões | 128,0 × 27,6 × 8,4 cm | Cabe em qualquer ambiente |
| Suporte de partitura | Incluído na caixa | Onde o tablet fica |

---

## Preços no Brasil (Março 2026)

| Loja | Preço | Condição |
|---|---|---|
| **Roland Store BR (oficial)** | **R$ 2.829** | Pix ou boleto (melhor preço) |
| Roland Store BR | R$ 3.143 | 10x sem juros no cartão |
| Roland Store BR | R$ 3.309 | Preço cheio |
| Musica Center (ML) | ~R$ 3.200-3.400 | Parcelado |

**Link oficial:** https://store.roland.com.br/products/go-88px

### Como monitorar o preço

1. **Zoom.com.br** — busca "Roland GO-88PX", ativa alerta de preço por email
2. **Buscapé** — mesmo procedimento
3. **Black Friday (novembro)** — instrumentos musicais importados têm queda real
4. **Dólar** — quando o USD cai, preços de importados caem com delay de 30-60 dias

### Atenção: Não comprar o modelo antigo

O GO-88P (sem o X no final) ainda aparece em algumas lojas por ~R$ 2.000-2.400. É o modelo de 2019, sem USB-C e com Bluetooth 4.0 mais lento. Não vale a diferença — sempre verificar o modelo **GO-88PX**.

---

## Setup Completo para Usar com o App

### O que vem na caixa

- Roland GO-88PX
- Suporte de partitura (onde o tablet vai ficar)
- Pedal de sustain básico
- Adaptador de energia
- Documentação

### O que você precisa comprar separado

**Tablet (essencial):**
- iPad 11" (qualquer geração recente) — ideal, tela grande, suporte excelente a apps RN
- Samsung Galaxy Tab S8+ — alternativa Android igualmente boa
- Qualquer tablet com Chrome (para testes iniciais)

**Suporte de tablet para o suporte de partitura:**
- O suporte de partitura do Roland segura partituras e tablets, mas tablets precisam de um clip adaptador
- Opção: suporte universal de tablet com clipe (~R$ 50-80 no ML)
- O setup final: Roland → suporte de partitura → clip → tablet, na sua frente, na altura dos olhos

**Pedal de sustain melhor (opcional, mas recomendado):**
- O pedal que vem na caixa é básico (footswitch sem meio-caminho)
- Upgrade: Roland DP-10 (~R$ 350) — pedal contínuo que detecta pressão parcial
- Para as primeiras fases do aprendizado, o básico serve

**Fones de ouvido (recomendado):**
- Qualquer fone de qualidade com 3.5mm ou USB-C
- Importante: praticar com fones evita incômodo com vizinhos e melhora concentração

---

## Configuração do Bluetooth MIDI

### Primeira conexão (iOS)

1. Ligue o Roland GO-88PX
2. No iPad: Ajustes → Bluetooth → espere aparecer "GO:PIANO88"
3. Toque para parear
4. **Importante:** No iOS, o pareamento de BLE MIDI não acontece em Ajustes — acontece dentro do app que usa MIDI. O Piano Hero vai ter um botão "Conectar Roland" que abre o seletor BLE MIDI nativo do iOS (via `CoreBluetooth` / `CoreMIDI`).

### Primeira conexão (Android)

1. Ligue o Roland GO-88PX
2. No Android: Ajustes → Bluetooth → parear "GO:PIANO88"
3. No Piano Hero: "Conectar Roland" → seleciona o dispositivo já pareado

### Conexão automática (após primeiro setup)

O app lembra o último dispositivo Roland e tenta reconectar automaticamente ao abrir. Funciona em ~3-5 segundos.

---

## Rotina de Calibração de Latência

Na primeira conexão, o app roda uma calibração de 2 minutos:

1. O app exibe: "Vamos calibrar para garantir feedback preciso"
2. Instrução: "Quando ouvir o beep, toque a tecla C4 (Dó central) o mais rápido possível"
3. O app toca 7 beeps com intervalos aleatórios
4. O usuário toca a tecla em cada beep
5. O app calcula a mediana das latências (elimina outliers)
6. Resultado armazenado: "Sua latência de conexão: 14ms — perfeito!"
7. Esse valor é usado em todas as avaliações de timing futuras

**Recalibrar:** Sempre que trocar de dispositivo ou ambiente. Opção em Configurações → "Recalibrar Roland".

---

## Usando o Pedal de Sustain

O pedal de sustain envia mensagens de Control Change (CC64) via MIDI. O app:

- Captura essas mensagens via MIDI
- Aplica sustain ao áudio dos samples (as notas continuam soando após soltar a tecla)
- Em exercícios que envolvem pedal, o app indica visualmente quando o pedal deve ser pressionado

Para as primeiras fases do aprendizado (Camadas 1-4), o pedal não é necessário. O app só apresenta pedal na Camada 5 em diante.

---

## Problemas Conhecidos e Soluções

**Problema:** BLE MIDI desconecta durante a prática
**Causa provável:** Interferência Wi-Fi (Wi-Fi 2.4GHz e Bluetooth compartilham frequência)
**Solução:** Usar Wi-Fi 5GHz no tablet durante a prática, ou manter o roteador afastado

**Problema:** Latência alta (>30ms)
**Causa provável:** Dispositivo Android com driver BLE ruim
**Solução:** Rodar calibração novamente. Se persistir, usar cabo USB-C

**Problema:** Teclas soam mas MIDI não é recebido no app
**Causa provável:** Roland está conectado em Bluetooth Audio (A2DP) mas não em MIDI (GATT)
**Solução:** Desconectar e reconectar pelo botão "Conectar Roland" dentro do app, não pelos Ajustes do sistema

**Problema:** Som do app sai pelo Roland, não pelo tablet
**Causa provável:** iOS roteou o áudio para o dispositivo Bluetooth conectado
**Solução:** Em Ajustes → Som → Saída de áudio → selecionar o tablet. O app pode fazer isso automaticamente no futuro.
