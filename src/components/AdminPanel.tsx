/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Youtube, ShieldAlert, Plus, Table, UserCheck, ShieldCheck, Video, ClipboardList, Trash2 } from "lucide-react";
import { playClickSound, playSlashSound } from "../audioUtils";
import { VideoItem, CommissionRequest, FanUser } from "../types";

interface AdminPanelProps {
  currentUser: FanUser | null;
  onAddVideo: (video: Omit<VideoItem, "id" | "views" | "uploadedAt">) => void;
  onDeleteVideo: (id: string) => void;
  videos: VideoItem[];
  commissions: CommissionRequest[];
  onUpdateCommissionStatus: (id: string, status: CommissionRequest["status"]) => void;
}

export default function AdminPanel({
  currentUser,
  onAddVideo,
  onDeleteVideo,
  videos,
  commissions,
  onUpdateCommissionStatus
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"video" | "commissions">("video");
  
  // States for adding a new video
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState<"anime" | "gaming" | "shorts" | "amv" | "other">("anime");
  const [youtubeId, setYoutubeId] = useState("");
  const [notification, setNotification] = useState("");

  const isAdmin = currentUser && currentUser.role === "admin" && currentUser.username === "the_kaito_editz";

  if (!isAdmin) {
    return (
      <div className="bg-zinc-950 border border-red-500/30 rounded-3xl p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <ShieldAlert className="w-8 h-8 animate-ping" />
        </div>
        <div className="space-y-1">
          <h4 className="text-lg font-black text-white font-display uppercase tracking-tight">Access Gate: Localized Lock out</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            This module contains root admin parameters. Authenticate in the header using the Username <code className="text-pink-400 font-mono">the_kaito_editz</code> and Password <code className="text-pink-400 font-mono">POKEMON123</code> to mount admin privileges.
          </p>
        </div>
      </div>
    );
  }

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSlashSound();

    if (!videoTitle || !youtubeId) {
      alert("Please specify video title and correct youtube 11-char ID.");
      return;
    }

    onAddVideo({
      title: videoTitle,
      category: videoCategory,
      youtubeId: youtubeId.trim()
    });

    setVideoTitle("");
    setYoutubeId("");
    setNotification("Video successfully deployed to live showcase list!");
    setTimeout(() => setNotification(""), 4000);
  };

  return (
    <div className="bg-neutral-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 relative overflow-hidden">
      {/* Top Header details */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-6 mb-6">
        <div className="space-y-1">
          <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-0.5 rounded uppercase font-display tracking-widest inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> SECURE ROOT SESSION
          </span>
          <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
            Creator Control Room
          </h3>
          <p className="text-xs text-zinc-400">
            Welcome back, <strong className="text-cyan-400 font-mono">the_kaito_editz</strong>. Push videos or manage ongoing customer briefs.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex items-center gap-2 bg-black/60 border border-zinc-800 rounded-xl p-1 text-xs shrink-0 self-start md:self-center">
          <button
            onClick={() => { playClickSound(); setActiveTab("video"); }}
            className={`px-4 py-2 rounded-lg font-bold font-display uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "video" ? "bg-cyan-500 text-black font-black" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Push Video
          </button>
          <button
            onClick={() => { playClickSound(); setActiveTab("commissions"); }}
            className={`px-4 py-2 rounded-lg font-bold font-display uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "commissions" ? "bg-cyan-500 text-black font-black" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" /> Commission Ledgers ({commissions.length})
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-xs text-emerald-400 font-mono mb-6 animate-bounce">
          ✓ {notification}
        </div>
      )}

      {/* Panel Active Contents */}
      {activeTab === "video" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form to Push video */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-black uppercase text-zinc-300 font-display tracking-wider border-b border-zinc-800/80 pb-2">
              Add New Video Frame
            </h4>

            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                  Video Title
                </label>
                <input
                  type="text"
                  required
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="e.g., BLACK CLOVER - Asta Demon Unleashed CC"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-xs text-zinc-100 outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                    Category Tag
                  </label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value as any)}
                    className="w-full bg-black/80 border border-zinc-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none transition-all"
                  >
                    <option value="anime">Anime (Standard)</option>
                    <option value="gaming">Gaming</option>
                    <option value="amv">Anime Music Video (AMV)</option>
                    <option value="shorts">Vertical Short</option>
                    <option value="other">Other Clip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                    YouTube Video ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={youtubeId}
                    onChange={(e) => setYoutubeId(e.target.value)}
                    placeholder="e.g. 8hgS9CO_V88"
                    className="w-full bg-black/80 border border-zinc-800 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-zinc-100 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 bg-black/40 p-3 rounded-lg border border-zinc-900 leading-relaxed">
                <strong>Formatting Note:</strong> The Video ID is the 11 character segment at the end of the YouTube URL (e.g. `youtube.com/watch?v=<strong>8hgS9CO_V88</strong>`).
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl py-2.5 text-xs uppercase tracking-wider font-display font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              >
                <Plus className="w-4 h-4" /> INJECT STREAM OVERLAY
              </button>
            </form>
          </div>

          {/* List of current videos index */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <h4 className="text-xs font-black uppercase text-zinc-300 font-display tracking-wider">
                Listed Video Elements ({videos.length})
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono">Live Session Index</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {videos.map((vid) => (
                <div key={vid.id} className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-zinc-900 text-xs">
                  <div className="flex items-center gap-3 truncate pr-4">
                    <div className="relative w-12 h-9 rounded bg-zinc-800 flex-shrink-0 overflow-hidden border border-zinc-700">
                      <img
                        src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="truncate">
                      <h5 className="font-bold text-zinc-200 truncate">{vid.title}</h5>
                      <span className="text-[9px] font-mono text-pink-400 uppercase tracking-widest bg-pink-500/5 px-1.5 py-0.5 rounded border border-pink-500/15 inline-block mt-0.5">
                        {vid.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playClickSound();
                      if (confirm(`Remove this video record: ${vid.title}?`)) {
                        onDeleteVideo(vid.id);
                      }
                    }}
                    className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer shrink-0"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Tab contents: Commissions log */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h4 className="text-xs font-black uppercase text-zinc-300 font-display tracking-wider">
              Submitted Commission Briefs ({commissions.length})
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">Secure client exports</span>
          </div>

          <div className="space-y-4 max-h-[365px] overflow-y-auto pr-1">
            {commissions.length === 0 ? (
              <div className="text-center py-12 text-zinc-600 text-xs font-mono">
                No customer commissions currently submitted.
              </div>
            ) : (
              commissions.map((comm) => (
                <div key={comm.id} className="p-4 rounded-2xl bg-black/40 border border-zinc-800/80 space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h5 className="text-sm font-black text-white font-mono flex items-center gap-1.5">
                        {comm.clientName}
                        <span className="text-[9px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                          {comm.projectType.toUpperCase()}
                        </span>
                      </h5>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Contact: <strong className="text-cyan-400">{comm.clientEmail}</strong> 
                        {comm.discordId && <> | Discord: <strong className="text-pink-400">{comm.discordId}</strong></>}
                      </span>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider font-display px-2.5 py-1 rounded ${
                        comm.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : comm.status === "accepted"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {comm.status}
                      </span>
                      
                      <select
                        value={comm.status}
                        onChange={(e) => {
                          playClickSound();
                          onUpdateCommissionStatus(comm.id, e.target.value as any);
                        }}
                        className="bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 rounded px-2 py-1 outline-none appearance-none cursor-pointer"
                      >
                        <option value="pending">Set Pending</option>
                        <option value="reviewing">Set Reviewing</option>
                        <option value="accepted">Set Accepted</option>
                        <option value="completed">Set Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 text-xs text-zinc-300 space-y-1">
                    <p className="font-semibold text-zinc-400">Brief Spec Details:</p>
                    <p className="font-mono">{comm.details}</p>
                    {comm.references && (
                      <p className="text-[10px] text-zinc-500 mt-1 truncate">
                        Refs: <a href={comm.references} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">{comm.references}</a>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Budget Spec: <strong className="text-pink-400">{comm.budget}</strong></span>
                    <span>Timeline: <strong className="text-cyan-400">{comm.timeline}</strong></span>
                    <span>Submitted: {new Date(comm.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
