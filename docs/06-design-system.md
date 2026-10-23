# 06 — Design System

## Conceito: "Sala de Concerto à Meia-Noite"

Imagina um Steinway num palco escuro. Um único spot de luz. O silêncio antes da música começar. Essa é a energia visual do Piano Hero.

O design rejeita a gamificação infantil dos concorrentes. Sem mascotes. Sem badges coloridos. Sem gradientes roxos. O app precisa parecer que foi desenhado para alguém com gosto — porque foi.

**Referências visuais:**
- Letterboxd (elegância escura, seriedade)
- Bösendorfer e Steinway (linguagem de luxo atemporal)
- Arc Raiders (direção de arte escura e sofisticada)
- Dieter Rams / Braun (funcionalidade como beleza)

---

## Paleta de Cores

### Fundos

```css
--color-bg-base: #0A0A0F;        /* Preto com leve tint azulado. Não preto morto. */
--color-bg-surface: #12121A;     /* Superfícies de cards e painéis */
--color-bg-elevated: #1A1A28;    /* Modais, dropdowns, elementos elevados */
--color-bg-overlay: #0A0A0FCC;   /* Overlays semitransparentes (80% opacity) */
```

### Teclas do Piano

```css
--color-key-white: #E8E4DC;      /* Marfim envelhecido. Não branco digital. */
--color-key-white-pressed: #D4CFC5;
--color-key-black: #1C1C24;
--color-key-black-pressed: #2A2A38;
--color-key-white-border: #2A2824;
```

### Acentos

```css
--color-gold: #C9A84C;           /* Ouro envelhecido. Tom do latão Bösendorfer. */
--color-gold-bright: #E8C46A;    /* Hover e highlights do dourado */
--color-gold-dim: #8A6E32;       /* Estados desabilitados do dourado */

--color-accent-hit: #4CFFB3;     /* Verde-água elétrico. Acerto perfeito. */
--color-accent-good: #4CC9FF;    /* Azul. Acerto "bom". */
--color-accent-ok: #FFD166;      /* Âmbar. Acerto "ok". */
--color-accent-miss: #FF4C6A;    /* Vermelho. Erro. Não grita. Pontua. */
```

### Texto

```css
--color-text-primary: #F0EDE8;   /* Quase branco, com warmth */
--color-text-secondary: #8A8A9A; /* Cinza médio para informações secundárias */
--color-text-muted: #4A4A5A;     /* Para elementos de menor importância */
--color-text-inverse: #0A0A0F;   /* Para texto sobre fundos claros */
```

### Estrelas da Constelação

```css
--star-unseen: #2A2A3A;          /* Nota nunca tocada */
--star-introduced: #5A5A7A;      /* Nota introduzida */
--star-learning: #4C7FFF;        /* Em aprendizado — pulsa */
--star-consolidating: #C0C0E0;   /* Em consolidação */
--star-mastered: #C9A84C;        /* Dominada — ouro */
--star-expert: #FFE89A;          /* Masterizada — ouro brilhante com glow */
```

---

## Tipografia

### Fontes

**Display — Playfair Display**
- Uso: Títulos principais, nomes de músicas, marcos de progressão
- Estilo: Serifada, elegante, evoca partitura e música clássica
- Pesos: 400 (regular), 700 (bold), 900 (black)
- Fonte do Google Fonts: `Playfair Display`

**Interface — DM Mono**
- Uso: BPM, pontuação, timestamps, dados numéricos, código
- Estilo: Monoespaçada, precisa, técnica
- Pesos: 300 (light), 400 (regular), 500 (medium)
- Fonte do Google Fonts: `DM Mono`

**Corpo — Instrument Sans**
- Uso: Todo texto de interface, descrições, feedback da IA
- Estilo: Humanista, legível, moderna sem ser genérica
- Pesos: 400 (regular), 500 (medium), 600 (semibold)
- Fonte do Google Fonts: `Instrument Sans`
- Nota: Irônico e perfeito — literalmente feita para músicos

### Escala tipográfica

```css
/* Display */
--type-display-xl: 48px / 1.1 / Playfair Display 900
--type-display-lg: 36px / 1.2 / Playfair Display 700
--type-display-md: 28px / 1.3 / Playfair Display 700

/* Interface */
--type-ui-score: 32px / 1.0 / DM Mono 500    /* Pontuação em tempo real */
--type-ui-bpm: 24px / 1.0 / DM Mono 400      /* BPM */
--type-ui-stat: 18px / 1.2 / DM Mono 300     /* Estatísticas */

/* Corpo */
--type-body-lg: 18px / 1.6 / Instrument Sans 400
--type-body-md: 16px / 1.5 / Instrument Sans 400
--type-body-sm: 14px / 1.4 / Instrument Sans 400
--type-label: 12px / 1.3 / Instrument Sans 600 uppercase letter-spacing: 0.08em
```

---

## Espaçamento e Grid

### Base unit: 4px

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### Border radius

```css
--radius-sm: 4px      /* Badges, tags pequenas */
--radius-md: 8px      /* Botões, inputs */
--radius-lg: 16px     /* Cards */
--radius-xl: 24px     /* Modais, painéis grandes */
--radius-full: 9999px /* Pills, avatares */
```

---

## Efeitos Visuais

### Grain overlay

Todo fundo principal tem um grain (ruído) sutil que dá sensação analógica. Implementado como SVG filter ou PNG overlay com opacity baixa (3-5%).

```css
.bg-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/grain.png');
  opacity: 0.04;
  pointer-events: none;
}
```

### Glow das notas ativas

Teclas ativas e notas em queda têm glow responsivo:

```css
/* Nota correta */
box-shadow: 0 0 20px var(--color-accent-hit),
            0 0 60px var(--color-accent-hit)33;

/* Nota gold (streak alto) */
box-shadow: 0 0 20px var(--color-gold),
            0 0 60px var(--color-gold)44,
            0 0 120px var(--color-gold)22;
```

### Gradientes de profundidade

```css
/* Topo da tela (notas nascem aqui) */
background: linear-gradient(180deg, #0A0A0F 0%, transparent 100%);

/* Base do teclado */
background: linear-gradient(0deg, #0A0A0F 0%, transparent 40%);
```

---

## Componentes — Estados

### Botão primário

```
Default:    bg: gold, text: #0A0A0F, border: none
Hover:      bg: gold-bright, scale: 1.02
Pressed:    bg: gold-dim, scale: 0.98
Disabled:   bg: surface, text: muted, opacity: 0.5
```

### Botão secundário (ghost)

```
Default:    bg: transparent, text: gold, border: 1px gold-dim
Hover:      bg: gold/10, border: gold
Pressed:    bg: gold/20
```

### Nota caindo

```
Default:    bg: accent-hit/60, border: 1px accent-hit, glow: small
Approaching: opacity aumenta, glow cresce proportional à proximidade
Hit zone:   glow máximo, pulse no BPM
```

### Card de música

```
Default:    bg: surface, border: 1px surface+10%
Hover:      border: gold-dim, bg: elevated
Active:     border: gold, inner glow: gold/10
```

---

## Ícones

Usar **Phosphor Icons** — iconografia limpa, consistente, com pesos variáveis que combinam com DM Mono.

Peso padrão: `regular` para UI geral, `bold` para ações primárias, `thin` para decorativo.

Tamanhos: 16px (inline), 20px (botões), 24px (navegação), 32px (hero/destaque)

---

## Layout Mobile — Considerações

### Orientação: Portrait (prioritária)

O app é desenhado primariamente para portrait em tablet (iPad 11" ideal). Mas funciona em celular também.

**Proporções críticas:**
- Teclado virtual: sempre na base da tela, ocupa ~25% da altura
- Trilho de notas: ocupa ~65% da altura
- Header/HUD: ~10% do topo

**Teclas visíveis:** 14 teclas (2 oitavas) em tablet, 10 teclas (1,5 oitava) em celular. Scroll automático conforme a música exige.

### Safe areas

```css
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

Nunca sobrepor elementos interativos com a home indicator do iOS.

---

## Dark Mode

O app é **sempre dark**. Não existe light mode. Razões:

1. Coerência com a identidade visual
2. Redução de cansaço visual em sessões longas
3. As animações de glow funcionam apenas sobre fundo escuro
4. Consistência com o cenário de uso (quarto, à noite, com o instrumento na frente)
