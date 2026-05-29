/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable trail cursor on mobile or touch-capable devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Track active cursor hover triggers
    const addHoverListeners = () => {
      const targets = document.querySelectorAll("a, button, [role='button'], input, select, textarea, .slider-handle, .draggable");
      targets.forEach((elem) => {
        elem.addEventListener("mouseenter", () => setIsHovered(true));
        elem.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Apply custom global class to body to remove normal cursor
    document.body.classList.add("custom-cursor-active");

    // Add immediate listener check
    addHoverListeners();

    // Create an observer to auto-track newly added DOM nodes for hover
    const observer = new MutationObserver(() => {
      addHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("custom-cursor-active");
      observer.disconnect();
    };
  }, []);

  // Soft elastic spring effect for the outer ring trailing circle
  useEffect(() => {
    if (!isVisible) return;

    let frameId: number;
    
    const updateTrail = () => {
      setTrail((prev) => {
        // Linear interpolation for spring-lag laggy look
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      frameId = requestAnimationFrame(updateTrail);
    };

    frameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(frameId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Inner Precision laser dot */}
      <div
        id="custom-dot"
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ${
          isClicking ? "scale-50 bg-pink-500" : isHovered ? "scale-125" : "scale-100"
        }`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />

      {/* 2. Outer cyber ring trail */}
      <div
        id="custom-trail"
        className={`fixed top-0 left-0 rounded-full border border-cyan-400 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ${
          isClicking 
            ? "w-10 h-10 border-pink-500 bg-pink-500/10 shadow-[0_0_15px_#ec4899]" 
            : isHovered 
              ? "w-12 h-12 border-pink-400 bg-cyan-500/5 shadow-[0_0_20px_#06b6d4] scale-110" 
              : "w-7 h-7 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
        }`}
        style={{ left: `${trail.x}px`, top: `${trail.y}px` }}
      />
    </>
  );
}
