// Synthesized Web Audio API feedback for tactile mini-game responsiveness
let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined' || isMuted) return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
}

export function getSoundMuted(): boolean {
  return isMuted;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.08,
  delaySec = 0
) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  } catch {
    // Audio playback blocked or unavailable
  }
}

export const gameSound = {
  click() {
    playTone(520, 0.06, 'triangle', 0.05);
  },
  select() {
    playTone(440, 0.07, 'sine', 0.06);
    playTone(587, 0.09, 'sine', 0.05, 0.05);
  },
  correct() {
    playTone(523.25, 0.1, 'triangle', 0.07);
    playTone(659.25, 0.12, 'triangle', 0.07, 0.07);
    playTone(783.99, 0.18, 'triangle', 0.08, 0.14);
  },
  wrong() {
    playTone(280, 0.14, 'sawtooth', 0.045);
    playTone(220, 0.18, 'sawtooth', 0.04, 0.1);
  },
  harvest() {
    playTone(392, 0.1, 'sine', 0.06);
    playTone(523.25, 0.12, 'sine', 0.07, 0.08);
    playTone(659.25, 0.14, 'sine', 0.07, 0.16);
    playTone(783.99, 0.25, 'triangle', 0.08, 0.24);
  },
};
