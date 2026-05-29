/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Youtube, Users, Flame, Eye, Settings, ShieldCheck, Mail, Calendar, 
  DollarSign, Award, PenTool, Sparkles, Music, Menu, X, Lock, Unlock, 
  Send, Share2, Tv, Gamepad2, Film, Filter, Clock, Plus, Instagram, 
  Radio, Volume2, VolumeX, Shield, Play, LogOut, Heart, LogIn
} from "lucide-react";

// Imports from custom files
import { VideoItem, FanUser, FanMessage, CommissionRequest, ThemeType } from "./types";
import { INITIAL_VIDEOS, INITIAL_SHORTS, INITIAL_LEADERBOARD, INITIAL_MESSAGES } from "./initialData";
import { playClickSound, playSlashSound, playSwooshSound, toggleMute, getMuteState } from "./audioUtils";

import CustomCursor from "./components/CustomCursor";
import AudioPlayer from "./components/AudioPlayer";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import CommissionForm from "./components/CommissionForm";
import StatsTracker from "./components/StatsTracker";
import { Leaderboard, AuthModal } from "./components/AuthAndLeaderboard";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Intro Preloader State
  const [showPreloader, setShowPreloader] = useState(true);
  const [preloaderProgress, setPreloaderProgress] = useState(0);

  // Core App states
  const [activeTheme, setActiveTheme] = useState<ThemeType>("cyberpunk");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [shorts, setShorts] = useState<any[]>([]);
  const [leaderboardFans, setLeaderboardFans] = useState<FanUser[]>([]);
  const [messages, setMessages] = useState<FanMessage[]>([]);
  const [commissions, setCommissions] = useState<CommissionRequest[]>([]);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<FanUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Navigation states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // Active video playing modal state
  const [activePlayId, setActivePlayId] = useState<string | null>(null);

  // Premium Presets Unlock state (tracked on client)
  const [presetsUnlocked, setPresetsUnlocked] = useState(false);

  // New Chat comment text
  const [chatInput, setChatInput] = useState("");

  // Simulated live connection parameters
  const [liveViewersCount] = useState(128); // "Views: 128" requirement

  // Ref to messages bottom to auto Scroll
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Initial State Hydration via LocalStorage
  useEffect(() => {
    // Sync preloaded lists
    const storedVideos = localStorage.getItem("kaito_videos");
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    } else {
      setVideos(INITIAL_VIDEOS);
      localStorage.setItem("kaito_videos", JSON.stringify(INITIAL_VIDEOS));
    }

    const storedCommissions = localStorage.getItem("kaito_commissions");
    if (storedCommissions) {
      setCommissions(JSON.parse(storedCommissions));
    } else {
      setCommissions([]);
    }

    const storedLeaderboard = localStorage.getItem("kaito_leaderboard");
    if (storedLeaderboard) {
      setLeaderboardFans(JSON.parse(storedLeaderboard));
    } else {
      setLeaderboardFans(INITIAL_LEADERBOARD);
      localStorage.setItem("kaito_leaderboard", JSON.stringify(INITIAL_LEADERBOARD));
    }

    const storedMessages = localStorage.getItem("kaito_messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages(INITIAL_MESSAGES);
      localStorage.setItem("kaito_messages", JSON.stringify(INITIAL_MESSAGES));
    }

    setShorts(INITIAL_SHORTS);
    setAudioMuted(getMuteState());

    // Load any logged-in user session safely
    const storedUser = localStorage.getItem("kaito_user_session");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Preloader simulated timer
  useEffect(() => {
    if (!showPreloader) return;

    const interval = setInterval(() => {
      setPreloaderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowPreloader(false);
            playSwooshSound();
          }, 600);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 5;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [showPreloader]);

  // Auto scroll chat wall comments
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 3. Audio UI parameters
  const handleToggleMute = () => {
    const newState = toggleMute();
    setAudioMuted(newState);
  };

  // 4. Admin Event helpers
  const handleAddVideo = (newVid: Omit<VideoItem, "id" | "views" | "uploadedAt">) => {
    const freshVid: VideoItem = {
      ...newVid,
      id: "vid-" + Date.now(),
      views: "0",
      uploadedAt: new Date().toISOString().split("T")[0]
    };
    const updated = [freshVid, ...videos];
    setVideos(updated);
    localStorage.setItem("kaito_videos", JSON.stringify(updated));
  };

  const handleDeleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    localStorage.setItem("kaito_videos", JSON.stringify(updated));
  };

  const handleUpdateCommissionStatus = (id: string, state: CommissionRequest["status"]) => {
    const updated = commissions.map((c) => c.id === id ? { ...c, status: state } : c);
    setCommissions(updated);
    localStorage.setItem("kaito_commissions", JSON.stringify(updated));
  };

  const handleCreateCommission = (req: CommissionRequest) => {
    const updated = [req, ...commissions];
    setCommissions(updated);
    localStorage.setItem("kaito_commissions", JSON.stringify(updated));

    // Offer community points upon booking!
    if (currentUser) {
      const updatedFans = leaderboardFans.map((fan) => {
        if (fan.username === currentUser.username) {
          const newPts = fan.points + 1500; // Book reward
          return { ...fan, points: newPts, activityCount: fan.activityCount + 1 };
        }
        return fan;
      });
      setLeaderboardFans(updatedFans);
      localStorage.setItem("kaito_leaderboard", JSON.stringify(updatedFans));
    }
  };

  // 5. Auth events
  const handleLoginSuccess = (user: FanUser) => {
    setCurrentUser(user);
    localStorage.setItem("kaito_user_session", JSON.stringify(user));

    // Append this user to live client leaderboard if not already exists
    const exists = leaderboardFans.some((fan) => fan.username === user.username);
    if (!exists) {
      const updatedFans = [...leaderboardFans, user];
      setLeaderboardFans(updatedFans);
      localStorage.setItem("kaito_leaderboard", JSON.stringify(updatedFans));
    }

    setShowAuthModal(false);
  };

  const handleLogout = () => {
    playClickSound();
    setCurrentUser(null);
    localStorage.removeItem("kaito_user_session");
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playSlashSound();

    // Default mock info if not logged in
    const finalUser = currentUser || {
      id: "anon-guest",
      username: "Guest_Beast",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
      role: "fan",
      joinedAt: new Date().toISOString(),
      points: 10,
      activityCount: 1,
      unlockedPremium: false
    };

    const newMsg: FanMessage = {
      id: "msg-" + Date.now(),
      userId: finalUser.id,
      username: finalUser.username,
      avatarUrl: finalUser.avatarUrl,
      role: finalUser.role,
      content: chatInput.trim(),
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem("kaito_messages", JSON.stringify(updated));
    setChatInput("");

    // Award loyalty points to logged-in users upon chat
    if (currentUser) {
      const updatedFans = leaderboardFans.map((fan) => {
        if (fan.username === currentUser.username) {
          const newPts = fan.points + 150; // Active chat bonus
          return { ...fan, points: newPts, activityCount: fan.activityCount + 1 };
        }
        return fan;
      });
      setLeaderboardFans(updatedFans);
      localStorage.setItem("kaito_leaderboard", JSON.stringify(updatedFans));
    }
  };

  const handleLikeMessage = (id: string) => {
    playClickSound();
    const updated = messages.map((m) => {
      if (m.id === id) {
        return { ...m, likes: m.likes + 1 };
      }
      return m;
    });
    setMessages(updated);
    localStorage.setItem("kaito_messages", JSON.stringify(updated));
  };

  // 6. Theme classes mappings
  const themeStyles = {
    cyberpunk: {
      accentColor: "text-cyan-400",
      accentBg: "bg-cyan-500",
      borderAccent: "border-cyan-500/20",
      accentGlow: "shadow-[0_0_15px_#06b6d4]",
      neonText: "neon-text-cyan",
      bodyBg: "bg-[#030712]", // deep cyber slate black
      cardBg: "bg-zinc-950/80 border-zinc-800",
      navBorder: "border-cyan-500/10",
      navBg: "bg-neutral-950/90",
      textTheme: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500"
    },
    shonen: {
      accentColor: "text-orange-500",
      accentBg: "bg-orange-500",
      borderAccent: "border-orange-500/30",
      accentGlow: "shadow-[0_0_15px_#f97316]",
      neonText: "neon-text-purple",
      bodyBg: "bg-[#0c0202]", // blood obsidian 
      cardBg: "bg-stone-950/80 border-stone-900",
      navBorder: "border-orange-500/10",
      navBg: "bg-stone-950/90",
      textTheme: "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-600 to-yellow-400"
    },
    minimal: {
      accentColor: "text-white",
      accentBg: "bg-white",
      borderAccent: "border-zinc-700/60",
      accentGlow: "shadow-[0_0_12px_rgba(255,255,255,0.4)]",
      neonText: "neon-text-cyan",
      bodyBg: "bg-black", // pitch pure matte
      cardBg: "bg-zinc-950 border-zinc-800",
      navBorder: "border-zinc-800/80",
      navBg: "bg-black/95",
      textTheme: "text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-white"
    }
  };

  const currStyle = themeStyles[activeTheme];

  return (
    <div className={`min-h-screen text-zinc-100 selection:bg-cyan-500 selection:text-black transition-colors duration-500 ${currStyle.bodyBg}`}>
      {/* Precision cursor layer */}
      <CustomCursor />

      {/* Background audio controller system */}
      <AudioPlayer />

      {/* 1. INTRO PRELOADER */}
      {showPreloader && (
        <div id="anime-preloader" className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 select-none">
          {/* Audio trigger context layout */}
          <div className="absolute top-6 left-6 text-zinc-600 font-mono text-[9px] flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" /> SYNCHRONIZING CHANNELS...
          </div>

          <div className="space-y-6 text-center max-w-md w-full relative z-10">
            {/* Pulsing Glitch logo */}
            <h1 className="text-4xl md:text-5xl font-black font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-pulse uppercase">
              THE_KAITO_EDITZ
            </h1>
            
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
              REVEALING PEAK FLOW STATE...
            </p>

            {/* Custom futuristic loading slider bar */}
            <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 shadow-[0_0_10px_#06b6d4] transition-all duration-300 rounded-full"
                style={{ width: `${preloaderProgress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
              <span>ESTABLISHING LOGIC: {preloaderProgress}%</span>
              <span>EST. 2026-05-29</span>
            </div>

            {/* Skip Option */}
            <button
              onClick={() => { playSwooshSound(); setShowPreloader(false); }}
              className="mt-8 px-4 py-1.5 rounded-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-cyan-400 transition-all text-[10px] font-mono uppercase tracking-widest cursor-pointer"
            >
              Skip Intro
            </button>
          </div>

          {/* Artistic vertical neon pillars in preloader */}
          <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"></div>
          <div className="absolute right-1/4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-pink-500/10 to-transparent"></div>
        </div>
      )}

      {/* 2. MAIN HEADER & NAVBAR */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${currStyle.navBorder} ${currStyle.navBg} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            {/* LOGO IMAGE HERE: Replace with your the_kaito_editz logo url */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center overflow-hidden">
                <span className="font-display font-black text-white text-base tracking-tighter">KT</span>
              </div>
            </div>
            
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#93c5fd] font-display uppercase block">
                THE_KAITO_EDITZ
              </span>
              <span className="text-xs font-mono text-zinc-400 tracking-tight">
                VFX portfolio engine
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider font-display uppercase">
            <a href="#gallery" onClick={playClickSound} className="text-zinc-300 hover:text-white transition-all">GALLERY</a>
            <a href="#comparison" onClick={playClickSound} className="text-zinc-300 hover:text-white transition-all">BEFORE/AFTER</a>
            <a href="#about" onClick={playClickSound} className="text-zinc-300 hover:text-white transition-all">STATS</a>
            <a href="#leaderboard" onClick={playClickSound} className="text-zinc-300 hover:text-white transition-all">FANS</a>
            <a href="#commissions" onClick={playClickSound} className="text-zinc-300 hover:text-white transition-all">COMMISSIONS</a>
            
            {/* Session Indicator for Admin Panel */}
            {currentUser && currentUser.role === "admin" && (
              <a href="#admin-room" onClick={playClickSound} className="text-pink-400 hover:text-pink-300 transition-all flex items-center gap-1 hover:underline">
                <Shield className="w-3 h-3 text-pink-500" /> CREATOR DEV
              </a>
            )}
          </nav>

          {/* Master actions panel */}
          <div className="flex items-center gap-3">
            {/* Audio Toggle utility */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-400 text-zinc-400 hover:text-white transition-all cursor-pointer"
              title={audioMuted ? "Unmute Sounds" : "Mute Sounds"}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-pink-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Auth Session Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex flex-col items-end text-right">
                  <span className="text-[10px] font-bold text-white font-mono">{currentUser.username}</span>
                  <span className="text-[8px] uppercase tracking-wider font-bold text-cyan-400 font-display">{currentUser.role}</span>
                </div>
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full border border-cyan-400"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/40 transition-all cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { playSlashSound(); setShowAuthModal(true); }}
                className="bg-black border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 text-xs font-semibold font-display tracking-wider uppercase px-4 py-2 rounded-xl hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> MOUNT FAN
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => { playClickSound(); setMobileMenuOpen(!mobileMenuOpen); }}
              className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide nav info */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-zinc-950 border-b border-zinc-900 px-4 py-4 space-y-3 text-xs uppercase font-semibold font-display tracking-widest text-center animate-[slideDown_0.2s_ease]">
            <a href="#gallery" onClick={() => { playClickSound(); setMobileMenuOpen(false); }} className="block py-2 text-zinc-400 hover:text-white">GALLERY</a>
            <a href="#comparison" onClick={() => { playClickSound(); setMobileMenuOpen(false); }} className="block py-2 text-zinc-400 hover:text-white">BEFORE/AFTER</a>
            <a href="#about" onClick={() => { playClickSound(); setMobileMenuOpen(false); }} className="block py-2 text-zinc-400 hover:text-white">STATS</a>
            <a href="#leaderboard" onClick={() => { playClickSound(); setMobileMenuOpen(false); }} className="block py-2 text-zinc-400 hover:text-white">FANS</a>
            <a href="#commissions" onClick={() => { playClickSound(); setMobileMenuOpen(false); }} className="block py-2 text-zinc-400 hover:text-white">COMMISSIONS</a>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION & BRANDING */}
      <section className="relative overflow-hidden pt-12 pb-20 select-none">
        
        {/* CHANNEL BANNER HERE: Replace with your the_kaito_editz banner image url */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full h-[240px] md:h-[320px] rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl group flex flex-col justify-end p-6 md:p-10">
            
            {/* Background image zoom-parallax fallback */}
            <img 
              src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1400" 
              alt="THE_KAITO_EDITZ channel banner artwork" 
              className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            
            {/* Gradient overlays to darken background image and make text readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/30 to-transparent"></div>

            {/* Content overlay */}
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-display">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> CERTIFIED ANIME EDITOR
              </span>

              {/* Glowing title text reveal */}
              <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-wider">
                <span className={currStyle.textTheme}>THE_KAITO_EDITZ</span>
              </h2>

              <p className="text-xs md:text-sm text-zinc-300 max-w-xl leading-relaxed">
                Re-syncing reality. Pushing the boundaries of hyper-exposure color correcting and dynamic camera keyframes for modern video streams.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="#gallery"
                  onClick={playSlashSound}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black font-display tracking-widest uppercase shadow-[0_0_15px_#06b6d4] transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-black" /> VIEW SHOWCASE
                </a>
                <a
                  href="#commissions"
                  onClick={playClickSound}
                  className="px-5 py-2.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-700/60 hover:border-pink-500 text-white text-xs font-bold font-display tracking-wider uppercase transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <PenTool className="w-3.5 h-3.5 text-pink-500" /> FILE COMMISSION
                </a>
              </div>
            </div>

            {/* Real-time viewer status overlay right side */}
            <div className="absolute top-4 right-4 bg-black/60 border border-zinc-800 text-[10px] text-zinc-400 font-mono px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping"></span>
              <span>Views: <strong className="text-cyan-400">{liveViewersCount}</strong></span>
            </div>
          </div>
        </div>

        {/* 3B. SYSTEM STATS & THEME SWITCHER */}
        <div id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Theme switcher panel */}
            <div className="lg:col-span-5 bg-neutral-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between h-full">
              <div className="mb-4">
                <span className="text-[9px] font-black tracking-widest text-[#93c5fd] font-display uppercase block mb-1">
                  TACTILE INTERFACE RENDER
                </span>
                <h3 className="text-base font-black text-white font-display uppercase tracking-tight">
                  Dynamic Core Theme
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select your client console visual overlay frame. Swapping alters visual styles and active text-glow attributes.
                </p>
              </div>

              {/* Theme selectors */}
              <div className="space-y-2.5">
                {[
                  { id: "cyberpunk", label: "Cyberpunk Neon Grid", desc: "Saturations of heavy black with cyan-pink details.", color: "border-cyan-500/20 hover:border-cyan-400" },
                  { id: "shonen", label: "Shonen Obsidian Gold", desc: "Deep crimson hues with fiery blazing fonts.", color: "border-red-500/20 hover:border-orange-500" },
                  { id: "minimal", label: "Minimalist Silver Black", desc: "Ultra-clean monochromatics with metallic guidelines.", color: "border-zinc-800 hover:border-white" }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => { playSlashSound(); setActiveTheme(th.id as any); }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      activeTheme === th.id 
                        ? "bg-zinc-800/60 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]" 
                        : "bg-black/30 border-zinc-900 hover:bg-zinc-950/40"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-white font-display uppercase tracking-wide">
                        {th.label}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{th.desc}</p>
                    </div>
                    {activeTheme === th.id && (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Growth & subscriber task stats module */}
            <div className="lg:col-span-7">
              <StatsTracker 
                isUnlocked={presetsUnlocked} 
                onUnlockPremium={() => {
                  setPresetsUnlocked(true);
                  // Award high amount of starting loyalty points to logged-in users who unlocked
                  if (currentUser) {
                    const updatedFans = leaderboardFans.map((fan) => {
                      if (fan.username === currentUser.username) {
                        return { ...fan, points: fan.points + 2000, activityCount: fan.activityCount + 1, unlockedPremium: true };
                      }
                      return fan;
                    });
                    setLeaderboardFans(updatedFans);
                    localStorage.setItem("kaito_leaderboard", JSON.stringify(updatedFans));
                  }
                }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN VIDEO PORTFOLIO GALLERY */}
      <section id="gallery" className="py-20 bg-black/35 border-t border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-10 pb-6 border-b border-zinc-900">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-display block mb-1">
                RENDER ARCHIVE
              </span>
              <h3 className="text-3xl font-black text-white font-display uppercase tracking-tight">
                Vibrant Video Showcase
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                Inspect compiled high-pace video edits. Sourced directly from THE_KAITO_EDITZ live production records.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 flex-wrap bg-zinc-900/60 p-1 rounded-xl border border-zinc-800 text-xs">
              {[
                { id: "all", label: "All Edits", icon: Tv },
                { id: "anime", label: "Anime MV", icon: Film },
                { id: "gaming", label: "Gaming Sync", icon: Gamepad2 },
                { id: "amv", label: "Peak AMV", icon: Flame }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { playClickSound(); setSelectedCategory(cat.id); }}
                  className={`px-4 py-2 rounded-lg font-bold font-display uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedCategory === cat.id 
                      ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" /> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos
              .filter((v) => selectedCategory === "all" || v.category === selectedCategory)
              .map((vid) => (
                <div 
                  key={vid.id}
                  className="bg-neutral-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Thumbnail / Hover Player trigger */}
                  <div className="relative aspect-video bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => { playSlashSound(); setActivePlayId(vid.youtubeId); }}>
                    <img 
                      src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`} 
                      alt={vid.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {/* Glowing color wash overlay */}
                    <div className="absolute inset-0 bg-[#ec4899]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Duration / uploaded status tags */}
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 border border-zinc-800 px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                      {vid.duration || "2:30"}
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[8px] font-black uppercase text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded tracking-widest">
                        {vid.category}
                      </span>
                    </div>

                    {/* Centered play hover indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                      <div className="w-12 h-12 rounded-full border border-cyan-400 bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_#06b6d4]">
                        <Play className="w-5 h-5 fill-cyan-400 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Stats */}
                  <div className="p-4 space-y-3">
                    <h4 className="text-sm font-bold text-zinc-150 line-clamp-2 leading-relaxed">
                      {vid.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-2 border-t border-zinc-900 pt-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" /> {vid.views} Views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {vid.uploadedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {videos.filter((v) => selectedCategory === "all" || v.category === selectedCategory).length === 0 && (
            <div className="text-center py-16 text-zinc-600 font-mono text-xs border border-dashed border-zinc-800 rounded-2xl">
              No videos matching selection in current session. Open the Admin Room to inject more clips!
            </div>
          )}
        </div>
      </section>

      {/* 5. INSTAGRAM REELS & SHORTS GRID */}
      <section id="shorts" className="py-20 border-t border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 text-center md:text-left">
            <span className="text-[10px] font-bold text-pink-500 tracking-widest uppercase font-display block mb-1">
              VERTICAL SYNC
            </span>
            <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
              Shorts & IG Reels Feed
            </h3>
            <p className="text-xs text-zinc-400">
              High-exposure vertical speed-ramped edits. Hover for quick view specifications or launch embedding.
            </p>
          </div>

          {/* Grid Layout (Vertical Aspect 9:16) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {shorts.map((sh) => (
              <div
                key={sh.id}
                className="bg-neutral-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-pink-500/40 hover:shadow-[0_0_15px_rgba(236,72,153,0.08)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                onClick={() => { playSlashSound(); setActivePlayId(sh.youtubeId); }}
              >
                {/* 9:16 Aspect Thumbnail Container */}
                <div className="relative aspect-[9/16] bg-zinc-950 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${sh.youtubeId}/hqdefault.jpg`}
                    alt={sh.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Cyan glass wash */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/20 to-transparent"></div>

                  {/* Vert tag indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 border border-zinc-800 rounded px-2 py-0.5 text-[9px] font-mono">
                    <Instagram className="w-3 h-3 text-pink-400" />
                    <span>{sh.type}</span>
                  </div>

                  {/* Quick stats on vertical layer */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <span className="text-[10px] text-zinc-400 font-bold block truncate">
                      {sh.title}
                    </span>
                    <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                      <span>{sh.views} views</span>
                      <span className="text-pink-400">♥ {sh.likes}</span>
                    </div>
                  </div>

                  {/* Centered click actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-11 h-11 rounded-full border border-pink-400 bg-pink-500/10 flex items-center justify-center text-pink-400 shadow-[0_0_15px_#ec4899]">
                      <Play className="w-4 h-4 fill-pink-400 ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BEFORE VS AFTER COMPLETED EFFECT DRAGGER */}
      <section id="comparison" className="py-20 bg-black/35 border-t border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* 7. LIVE COMMUNITY FAN CHAT WALL */}
      <section id="leaderboard" className="py-20 border-t border-zinc-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Top Fans Leaderboard */}
            <div className="lg:col-span-5">
              <Leaderboard 
                fans={leaderboardFans} 
                currentUser={currentUser} 
                onShowAuth={() => { playClickSound(); setShowAuthModal(true); }} 
              />
            </div>

            {/* Right Column: Live Community message board wall */}
            <div className="lg:col-span-7 bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between h-[510px]">
              
              <div className="border-b border-zinc-800 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-display block mb-0.5">
                    SECURE LIVE WALL
                  </span>
                  <h4 className="text-lg font-black text-white font-display uppercase tracking-tight flex items-center gap-1.5">
                    Community Fan Chats <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping"></span>
                  </h4>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">Stream Logged</span>
              </div>

              {/* Chat Message Lists Wrapper */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
                {messages.map((m) => {
                  const isMine = currentUser && m.username === currentUser.username;
                  return (
                    <div 
                      key={m.id} 
                      className={`p-3 rounded-2xl border transition-all duration-300 transform animate-[slideIn_0.22s_ease-out] space-y-1.5 ${
                        isMine
                          ? "bg-gradient-to-r from-cyan-950/40 to-neutral-950 border-cyan-500/20 shadow-md ml-6"
                          : "bg-black/35 border-zinc-900 hover:border-zinc-800 mr-6"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={m.avatarUrl} 
                            alt={m.username} 
                            className="w-7 h-7 rounded-full border border-zinc-800 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-xs font-bold text-white font-mono block">
                              {m.username}
                            </span>
                            <span className="text-[8px] text-zinc-500 flex items-center gap-1">
                              {new Date(m.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {/* Message Like button */}
                        <button
                          onClick={() => handleLikeMessage(m.id)}
                          className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-850 px-2 py-1 rounded text-[9px] font-mono text-zinc-400 hover:text-pink-400 transition-all cursor-pointer"
                        >
                          💖 {m.likes}
                        </button>
                      </div>

                      <p className="text-xs font-sans text-zinc-200">
                        {m.content}
                      </p>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form box */}
              <form onSubmit={handleSendChatMessage} className="border-t border-zinc-800 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={currentUser ? "Type premium comments..." : "Sign in above to drop chats..."}
                    maxLength={150}
                    className="flex-1 bg-black/60 border border-zinc-800 hover:border-zinc-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-zinc-150 outline-none transition-all font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.25)] shrink-0"
                    title="Send chat message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {!currentUser && (
                  <p className="text-[9px] text-center text-zinc-500 mt-2">
                    * Guest posts as <code className="text-pink-400">Guest_Beast</code>. Authenticate to mount custom identity.
                  </p>
                )}
              </form>

            </div>
          </div>
        </div>
      </section>

      {/* 8. COMMISSION FORM BOOKING STEPPER */}
      <section id="commissions" className="py-20 bg-black/35 border-t border-zinc-900/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <CommissionForm onSuccess={handleCreateCommission} />
        </div>
      </section>

      {/* 9. SECURE ADMIN DEV ROOM WRAPPER */}
      <section id="admin-room" className="py-20 border-t border-zinc-900/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminPanel
            currentUser={currentUser}
            videos={videos}
            commissions={commissions}
            onAddVideo={handleAddVideo}
            onDeleteVideo={handleDeleteVideo}
            onUpdateCommissionStatus={handleUpdateCommissionStatus}
          />
        </div>
      </section>

      {/* 10. REAL YOUTUBE PLAYER EMBED PORTAL MODAL */}
      {activePlayId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backer blur dismiss tool */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => { playClickSound(); setActivePlayId(null); }}
          ></div>

          {/* Player container */}
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden aspect-video border-2 border-cyan-400/50 relative z-10 bg-black shadow-[0_0_50px_rgba(6,182,212,0.3)] transform animate-[zoomIn_0.2s_ease]">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${activePlayId}?autoplay=1`}
              title="YouTube portfolio player node"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>

            <button
              onClick={() => { playClickSound(); setActivePlayId(null); }}
              className="absolute -top-1.5 -right-1.5 md:top-3 md:right-3 bg-red-600 hover:bg-red-500 text-white border border-red-500/30 w-8 h-8 rounded-full flex items-center justify-center font-bold font-sans text-xs shadow hover:scale-105 transition-transform cursor-pointer z-20"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 11. FOOTER SECTION */}
      <footer className="bg-neutral-950 border-t border-zinc-900 py-12 select-none text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h4 className="font-display font-black text-white text-base tracking-widest uppercase">
              THE_KAITO_EDITZ
            </h4>
            <p className="max-w-sm">
              Ultra-premium video editing design, custom shakes, color correct loops, and lofier soundtracks.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <span>© 2026 THE_KAITO_EDITZ. All Rights Reserved.</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              Powered by <Heart className="w-3 h-3 text-pink-500 animate-pulse fill-pink-500" /> React Engine & Antigravity
            </span>
          </div>
        </div>
      </footer>

      {/* 12. GLASS AUTHENTICATION DIALOG POPUP */}
      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
    </div>
  );
}
