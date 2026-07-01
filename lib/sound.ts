// Suptilni zvuk gola — sintetiziran preko WebAudio (bez audio asseta).
// Zvižduk suca + kratko "navijanje" (filtrirani šum). Mute stanje u localStorage.

const MUTE_KEY = "mrtvara-muted";
const listeners = new Set<() => void>();

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setMuted(m: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  listeners.forEach((l) => l());
}

/** Za useSyncExternalStore — obavještava o promjeni mute stanja. */
export function subscribeMuted(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

let ctx: AudioContext | null = null;
function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  return ctx;
}

function whistle(c: AudioContext, at: number, dur: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(2100, at);
  // lagani trill
  osc.frequency.setValueAtTime(2250, at + dur * 0.5);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.12, at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.02);
}

function cheer(c: AudioContext, at: number, dur: number) {
  const bufferSize = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // šum s postupnim pojačanjem pa smirivanjem (val navijanja)
    const env = Math.sin((Math.PI * i) / bufferSize);
    data[i] = (Math.random() * 2 - 1) * env * 0.5;
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.7;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.22, at + dur * 0.35);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start(at);
  src.stop(at + dur);
}

export function playGoalSound(): void {
  if (typeof window === "undefined" || isMuted()) return;
  try {
    const c = audioCtx();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    const t = c.currentTime + 0.02;
    whistle(c, t, 0.14);
    whistle(c, t + 0.18, 0.14);
    cheer(c, t + 0.34, 1.1);
  } catch {
    // tiho ignoriraj (npr. autoplay policy)
  }
}
