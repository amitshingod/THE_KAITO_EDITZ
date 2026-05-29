/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { Music, Play, Pause, SkipForward, Volume2, VolumeX, Radio } from "lucide-react";
import { playClickSound } from "../audioUtils";

interface Track {
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    title: "Tokyo Lofi Rain (Chilled)",
    artist: "THE_KAITO_EDITZ Vibes",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Cyberpunk Impact Pulse (Sync Beat)",
    artist: "Neon Shinjuku Underground",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Kawaii Future Bass Grid",
    artist: "Otaku Studio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isVisualizerReady, setIsVisualizerReady] = useState(false);

  const currentTrack = TRACKS[currentTrackIndex];

  // Initialize or update track
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Set up Web Audio Analyser
  const setupAnalyser = () => {
    if (!audioRef.current || analyserRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small size for responsive visualizer bars

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      setIsVisualizerReady(true);
    } catch (err) {
      console.warn("Could not setup audio analyser node (CORS/Gesture restriction):", err);
      setIsVisualizerReady(false);
    }
  };

  // Canvas render loop for visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 16;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Idle animation values
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = isPlaying 
            ? Math.random() * 80 + 20 
            : Math.sin(Date.now() * 0.003 + i) * 15 + 20;
        }
      }

      const barWidth = (width / bufferLength) - 1;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const percent = dataArray[i] / 255;
        const barHeight = Math.max(4, percent * height);

        // Neon cyber gradient
        const hue = (i / bufferLength) * 120 + 280; // violet to cyan glow
        ctx.fillStyle = `hsla(${hue}, 90%, 55%, ${isPlaying ? 0.85 : 0.4})`;
        ctx.shadowBlur = isPlaying ? 8 : 2;
        ctx.shadowColor = `hsla(${hue}, 95%, 50%, 0.6)`;

        // Draw rounded bars
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, height - barHeight, barWidth, barHeight, 2) : ctx.rect(x, height - barHeight, barWidth, barHeight);
        ctx.fill();

        x += barWidth + 1.5;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isVisualizerReady]);

  const handlePlayPause = async () => {
    playClickSound();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setupAnalyser();
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setErrorMsg("");
      } catch (err: any) {
        console.warn("Autoplay blocked:", err);
        setErrorMsg("Interact with page first to play");
        setTimeout(() => setErrorMsg(""), 3000);
      }
    }
  };

  const handleNextTrack = () => {
    playClickSound();
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(false);
    
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        if (audioContextRef.current && audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        }
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }, 100);
  };

  const handleMuteToggle = () => {
    playClickSound();
    setIsMuted(!isMuted);
  };

  return (
    <div id="floating-music-player" className="fixed bottom-6 left-6 z-40 max-w-sm bg-neutral-900/90 border border-cyan-500/30 backdrop-blur-md rounded-2xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex items-center gap-4 transition-all duration-300 hover:border-cyan-400">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        crossOrigin="anonymous"
        loop
        onEnded={handleNextTrack}
      />

      {/* Spinning Vinyl Record Disc */}
      <div className="relative group flex-shrink-0">
        <div 
          className={`w-14 h-14 rounded-full bg-black border-2 border-zinc-800 flex items-center justify-center relative shadow-lg ${
            isPlaying ? "animate-[spin_4s_linear_infinite]" : "animate-none"
          }`}
        >
          {/* Vinyl grooves */}
          <div className="absolute inset-1 rounded-full border border-zinc-800/80"></div>
          <div className="absolute inset-2 rounded-full border border-zinc-900/60"></div>
          <div className="absolute inset-3 rounded-full border border-zinc-800/40"></div>
          
          {/* Album Cover Center */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 flex items-center justify-center border border-black z-10">
            <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
        </div>

        {/* Small arm indicator */}
        <div 
          className={`absolute -top-1.5 -right-1.5 w-6 h-6 origin-top-left transition-transform duration-500 ${
            isPlaying ? "rotate-[15deg]" : "rotate-0"
          }`}
        >
          <div className="w-1.5 h-6 bg-zinc-400/85 rounded-full shadow-sm relative origin-top">
            <div className="absolute bottom-0 right-0 w-2.5 h-1.5 bg-zinc-300 rounded transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Info & Controls */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] font-semibold text-cyan-400 tracking-wider flex items-center gap-1 font-display">
            <Music className="w-3 h-3 text-pink-500 animate-bounce" /> BACKGROUND MUSIC
          </span>
          {errorMsg && (
            <span className="text-[9px] text-pink-400 font-medium truncate shrink-0">
              {errorMsg}
            </span>
          )}
        </div>
        
        <h4 className="text-xs font-bold text-white font-sans truncate pr-2">
          {currentTrack.title}
        </h4>
        <p className="text-[10px] text-zinc-400 truncate mb-2">
          {currentTrack.artist}
        </p>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-white transition-all cursor-pointer"
            title={isPlaying ? "Pause Track" : "Play Track"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Play className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-cyan-400 flex items-center justify-center text-white transition-all cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleMuteToggle}
            className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-pink-400 flex items-center justify-center text-white transition-all cursor-pointer"
            title={isMuted ? "Unmute" : "Mute Sound"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-pink-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          {/* Mini frequency rendering canvas */}
          <div className="flex-1 flex items-end justify-center h-5 w-20 bg-black/40 rounded px-1 self-center border border-zinc-800">
            <canvas ref={canvasRef} width="80" height="18" className="w-full h-full block" />
          </div>
        </div>
      </div>
    </div>
  );
}
