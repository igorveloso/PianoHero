# 10 — Sistema MIDI

## Por Que MIDI é o Core do Produto

MIDI não é um detalhe de implementação — é a fundação de tudo. Sem MIDI preciso e de baixa latência, o timing do usuário não pode ser avaliado corretamente, o feedback perde sentido, e o aprendizado não acontece. Um erro de 50ms no sistema de MIDI invalida qualquer feedback de "você tocou cedo" ou "você tocou tarde."

---

## Hardware Alvo: Roland GO-88PX

### Especificações relevantes

| Spec | Valor |
|---|---|
| Bluetooth | 5.0 |
| Perfil MIDI | BLE MIDI (MIDI over Bluetooth Low Energy) |
| Protocolo | GATT (Generic Attribute Profile) |
| Latência BLE declarada | ~8-12ms |
| Latência total esperada (BLE + parse + avaliação) | 15-20ms |
| USB alternativo | USB-C (para cabo quando necessário) |
| Alimentação | Baterias AA ou adaptador |

### Identificação do dispositivo

```typescript
const ROLAND_GO88PX = {
  name: 'GO:PIANO88',
  serviceUUID: '03b80e5a-ede8-4b33-a751-6ce34ec4c700', // BLE MIDI Service UUID padrão
  characteristicUUID: '7772e5db-3868-4112-a1a9-f2669d106bf3', // BLE MIDI Characteristic
};
```

---

## Protocolo BLE MIDI

BLE MIDI encapsula mensagens MIDI padrão em pacotes BLE com timestamp.

### Estrutura do pacote

```
Byte 0: Header (sempre 0x80 | (timestamp_high & 0x3F))
Byte 1: Timestamp low (0x80 | (timestamp & 0x7F))
Byte 2+: Mensagem MIDI padrão
```

### Tipos de mensagem relevantes

```typescript
// Note On
// [0x90 + canal, nota, velocity]
// velocity > 0 = tecla pressionada
// Ex: C4 pressionado com force médio: [0x90, 60, 64]

// Note Off  
// [0x80 + canal, nota, velocity]
// ou Note On com velocity = 0
// Ex: C4 solto: [0x80, 60, 0]

// Control Change (pedal de sustain)
// [0xB0 + canal, 64, valor]
// valor >= 64 = pedal pressionado
// valor < 64 = pedal solto
```

---

## Parser MIDI

```typescript
interface MIDIEvent {
  type: 'noteOn' | 'noteOff' | 'sustainOn' | 'sustainOff';
  note?: number;      // 0-127, apenas para noteOn/noteOff
  velocity?: number;  // 0-127
  timestamp: number;  // performance.now() no momento da recepção
  rawTimestamp: number; // timestamp do pacote BLE
}

class BLEMIDIParser {
  private latencyOffset: number = 0; // calibrado no setup
  
  parse(data: Uint8Array): MIDIEvent[] {
    const events: MIDIEvent[] = [];
    let i = 0;
    
    // Extrai header e timestamp BLE
    const header = data[i++];
    const timestampHigh = (header & 0x3F) << 7;
    
    while (i < data.length) {
      if (data[i] & 0x80) {
        // É um timestamp byte
        const timestampLow = data[i++] & 0x7F;
        const bleTimestamp = timestampHigh | timestampLow;
        
        // Mensagem MIDI
        const statusByte = data[i++];
        const type = statusByte >> 4;
        const channel = statusByte & 0x0F;
        
        if (type === 0x9) { // Note On
          const note = data[i++];
          const velocity = data[i++];
          
          events.push({
            type: velocity > 0 ? 'noteOn' : 'noteOff',
            note,
            velocity,
            timestamp: performance.now() - this.latencyOffset,
            rawTimestamp: bleTimestamp,
          });
        } else if (type === 0x8) { // Note Off
          const note = data[i++];
          const velocity = data[i++];
          events.push({
            type: 'noteOff',
            note,
            velocity,
            timestamp: performance.now() - this.latencyOffset,
            rawTimestamp: bleTimestamp,
          });
        } else if (type === 0xB) { // Control Change
          const controller = data[i++];
          const value = data[i++];
          if (controller === 64) { // Sustain pedal
            events.push({
              type: value >= 64 ? 'sustainOn' : 'sustainOff',
              timestamp: performance.now() - this.latencyOffset,
              rawTimestamp: bleTimestamp,
            });
          }
        }
      } else {
        i++; // Byte inesperado, pula
      }
    }
    
    return events;
  }
  
  setLatencyOffset(ms: number) {
    this.latencyOffset = ms;
  }
}
```

---

## Avaliador de Timing

```typescript
interface TimingResult {
  accuracy: 'perfect' | 'good' | 'ok' | 'miss';
  deviation: number;  // ms, positivo = atrasado, negativo = adiantado
  noteCorrect: boolean;
}

const TIMING_WINDOWS = {
  perfect: 80,   // ±80ms
  good: 150,     // ±150ms
  ok: 250,       // ±250ms
  // além disso: miss
};

class TimingEvaluator {
  evaluate(
    playedEvent: MIDIEvent,
    expectedNote: NoteEvent,
    currentBPM: number
  ): TimingResult {
    // Converte tick do exercício para ms
    const tickMs = 60000 / currentBPM / 24; // 24 ticks por beat
    const expectedMs = expectedNote.time * tickMs;
    
    const deviation = playedEvent.timestamp - expectedMs;
    const absDeviation = Math.abs(deviation);
    const noteCorrect = playedEvent.note === expectedNote.note;
    
    let accuracy: TimingResult['accuracy'];
    if (!noteCorrect) {
      accuracy = 'miss';
    } else if (absDeviation <= TIMING_WINDOWS.perfect) {
      accuracy = 'perfect';
    } else if (absDeviation <= TIMING_WINDOWS.good) {
      accuracy = 'good';
    } else if (absDeviation <= TIMING_WINDOWS.ok) {
      accuracy = 'ok';
    } else {
      accuracy = 'miss';
    }
    
    return { accuracy, deviation, noteCorrect };
  }
}
```

---

## Calibração de Latência

### Fluxo de calibração (primeira conexão)

1. O app exibe uma tecla piscando no teclado virtual
2. A mesma tecla do teclado físico também pisca (se o Roland suportar LED — verificar)
3. O app toca um som de "beep" preciso
4. O usuário toca a tecla indicada o mais próximo possível do beep
5. O app mede a diferença entre o timestamp do beep e o timestamp do evento MIDI
6. Repete 5 vezes e tira a mediana (para eliminar outliers)
7. Esse valor se torna o `latencyOffset` do parser

### Por que calibração individual importa

A latência BLE varia por:
- Dispositivo iOS/Android (processamento do OS)
- Ambiente de RF (interferência Bluetooth)
- Carga do processador do teclado
- Temperatura do dispositivo

Sem calibração, o mesmo timing pode ser avaliado como "perfeito" em um iPad e "atrasado" em um Android mais lento. Calibração resolve isso.

---

## Gerenciamento de Conexão BLE

### Estados de conexão

```typescript
type ConnectionState = 
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error';
```

### Reconexão automática

```typescript
class BLEMIDIManager {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // ms, dobra a cada tentativa
  
  async handleDisconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      // Pausa o exercício atual
      this.pauseExercise();
      
      await new Promise(r => setTimeout(r, this.reconnectDelay));
      this.reconnectDelay *= 2; // Backoff exponencial
      this.reconnectAttempts++;
      
      try {
        await this.connect();
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.resumeExercise(); // Retoma exatamente de onde parou
      } catch {
        await this.handleDisconnection(); // Tenta novamente
      }
    } else {
      // Desiste e pede ação do usuário
      this.setState('error');
    }
  }
}
```

---

## Modo Fallback — Teclado Virtual

Quando não há teclado físico conectado, o teclado virtual da tela processa toques:

```typescript
// Converte touch event para MIDIEvent sintético
const handleKeyPress = (midiNote: number) => {
  const event: MIDIEvent = {
    type: 'noteOn',
    note: midiNote,
    velocity: 80, // Velocity fixa para toque virtual
    timestamp: performance.now(),
    rawTimestamp: 0,
  };
  
  midiEventBus.emit(event);
};
```

**Limitação importante:** O teclado virtual não captura velocity (pressão). Isso significa que feedback de dinâmica não é possível sem teclado físico. O app comunica isso claramente, sem bloquear funcionalidade.

---

## Notas MIDI — Referência

| Tecla | MIDI Note |
|---|---|
| Dó central (C4) | 60 |
| Lá central (A4, 440Hz) | 69 |
| Primeira tecla do GO-88PX (A0) | 21 |
| Última tecla do GO-88PX (C8) | 108 |

```typescript
// Utilitários de nota
const noteNumberToName = (note: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(note / 12) - 1;
  return `${notes[note % 12]}${octave}`;
};

const noteNameToNumber = (name: string): number => {
  // "F#4" → 66
};
```
