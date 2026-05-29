/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Trophy, Award, Search, LogIn, Mail, Smartphone, Eye, EyeOff, ShieldAlert, BadgeCheck, Flame } from "lucide-react";
import { playClickSound, playSlashSound } from "../audioUtils";
import { FanUser } from "../types";

interface LeaderboardProps {
  fans: FanUser[];
  onShowAuth: () => void;
  currentUser: FanUser | null;
}

export function Leaderboard({ fans, onShowAuth, currentUser }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFans = fans.filter((f) =>
    f.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-neutral-900/60 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Absolute glow design layer */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-bold text-pink-500 tracking-widest uppercase font-display flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-400 animate-pulse" /> HONOR ROLL
          </span>
          <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
            Top Fans Leaderboard
          </h3>
          <p className="text-xs text-zinc-400">
            Rankings updated live based on community chats, sub click missions, and video shares.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter fans..."
            className="bg-black/60 border border-zinc-800 focus:border-cyan-400 text-xs rounded-xl pl-8 pr-4 py-2 text-zinc-100 outline-none w-40 transition-all font-mono"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Fan register reminder */}
      {!currentUser && (
        <div className="mb-4 bg-gradient-to-r from-cyan-950/40 via-neutral-950 to-pink-950/30 border border-cyan-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <h5 className="text-xs font-bold font-display text-white uppercase tracking-wide">
              Sign Up to secure rank #1
            </h5>
            <p className="text-[10px] text-zinc-400 max-w-sm">
              Register now with Google, Instagram, or Email. You get 500 starting loyalty points instantly!
            </p>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onShowAuth();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[11px] font-black font-display tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" /> MOUNT IDENTITY
          </button>
        </div>
      )}

      {/* Leaderboard user list */}
      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredFans.sort((a,b) => b.points - a.points).map((fan, index) => {
          const isMe = currentUser && currentUser.username === fan.username;
          const rank = index + 1;

          return (
            <div
              key={fan.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-350 ${
                isMe
                  ? "bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]"
                  : "bg-black/30 border-zinc-900/60 hover:bg-zinc-950/60 hover:border-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Position Rank Display */}
                <span className="w-6 text-center">
                  {rank === 1 ? (
                    <Award className="w-5 h-5 text-yellow-400 mx-auto drop-shadow-[0_0_4px_rgba(234,179,8,0.5)]" />
                  ) : rank === 2 ? (
                    <Award className="w-5 h-5 text-zinc-300 mx-auto" />
                  ) : rank === 3 ? (
                    <Award className="w-5 h-5 text-amber-600 mx-auto" />
                  ) : (
                    <span className="text-xs font-mono font-bold text-zinc-500">{rank}</span>
                  )}
                </span>

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={fan.avatarUrl}
                    alt={fan.username}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                  {/* Status Indicator */}
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-black ${
                    fan.role === "admin" 
                      ? "bg-red-500" 
                      : fan.role === "vip_editor"
                        ? "bg-pink-500"
                        : "bg-cyan-500"
                  }`}></span>
                </div>

                <div>
                  <h4 className="text-xs font-black text-white font-mono flex items-center gap-1 mb-0.5">
                    {fan.username}
                    {fan.role === "admin" && (
                      <span className="bg-red-900/50 text-red-400 text-[8px] px-1 rounded border border-red-500/20 scale-90">CREATOR</span>
                    )}
                    {fan.role === "vip_editor" && (
                      <span className="bg-pink-900/50 text-pink-400 text-[8px] px-1 rounded border border-pink-500/20 scale-90">VIP</span>
                    )}
                    {fan.unlockedPremium && (
                      <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 fill-black shrink-0" />
                    )}
                  </h4>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                    <span>Joined {new Date(fan.joinedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{fan.activityCount} Activities</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-cyan-400 font-mono tracking-tight flex items-center gap-1 justify-end">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> {fan.points.toLocaleString()}
                </span>
                <span className="text-[9px] text-zinc-500 block uppercase font-bold tracking-wider font-display">
                  LOYALTY PT
                </span>
              </div>
            </div>
          );
        })}

        {filteredFans.length === 0 && (
          <div className="text-center py-8 text-zinc-600 text-xs font-mono">
            No matching registered fans found
          </div>
        )}
      </div>
    </div>
  );
}

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: FanUser) => void;
}

export function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [method, setMethod] = useState<"social" | "email" | "otp">("social");
  const [username, setUsername] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSocialSelect = (platform: string) => {
    playSlashSound();
    setIsSubmitting(true);
    setErrorMsg("");

    // Simulate login sequence
    setTimeout(() => {
      // Pick dynamic usernames based on selected third party
      const subFix = Math.floor(Math.random() * 900) + 100;
      const finalUsername = `${platform}_KaitoEditFan_${subFix}`;
      const mockUser: FanUser = {
        id: "user-" + Date.now(),
        username: finalUsername,
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
        role: "fan",
        joinedAt: new Date().toISOString(),
        points: 500, // starting gift
        activityCount: 2,
        unlockedPremium: false
      };

      onLoginSuccess(mockUser);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSlashSound();
    setErrorMsg("");

    if (!username || !emailInput) {
      setErrorMsg("Please fill in all standard identity files.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Check simple custom admin credentials bypass checks
      if (username === "the_kaito_editz") {
        if (password === "POKEMON123") {
          const adminUser: FanUser = {
            id: "admin-kaito",
            username: "the_kaito_editz",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
            role: "admin",
            joinedAt: "2026-01-01",
            points: 99999,
            activityCount: 1520,
            unlockedPremium: true
          };
          onLoginSuccess(adminUser);
          setIsSubmitting(false);
          return;
        } else {
          setErrorMsg("Unauthorized credentials. Check password matching!");
          setIsSubmitting(false);
          return;
        }
      }

      // Standard user registration
      const mockUser: FanUser = {
        id: "user-" + Date.now(),
        username: username.replace(/\s+/g, "_"),
        avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=120",
        role: "core_fan",
        joinedAt: new Date().toISOString(),
        points: 500,
        activityCount: 1,
        unlockedPremium: false
      };
      onLoginSuccess(mockUser);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark blur backdrop */}
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => { playClickSound(); onClose(); }}
      ></div>

      {/* Main glass card portal */}
      <div className="bg-zinc-950/85 border border-cyan-500/30 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative z-10 overflow-hidden transform animate-[zoomIn_0.25s_ease-out]">
        {/* Animated grid neon background overlay inside box */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-bold text-pink-500 tracking-widest uppercase font-display select-none">
            CENTRAL GATEWAY CONTROL
          </span>
          <button 
            onClick={() => { playClickSound(); onClose(); }}
            className="text-zinc-500 hover:text-white transition-all text-sm font-black border border-zinc-900 bg-zinc-900/60 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:border-cyan-500/40"
          >
            ✕
          </button>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
            Mount Your Fan Profile
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Access restricted AMV assets, submit editing requests, and track your rank.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 bg-black/60 border border-zinc-900 rounded-xl p-1 mb-6 text-xs">
          <button
            onClick={() => { playClickSound(); setMethod("social"); }}
            className={`py-2 rounded-lg font-bold text-[11px] font-display uppercase tracking-wider transition-all cursor-pointer ${
              method === "social" ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.25)]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            OAuth Social
          </button>
          <button
            onClick={() => { playClickSound(); setMethod("email"); }}
            className={`py-2 rounded-lg font-bold text-[11px] font-display uppercase tracking-wider transition-all cursor-pointer ${
              method === "email" ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.25)]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Email ID
          </button>
          <button
            onClick={() => { playClickSound(); setMethod("otp"); }}
            className={`py-2 rounded-lg font-bold text-[11px] font-display uppercase tracking-wider transition-all cursor-pointer ${
              method === "otp" ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.25)]" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Mobile/OTP
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-[11px] text-red-400 flex items-center gap-2 mb-4 font-mono animate-bounce">
            <ShieldAlert className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {isSubmitting ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin mx-auto"></div>
            <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase animate-pulse">
              Authenticating Credentials...
            </p>
          </div>
        ) : (
          <>
            {/* Method A: Social Login channels */}
            {method === "social" && (
              <div className="space-y-3">
                <button
                  onClick={() => handleSocialSelect("Google")}
                  className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-red-500" /> Continue with Google / YouTube
                </button>
                <button
                  onClick={() => handleSocialSelect("Instagram")}
                  className="w-full bg-pink-600/10 hover:bg-pink-600/20 border border-pink-500/30 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-pink-500" /> Connect Instagram Client
                </button>
                <button
                  onClick={() => handleSocialSelect("Facebook")}
                  className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-blue-500" /> Sync Facebook Profile
                </button>
              </div>
            )}

            {/* Method B: Email Register & Admin login access */}
            {method === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                    Username / Member Handle
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Zenitsu_Edits_99"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none transition-all font-mono"
                  />
                  <span className="text-[9px] text-zinc-500 mt-1 block">
                    Use <code className="text-pink-400">the_kaito_editz</code> to trigger secure admin tools bypass.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none transition-all font-mono"
                  />
                </div>

                {/* Secure Password (Required only check for admin user) */}
                {username === "the_kaito_editz" && (
                  <div className="animate-[slideDown_0.25s_ease]">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] uppercase font-bold text-pink-400 font-display">
                        Admin Security PIN / Password *
                      </label>
                      <span className="text-[9px] text-pink-500 font-bold uppercase tracking-wider font-mono">Bypass Required</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/60 border border-pink-500/50 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none transition-all font-mono placeholder-zinc-700 font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-semibold rounded-xl py-3 text-xs uppercase tracking-wider font-display font-black transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                >
                  MOUNT ACCESS POINT
                </button>
              </form>
            )}

            {/* Method C: Mobile & OTP */}
            {method === "otp" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                playSlashSound();
                if (!phone) {
                  setErrorMsg("Please enter standard mobile digits.");
                  return;
                }
                setIsSubmitting(true);
                setTimeout(() => {
                  const subFix = Math.floor(Math.random() * 90) + 10;
                  const mockUser: FanUser = {
                    id: "user-" + Date.now(),
                    username: `PhoneFan_${subFix}`,
                    avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=120",
                    role: "fan",
                    joinedAt: new Date().toISOString(),
                    points: 500,
                    activityCount: 1,
                    unlockedPremium: false
                  };
                  onLoginSuccess(mockUser);
                  setIsSubmitting(false);
                }, 1200);
              }} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                    Mobile Digit String
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999-99999"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-zinc-100 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] uppercase font-bold text-zinc-400 font-display">
                      Enter OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => { playClickSound(); alert("OTP Resent successfully."); }}
                      className="text-[9px] text-cyan-400 font-bold hover:underline"
                    >
                      REQUEST AGAIN
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="948371"
                    className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-center text-sm font-mono tracking-[1em]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl py-3 text-xs uppercase tracking-wider font-display font-black transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                >
                  VERIFY & PROCEED
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
