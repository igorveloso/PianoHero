# 11 — Sistema de Áudio

## Por Que Áudio de Qualidade é Inegociável

O cérebro do músico em formação aprende parcialmente pelo ouvido. Se o som que sai do app for sintético, falso, ou desagradável, o aluno inconscientemente dissocia o que está tocando do som de piano real. Quando chegar num piano acústico, o instrumento vai soar estranho.

Piano Hero usa samples de piano de concerto real. Não síntese. Não MIDI genérico.

---

## Fonte de Samples: Salamander Grand Piano

**O que é:** Samples de um Yamaha C5 (grand piano de 7 pés) gravados em 16 velocity layers por nota, com e sem pedal de sustain.

**Licença:** Creative Commons (uso livre)

**Qualidade:** Equivalente a pianos digitais de R$ 15.000+. É o mesmo sample set usado em muitos DAWs profissionais.

**Download:** https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html

**Tamanho:** ~500MB não comprimido → ~80MB em OGG Vorbis qualidade q6

---

## Arquitetura do Sampler

### Velocity layers

O piano tem dinâmica — tocar forte soa diferente de tocar suave. O Salamander tem 16 layers de velocity. O app usa 3 simplificados:

| Layer | Velocity MIDI | Nome |
|---|---|---|
| pp (pianissimo) | 1-42 | Suave |
| mf (mezzo-forte) | 43-84 | Médio |
| ff (fortíssimo) | 85-127 | Forte |

### Round-robin

Para evitar o "machine gun effect" (a mesma nota repetida soando artificial), o sampler alterna entre 2-3 takes diferentes da mesma nota a cada toque.

### Pre-loading

```typescript
class PianoSampler {
  private buffers: Map<string, AudioBuffer[]> = new Map();
  private audioContext: AudioContext;
  
  // Chave: "note_layer" ex: "60_mf"
  private getKey(note: number, velocity: number): string {
    const layer = velocity < 43 ? 'pp' : velocity < 85 ? 'mf' : 'ff';
    return `${note}_${layer}`;
  }
  
  async preloadExercise(exerciseNotes: number[]) {
    // Carrega apenas as notas necessárias para o exercício
    const uniqueNotes = [...new Set(exerciseNotes)];
    const loadPromises = uniqueNotes.flatMap(note => 
      ['pp', 'mf', 'ff'].map(layer => this.loadSample(note, layer))
    );
    await Promise.all(loadPromises);
  }
  
  async preloadFullRange() {
    // Para modo livre — carrega todas as 88 notas (mf apenas)
    // Feito em background durante onboarding
  }
  
  playNote(midiNote: number, velocity: number = 80) {
    const key = this.getKey(midiNote, velocity);
    const buffers = this.buffers.get(key);
    if (!buffers?.length) return;
    
    // Round-robin
    const bufferIndex = this.roundRobinCounter.get(key) ?? 0;
    const buffer = buffers[bufferIndex % buffers.length];
    this.roundRobinCounter.set(key, bufferIndex + 1);
    
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    
    // Gain proporcional à velocity
    const gainValue = (velocity / 127) * this.masterVolume;
    gainNode.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start();
    
    // Armazena referência para stop() no noteOff
    this.activeNotes.set(midiNote, { source, gainNode });
  }
  
  stopNote(midiNote: number) {
    const active = this.activeNotes.get(midiNote);
    if (!active) return;
    
    // Release suave (evita click de áudio)
    const { gainNode } = active;
    gainNode.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.1);
    
    this.activeNotes.delete(midiNote);
  }
}
```

---

## Latência de Áudio

**Target:** < 10ms entre evento MIDI e som audível.

### iOS
- Usa `AVAudioEngine` por baixo (via react-native-audio-pro)
- Buffer size: 128 samples a 44.1kHz = ~2.9ms de buffer
- Latência total esperada: 5-8ms

### Android
- Usa `AAudio` em dispositivos compatíveis (Android 8.1+)
- Latência varia mais por dispositivo: 8-20ms
- Fallback para `OpenSL ES` em dispositivos mais antigos

### Por que isso importa

Se o áudio atrasar mais de 20ms em relação ao toque, o cérebro percebe a dissociação entre "pressionar" e "ouvir". Isso quebra o aprendizado motor. Em jogos de ritmo, latência de áudio > 30ms é game-breaking.

---

## Pedal de Sustain

Com pedal pressionado, as notas não param quando você solta a tecla — elas continuam ressoando até o pedal ser solto.

```typescript
class SustainPedal {
  private isDown = false;
  private sustainedNotes: Set<number> = new Set();
  
  press() {
    this.isDown = true;
  }
  
  release() {
    this.isDown = false;
    // Para todos os sons sustentados
    this.sustainedNotes.forEach(note => {
      sampler.stopNote(note);
    });
    this.sustainedNotes.clear();
  }
  
  handleNoteOff(midiNote: number) {
    if (this.isDown) {
      // Não para o som — adiciona à lista de sustentados
      this.sustainedNotes.add(midiNote);
    } else {
      // Para normalmente
      sampler.stopNote(midiNote);
    }
  }
}
```

---

## Som de Feedback do App

Além dos samples do piano, o app tem sons de interface:

| Som | Uso | Duração |
|---|---|---|
| `hit_perfect.ogg` | Acerto perfeito | 80ms |
| `hit_good.ogg` | Acerto "bom" | 60ms |
| `miss.ogg` | Erro | 50ms |
| `level_up.ogg` | Progressão de nível | 2000ms |
| `session_end.ogg` | Fim de sessão | 500ms |
| `connection.ogg` | Roland conectado | 300ms |

Esses sons são **separados** dos samples de piano e mixados em volume menor. O som do piano sempre fica em primeiro plano.

**Importante:** Sons de feedback podem ser desabilitados individualmente nas configurações. Os samples de piano nunca são desabilitados (são o ponto central do app).

---

## Configurações de Áudio Expostas ao Usuário

```typescript
interface AudioSettings {
  pianoVolume: number;        // 0.0 - 1.0, padrão 0.8
  feedbackSoundsVolume: number; // 0.0 - 1.0, padrão 0.4
  sampleQuality: 'low' | 'medium' | 'high'; // low = 1 velocity layer
  outputDevice: 'tablet' | 'roland' | 'headphones'; // seleção de saída
}
```

**`sampleQuality: 'low'`** usa apenas o layer `mf` e desabilita round-robin. Para dispositivos com memória limitada (~2GB RAM).
