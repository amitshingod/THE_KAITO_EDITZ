/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let isMuted: boolean = false;

export function toggleMute(state?: boolean): boolean {
  if (state !== undefined) {
    isMuted = state;
  } else {
    isMuted = !isMuted;
  }
  // Store reference in localStorage
  localStorage.setItem("kaito_mute_state", isMuted ? "true" : "false");
  return isMuted;
}

export function getMuteState(): boolean {
  // Try retrieving from localStorage
  const saved = localStorage.getItem("kaito_mute_state");
  if (saved !== null) {
    isMuted = saved === "true";
  }
  return isMuted;
}

// Custom Web Audio API synthesizer for high-performance zero-dependency sound effects
export function playSwooshSound() {
  if (getMuteState()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Create nodes
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    // Rapid exponential sweep up for futuristic zoom vibe
    osc.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.18);

    // Filter setup
    filter.type = "lowpass";
    filter.Q.setValueAtTime(4, ctx.currentTime);
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + 0.18);

    // Gain envelope
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    // Connections
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Start & Stop
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.22);
  } catch (e) {
    console.warn("Web Audio Swoosh failed:", e);
  }
}

export function playSlashSound() {
  if (getMuteState()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // Metallic cutting sound combines frequency sweeps
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(1200, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(800, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

    filterNode.type = "bandpass";
    filterNode.Q.setValueAtTime(8, ctx.currentTime);
    filterNode.frequency.setValueAtTime(1500, ctx.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc1.connect(filterNode);
    osc2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.16);
    osc2.stop(ctx.currentTime + 0.16);
  } catch (e) {
    console.warn("Web Audio Slash failed:", e);
  }
}

export function playClickSound() {
  if (getMuteState()) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.setValueAtTime(400, ctx.currentTime + 0.03);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.warn("Web Audio Click failed:", e);
  }
}
