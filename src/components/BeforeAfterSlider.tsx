/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sliders, Maximize2, Zap } from "lucide-react";
import { playSwooshSound } from "../audioUtils";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);

  // Trigger sensory feedback upon first slider movement
  const playedSwoosh = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);

    if (!playedSwoosh.current) {
      playSwooshSound();
      playedSwoosh.current = true;
      // throttle subsequent audio triggers
      setTimeout(() => {
        playedSwoosh.current = false;
      }, 1500);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-bold text-pink-500 tracking-widest uppercase font-display flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" /> VFX COMPARISON ENGINE
          </span>
          <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
            Before vs After Edit Style
          </h3>
          <p className="text-xs text-zinc-400 max-w-md">
            Drag the handle to compare standard flat anime raw output with THE_KAITO_EDITZ's legendary glow-enhanced CC.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-black/60 rounded-lg px-3 py-1.5 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <Sliders className="w-3 h-3 text-cyan-400" /> Use Mouse / Swipe to Drag
        </div>
      </div>

      {/* Main Drag Slider Stage */}
      <div 
        ref={containerRef}
        className="relative w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-zinc-800 shadow-inner group"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Right side: AFTER (The High-Energy Edit with Intense Glow Overlay) */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200" 
            alt="After Kaito Editz"
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Neon cyber atmosphere filters over Right */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-500/20 mix-blend-color-dodge"></div>
          
          <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-display text-[10px] font-black px-3 py-1 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.5)] flex items-center gap-1 uppercase tracking-widest z-10">
            <Zap className="w-3 h-3 animate-spin" /> THE_KAITO_EDITZ
          </div>
        </div>

        {/* Left side: BEFORE (The Flat Raw Cutout) */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Before Image uses same coordinates, has flat / desaturated / blurry or low-contrast look */}
          <div className="absolute inset-0 w-[100vw] h-full" style={{ width: containerRef.current?.getBoundingClientRect().width || 800 }}>
            <img 
              src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1200" 
              alt="Before Edit"
              className="w-full h-[360px] md:h-[420px] object-cover filter saturate-[0.35] brightness-[0.70] contrast-[0.90] pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Raw dark indicator overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute top-4 left-4 bg-zinc-900/90 text-zinc-400 font-display text-[10px] font-bold px-3 py-1 rounded-full border border-zinc-700 uppercase tracking-widest z-10 shadow-md">
            RAW CAPTURE
          </div>
        </div>

        {/* Split separator handle line */}
        <div 
          className="absolute inset-y-0 w-[3px] bg-cyan-400 z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Glowing central indicator pulse knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cyan-400 border-4 border-black flex items-center justify-center shadow-[0_0_15px_#06b6d4] transition-transform duration-300 group-hover:scale-110">
            <Maximize2 className="w-4 h-4 text-black transform rotate-45" />
          </div>
        </div>
      </div>

      {/* Showcase Description details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs text-zinc-400">
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900">
          <h4 className="font-bold text-zinc-300 uppercase mb-1 font-display text-[11px] tracking-wider text-cyan-400">
            RAW CAMERA CUT (0% Saturation Sync)
          </h4>
          <p>
            Plain high-definition video source capture. Colors are dull, lack dynamic range, compression noise is visible, and lighting lacks character.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900">
          <h4 className="font-bold text-zinc-300 uppercase mb-1 font-display text-[11px] tracking-wider text-pink-500">
            KAITO SUPREME RENDER (100% Flow Synced)
          </h4>
          <p>
            Equipped with custom high-exposure glow channels, keyframed speed ramps, subtle camera shake, color Correcting, and neon motion tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
