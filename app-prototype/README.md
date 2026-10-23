# 🎹 Piano Hero — Setup

## Rodar em 3 comandos

Abra o terminal (PowerShell ou CMD) na pasta do projeto e execute:

```bash
npm install
npx expo start
```

Depois, no seu celular ou tablet:
1. Baixe o app **Expo Go** na App Store ou Play Store
2. No Android: escaneie o QR code que aparece no terminal
3. No iOS: abra a câmera e aponte para o QR code

O app vai abrir diretamente no seu dispositivo. Qualquer mudança no código atualiza automaticamente.

---

## Estrutura do Projeto

```
app/
  _layout.tsx        — Configuração raiz (fontes, navegação)
  index.tsx          — Home com constelação de notas
  exercise.tsx       — Tela de exercício (gameplay)

src/
  design/
    tokens.ts        — Cores, fontes, espaçamentos
  data/
    exercises.ts     — Banco de exercícios (JSON estruturado)
  engine/
    midi.ts          — Conexão BLE MIDI com Roland GO-88PX
    exerciseEngine.ts — Spawna notas, avalia timing
  store/
    gameStore.ts     — Estado do jogo (Zustand)
  components/
    PianoKeyboard.tsx — Teclado virtual interativo
    NoteRail.tsx     — Notas caindo com Reanimated 3
    HUD.tsx          — Score, streak, BPM
    ResultScreen.tsx — Resultado pós-exercício
  hooks/
    useMIDI.ts       — Conecta engine MIDI ao store
```

---

## Conectar o Roland GO-88PX

Quando o teclado chegar:

1. Ligue o Roland
2. Na tela do app, vá em **Configurações → Conectar Roland**
3. Selecione "GO:PIANO88" na lista
4. Pronto — conexão wireless, sem cabo

O app detecta automaticamente e reconecta nas próximas sessões.

---

## Adicionar Exercícios

Edite `src/data/exercises.ts` e adicione um novo objeto no `EXERCISES`:

```typescript
'M2': {
  id: 'M2',
  title: 'Minha Música',
  bpm: 80,
  // ... ver schema completo no arquivo
}
```

---

## Próximos Passos (Fase 2)

- [ ] Integração completa BLE MIDI com calibração de latência
- [ ] Constelação interativa (toque em estrela para ver stats)
- [ ] Sistema de progresso local (SQLite)
- [ ] Animações de partícula com Skia
- [ ] Mais exercícios no banco (target: 50+ na Fase 2)
