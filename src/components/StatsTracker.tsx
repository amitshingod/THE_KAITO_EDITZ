/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Youtube, Users, Eye, Sparkles, Flame, Download, CheckCircle, Lock } from "lucide-react";
import { playClickSound, playSlashSound } from "../audioUtils";

interface StatsTrackerProps {
  onUnlockPremium: () => void;
  isUnlocked: boolean;
}

export default function StatsTracker({ onUnlockPremium, isUnlocked }: StatsTrackerProps) {
  const [clickedCounter, setClickedCounter] = useState(0);
  const [fakeSubs, setFakeSubs] = useState(8472);
  const [liveViews, setLiveViews] = useState(12800);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string; speedY: number; speedX: number }[]>([]);
  const confettiId = useRef(0);

  // Auto incremental views counter to feel "alive"
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveViews((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const triggerConfetti = () => {
    const colors = ["#06b6d4", "#ec4899", "#8b5cf6", "#eab308", "#10b981"];
    const newConfetti = Array.from({ length: 45 }).map(() => {
      confettiId.current += 1;
      return {
        id: confettiId.current,
        x: 40 + Math.random() * 20, // percentage start around button
        y: 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -(Math.random() * 5 + 4),
        speedX: (Math.random() - 0.5) * 6
      };
    });

    setConfetti((prev) => [...prev, ...newConfetti]);

    // Clean up confetti after 2 seconds
    setTimeout(() => {
      setConfetti((prev) => prev.slice(newConfetti.length));
    }, 2500);
  };

  const handleSubscribeClick = () => {
    playSlashSound();
    setClickedCounter((prev) => prev + 1);
    setFakeSubs((prev) => prev + 1);
    triggerConfetti();

    // After 3 clicks, auto-unlock premium presets for client view
    if (clickedCounter >= 2 && !isUnlocked) {
      onUnlockPremium();
    }
  };

  // Simple frame updates loop for confetti physics
  useEffect(() => {
    if (confetti.length === 0) return;

    const frame = requestAnimationFrame(() => {
      setConfetti((prev) =>
        prev.map((c) => ({
          ...c,
          y: c.y + c.speedY,
          x: c.x + c.speedX,
          speedY: c.speedY + 0.2 // gravity pull down
        }))
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [confetti]);

  return (
    <div className="space-y-6">
      {/* Dynamic Statistics counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Counter 1: Views */}
        <div className="bg-neutral-900/55 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl transform translate-x-6 -translate-y-6 group-hover:bg-cyan-500/10 transition-all duration-500"></div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Live Session Views</span>
            <h4 className="text-2xl font-black text-white font-mono tracking-tight">
              {liveViews.toLocaleString()}
            </h4>
            <span className="text-[9px] text-cyan-400 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-ping"></span> +128 Views on Load
            </span>
          </div>
        </div>

        {/* Counter 2: Subs */}
        <div className="bg-neutral-900/55 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl transform translate-x-6 -translate-y-6 group-hover:bg-pink-500/10 transition-all duration-500"></div>
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Simulated Channels</span>
            <h4 className="text-2xl font-black text-white font-mono tracking-tight">
              {fakeSubs.toLocaleString()}
            </h4>
            <p className="text-[9px] text-zinc-500">Subscribed creators</p>
          </div>
        </div>

        {/* Counter 3: Hot Meter */}
        <div className="bg-neutral-900/55 border border-zinc-800/80 rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl transform translate-x-6 -translate-y-6 group-hover:bg-purple-500/10 transition-all duration-500"></div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">CC Impact Rating</span>
            <h4 className="text-2xl font-black text-rose-500 font-display tracking-tight uppercase">
              S+ RANK
            </h4>
            <p className="text-[9px] text-zinc-500">Glow correction certified</p>
          </div>
        </div>
      </div>

      {/* Task Section: Subscribe to unlock premium preset files */}
      <div className="bg-zinc-950 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        {/* Glow backdrop indicator */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-red-600/5 rounded-full blur-3xl rounded-full"></div>

        {/* Confetti canvas injection inside coordinates wrapper */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute w-2 h-2 rounded-full shadow-sm"
              style={{
                top: `${c.y}%`,
                left: `${c.x}%`,
                backgroundColor: c.color,
                transform: "scale(1.2)"
              }}
            />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-red-600/15 border border-red-500/30 text-rose-500 text-[10px] font-black px-2.5 py-1 rounded-md uppercase font-display select-none">
              <Youtube className="w-3.5 h-3.5 fill-red-600" /> SUBSCRIBER MISSION
            </span>
            <h4 className="text-base font-black text-white font-display uppercase tracking-tight">
              Unlock Professional AE & Premiere presets
            </h4>
            <p className="text-xs text-zinc-400 max-w-lg">
              Click the subscribe button below <span className="text-pink-400 font-bold">3 times</span> to simulate a real channel subscription and reveal hidden After Effects impact shakes, transition overlays, and lut color presets.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleSubscribeClick}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-display text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all cursor-pointer active:scale-95 group relative overflow-hidden"
            >
              <Youtube className="w-4 h-4 fill-white" /> SUBSCRIBE NOW
            </button>
            <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 mt-1">
              <span>Clicked Counter: <strong className="text-red-500">{clickedCounter}</strong>/3</span>
              <span className="text-zinc-600">|</span>
              <span>Subscribed creators: <strong className="text-cyan-400">{fakeSubs}</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic unlocked slide-shelf */}
        <div className="mt-6 pt-5 border-t border-zinc-900">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-zinc-300 font-display flex items-center gap-1.5">
              {isUnlocked ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Lock className="w-4 h-4 text-zinc-500" />
              )}
              {isUnlocked ? "STATUS: UNLOCKED CONTENT" : "STATUS: LOCKED CONTENT"}
            </span>
            {isUnlocked && (
              <span className="text-emerald-400 text-[10px] font-bold capitalize font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Authorized Access
              </span>
            )}
          </div>

          {/* Presets List item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "KAITO_GLOW_LUT_V2.cube",
                size: "4.8 MB",
                desc: "High saturated teal & pink color correction overlay lut.",
                type: "Premiere / AE"
              },
              {
                title: "Impact_Shake_Preset.ffx",
                size: "1.2 MB",
                desc: "100% vector keyframed camera impact shake template.",
                type: "After Effects"
              }
            ].map((preset, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl p-3.5 transition-all duration-300 flex items-center justify-between ${
                  isUnlocked 
                    ? "bg-zinc-900/60 border-cyan-500/20 hover:border-cyan-400/50" 
                    : "bg-zinc-950/25 border-zinc-900 opacity-50 select-none"
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold font-mono text-zinc-100 flex items-center gap-1.5">
                    {preset.title} <span className="text-[9px] text-zinc-500">({preset.size})</span>
                  </h5>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{preset.desc}</p>
                  <span className="inline-block text-[9px] text-pink-400 font-semibold font-mono uppercase tracking-wider mt-1.5 bg-pink-500/5 border border-pink-500/10 px-1.5 py-0.5 rounded">
                    {preset.type}
                  </span>
                </div>
                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        playClickSound();
                        alert(`Downloading preset: ${preset.title}`);
                      }}
                      className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-all cursor-pointer"
                      title="Download Presets"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
