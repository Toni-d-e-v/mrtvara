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

/** "running" tek nakon geste korisnika — prije toga preglednik šuti. */
export function audioBlocked(): boolean {
  if (typeof window === "undefined" || isMuted()) return false;
  const c = audioCtx();
  return !!c && c.state !== "running";
}

/** Autoplay policy: kontekst se smije pokrenuti tek nakon dodira/tipke. */
export function unlockAudio(): void {
  try {
    const c = audioCtx();
    if (c && c.state === "suspended") void c.resume();
  } catch {
    // ignoriraj
  }
}

// ---------- Uvodna špica ----------

/** Zajednički izlaz špice: kompresor drži udarac glasnim, ali bez pucanja. */
let introBus: GainNode | null = null;
function bus(c: AudioContext): GainNode {
  if (!introBus) {
    const g = c.createGain();
    g.gain.value = 0.95;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 24;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.25;
    g.connect(comp).connect(c.destination);
    introBus = g;
  }
  return introBus;
}

function noiseBuffer(c: AudioContext, dur: number): AudioBuffer {
  const n = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Napetost prije starta: šum i pila koji se penju. */
function riser(c: AudioContext, at: number, dur: number, out: AudioScheduledSourceNode[]) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, dur);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.4;
  filter.frequency.setValueAtTime(260, at);
  filter.frequency.exponentialRampToValueAtTime(5400, at + dur);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.15, at + dur * 0.94);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(gain).connect(bus(c));
  src.start(at);
  src.stop(at + dur);
  out.push(src);

  const osc = c.createOscillator();
  const oscGain = c.createGain();
  const lp = c.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(55, at);
  osc.frequency.exponentialRampToValueAtTime(240, at + dur);
  lp.type = "lowpass";
  lp.frequency.value = 900;
  oscGain.gain.setValueAtTime(0.0001, at);
  oscGain.gain.exponentialRampToValueAtTime(0.07, at + dur * 0.9);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(lp).connect(oscGain).connect(bus(c));
  osc.start(at);
  osc.stop(at + dur);
  out.push(osc);
}

/** Jedno od pet startnih svjetala. */
function startLight(c: AudioContext, at: number, out: AudioScheduledSourceNode[]) {
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.2, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
  gain.connect(bus(c));

  for (const detune of [0, 7]) {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1046, at);
    osc.detune.setValueAtTime(detune, at);
    osc.connect(gain);
    osc.start(at);
    osc.stop(at + 0.15);
    out.push(osc);
  }
}

/** „Lights out" — sub udarac, tutnjava i akord koji nosi logo. */
function impact(c: AudioContext, at: number, out: AudioScheduledSourceNode[]) {
  const sub = c.createOscillator();
  const subGain = c.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(120, at);
  sub.frequency.exponentialRampToValueAtTime(32, at + 1.3);
  subGain.gain.setValueAtTime(0.0001, at);
  subGain.gain.exponentialRampToValueAtTime(0.5, at + 0.03);
  subGain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
  sub.connect(subGain).connect(bus(c));
  sub.start(at);
  sub.stop(at + 1.65);
  out.push(sub);

  const boom = c.createBufferSource();
  boom.buffer = noiseBuffer(c, 0.9);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(1600, at);
  lp.frequency.exponentialRampToValueAtTime(180, at + 0.9);
  const boomGain = c.createGain();
  boomGain.gain.setValueAtTime(0.0001, at);
  boomGain.gain.exponentialRampToValueAtTime(0.32, at + 0.02);
  boomGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
  boom.connect(lp).connect(boomGain).connect(bus(c));
  boom.start(at);
  boom.stop(at + 0.9);
  out.push(boom);

  // Akord (D): raste dok se logo otkriva, pa se povlači.
  const chordLp = c.createBiquadFilter();
  chordLp.type = "lowpass";
  chordLp.frequency.setValueAtTime(700, at);
  chordLp.frequency.exponentialRampToValueAtTime(2600, at + 0.8);
  const chordGain = c.createGain();
  chordGain.gain.setValueAtTime(0.0001, at);
  chordGain.gain.exponentialRampToValueAtTime(0.11, at + 0.5);
  chordGain.gain.setValueAtTime(0.11, at + 1.6);
  // Rep akorda drži ton dok logo stoji na ekranu.
  chordGain.gain.exponentialRampToValueAtTime(0.0001, at + 4.6);
  chordLp.connect(chordGain).connect(bus(c));

  for (const f of [73.42, 110, 146.83, 220, 293.66]) {
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(f, at);
    osc.detune.setValueAtTime(f > 200 ? 6 : -4, at);
    osc.connect(chordLp);
    osc.start(at);
    osc.stop(at + 4.7);
    out.push(osc);
  }

  // Svjetlucanje na vrhu — prati bljesak i otkrivanje logotipa.
  const bell = c.createOscillator();
  const bellGain = c.createGain();
  bell.type = "sine";
  bell.frequency.setValueAtTime(1174.66, at + 0.06);
  bellGain.gain.setValueAtTime(0.0001, at + 0.06);
  bellGain.gain.exponentialRampToValueAtTime(0.09, at + 0.16);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, at + 1.9);
  bell.connect(bellGain).connect(bus(c));
  bell.start(at + 0.06);
  bell.stop(at + 1.95);
  out.push(bell);
}

/** Sekunde od početka špice — mora se poklapati s CSS-om u `.intro`. */
export const INTRO_BEATS = {
  lights: [0.5, 0.78, 1.06, 1.34, 1.62],
  out: 2.3,
};

/**
 * Zvuk uvodne špice. `offsetSec` je vrijeme koje je prošlo otkad je animacija
 * krenula (CSS starta prije hidracije) pa zvuk ostaje u ritmu sa svjetlima.
 * Vraća funkciju za zaustavljanje.
 */
export function playIntroTheme(offsetSec = 0): () => void {
  const nodes: AudioScheduledSourceNode[] = [];
  const stop = () =>
    nodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        // već zaustavljen
      }
    });

  if (typeof window === "undefined" || isMuted()) return stop;

  try {
    const c = audioCtx();
    if (!c) return stop;
    if (c.state === "suspended") void c.resume();

    // Autoplay policy: dok kontekst nije pokrenut, currentTime stoji na nuli.
    // Tada se pomak ne primjenjuje — tema čeka odblokiranje i odsvira se cijela.
    const running = c.state === "running";
    if (!running) void c.resume();

    const now = c.currentTime;
    const shift = running ? Math.max(0, offsetSec) : 0;
    const zero = now + 0.02 - shift;
    const notBefore = (t: number) => Math.max(now + 0.02, t);

    const build = INTRO_BEATS.out - shift;
    if (build > 0.4) riser(c, notBefore(zero), build, nodes);
    for (const t of INTRO_BEATS.lights) {
      if (zero + t > now) startLight(c, zero + t, nodes);
    }
    // Udarac se uvijek čuje, po potrebi odmah.
    impact(c, notBefore(zero + INTRO_BEATS.out), nodes);
  } catch {
    // tiho ignoriraj (npr. autoplay policy)
  }

  return stop;
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
