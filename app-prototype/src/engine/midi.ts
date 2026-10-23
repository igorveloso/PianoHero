// src/engine/midi.ts
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Platform } from 'react-native';

// BLE MIDI Service/Characteristic UUIDs (standard)
const BLE_MIDI_SERVICE      = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
const BLE_MIDI_CHAR         = '7772e5db-3868-4112-a1a9-f2669d106bf3';

export interface MIDIEvent {
  type: 'noteOn' | 'noteOff' | 'sustainOn' | 'sustainOff';
  note?: number;
  velocity?: number;
  timestamp: number;
}

type MIDIListener = (event: MIDIEvent) => void;

class MIDIEngine {
  private manager: BleManager | null = null;
  private device: Device | null = null;
  private listeners: Set<MIDIListener> = new Set();
  private latencyOffset: number = 0;
  private _isConnected: boolean = false;

  get isConnected() { return this._isConnected; }

  init() {
    if (Platform.OS === 'web') return;
    this.manager = new BleManager();
  }

  setLatencyOffset(ms: number) {
    this.latencyOffset = ms;
  }

  addListener(fn: MIDIListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(event: MIDIEvent) {
    this.listeners.forEach(fn => fn(event));
  }

  // Virtual keyboard (no physical device)
  emitVirtual(note: number, velocity: number) {
    this.emit({
      type: velocity > 0 ? 'noteOn' : 'noteOff',
      note,
      velocity,
      timestamp: Date.now() - this.latencyOffset,
    });
  }

  async scan(): Promise<Device[]> {
    if (!this.manager) return [];
    return new Promise((resolve) => {
      const found: Device[] = [];
      this.manager!.startDeviceScan(
        [BLE_MIDI_SERVICE],
        { allowDuplicates: false },
        (error, device) => {
          if (error || !device) return;
          if (!found.find(d => d.id === device.id)) {
            found.push(device);
          }
        }
      );
      setTimeout(() => {
        this.manager!.stopDeviceScan();
        resolve(found);
      }, 5000);
    });
  }

  async connect(device: Device) {
    if (!this.manager) return;
    this.device = await device.connect();
    await this.device.discoverAllServicesAndCharacteristics();

    this.device.monitorCharacteristicForService(
      BLE_MIDI_SERVICE,
      BLE_MIDI_CHAR,
      (error, char) => {
        if (error || !char?.value) return;
        this.parsePacket(char.value);
      }
    );

    this._isConnected = true;
  }

  disconnect() {
    this.device?.cancelConnection();
    this.device = null;
    this._isConnected = false;
  }

  private parsePacket(base64: string) {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    let i = 0;

    // Skip BLE MIDI header byte
    if (bytes.length < 2) return;
    const timestampHigh = (bytes[i++] & 0x3F) << 7;

    while (i < bytes.length) {
      if (!(bytes[i] & 0x80)) { i++; continue; }

      const timestampLow = bytes[i++] & 0x7F;
      if (i >= bytes.length) break;

      const status = bytes[i++];
      const type = (status >> 4) & 0x0F;

      if (type === 0x9 && i + 1 < bytes.length) {
        const note = bytes[i++];
        const velocity = bytes[i++];
        this.emit({
          type: velocity > 0 ? 'noteOn' : 'noteOff',
          note, velocity,
          timestamp: Date.now() - this.latencyOffset,
        });
      } else if (type === 0x8 && i + 1 < bytes.length) {
        const note = bytes[i++];
        i++; // velocity
        this.emit({ type: 'noteOff', note, timestamp: Date.now() - this.latencyOffset });
      } else if (type === 0xB && i + 1 < bytes.length) {
        const ctrl = bytes[i++];
        const val  = bytes[i++];
        if (ctrl === 64) {
          this.emit({ type: val >= 64 ? 'sustainOn' : 'sustainOff', timestamp: Date.now() });
        }
      } else {
        i++;
      }
    }
  }
}

export const midiEngine = new MIDIEngine();
