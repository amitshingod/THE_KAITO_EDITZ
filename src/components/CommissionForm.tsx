/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, FileText, Settings, ShieldCheck, Mail, Calendar, DollarSign, PenTool, CheckCircle } from "lucide-react";
import { playClickSound, playSlashSound } from "../audioUtils";
import { CommissionRequest } from "../types";

interface CommissionFormProps {
  onSuccess: (request: CommissionRequest) => void;
}

export default function CommissionForm({ onSuccess }: CommissionFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [projectType, setProjectType] = useState<"anime_mv" | "gaming_montage" | "short_reel" | "custom_3d">("anime_mv");
  const [budget, setBudget] = useState("$100 - $200");
  const [timeline, setTimeline] = useState("1 - 2 Weeks");
  const [details, setDetails] = useState("");
  const [references, setReferences] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const prevStep = () => {
    playClickSound();
    setStep((prev) => Math.max(1, prev - 1));
  };

  const nextStep = () => {
    playClickSound();
    // Simple verification
    if (step === 1 && (!name || !email)) {
      alert("Please provide your Name and Contact Email.");
      return;
    }
    setStep((prev) => Math.min(3, prev + 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSlashSound();
    setIsSubmitting(true);

    // Simulate database post delay
    setTimeout(() => {
      const newRequest: CommissionRequest = {
        id: "comm-" + Date.now(),
        clientName: name,
        clientEmail: email,
        discordId: discord,
        projectType,
        budget,
        timeline,
        references,
        details,
        status: "pending",
        createdAt: new Date().toISOString()
      };

      onSuccess(newRequest);
      setIsSubmitting(false);
      setIsSuccess(true);
      setStep(4); // Success view
    }, 1500);
  };

  const resetForm = () => {
    playClickSound();
    setName("");
    setEmail("");
    setDiscord("");
    setProjectType("anime_mv");
    setBudget("$100 - $200");
    setTimeline("1 - 2 Weeks");
    setDetails("");
    setReferences("");
    setIsSuccess(false);
    setStep(1);
  };

  return (
    <div className="bg-neutral-900/60 border border-zinc-805 border-zinc-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
      <div className="mb-6">
        <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-display block mb-1">
          RETAIN THE BEST EDITOR
        </span>
        <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">
          Book Custom Commissions
        </h3>
        <p className="text-xs text-zinc-400">
          Work directly with THE_KAITO_EDITZ to elevate your YouTube, Instagram, or TikTok content.
        </p>
      </div>

      {/* Progress Multi-step Tracker */}
      <div className="flex items-center justify-between mb-8 relative max-w-md mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-800 z-0 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-cyan-500 to-pink-500 z-0 -translate-y-1/2 transition-all duration-300"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>

        {[
          { label: "Contact", icon: Mail },
          { label: "Spec", icon: Settings },
          { label: "Brief", icon: FileText },
          { label: "Done", icon: ShieldCheck }
        ].map((item, idx) => {
          const IconComponent = item.icon;
          const isActive = idx + 1 <= step;
          const isCurrent = idx + 1 === step;
          return (
            <div key={idx} className="flex flex-col items-center z-10">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent 
                    ? "bg-cyan-500 text-black border-4 border-cyan-950 shadow-[0_0_15px_#06b6d4]" 
                    : isActive 
                      ? "bg-pink-500 text-white" 
                      : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold mt-1.5 ${isActive ? "text-zinc-300" : "text-zinc-600"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                  Your Full Name *
                </label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kaelen Mercer"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                  Contact Email *
                </label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kaelen@example.com"
                  className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1 font-display">
                Discord ID (Optional for faster edits chat)
              </label>
              <input 
                type="text"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                placeholder="kaito_fan#1234"
                className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full bg-black/80 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all appearance-none"
                >
                  <option value="anime_mv">Anime Music Video (AMV)</option>
                  <option value="gaming_montage">Gaming Montage / Sick Sync</option>
                  <option value="short_reel">Instagram Reel / YouTube Short</option>
                  <option value="custom_3d">Custom 3D / VFX Sequence</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                  Ideal Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-black/80 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all"
                >
                  <option value="$50 - $100">$50 - $100 (Simpler Cut)</option>
                  <option value="$100 - $200">$100 - $200 (Intermediate FX)</option>
                  <option value="$200 - $500">$200 - $500 (VFX, 3D Tracking)</option>
                  <option value="$500+">$500+ (Extreme Heavy CC AMV Project)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                Deadline/Timeline
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-black/80 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all"
              >
                <option value="Hyper-Express">Hyper-Express (24-48 Hours)</option>
                <option value="1 Week">1 Week (Standard Express)</option>
                <option value="1 - 2 Weeks">1 - 2 Weeks (Recommended for AMV)</option>
                <option value="Flexible">Flexible (No Rush)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                Project Details / Song Request *
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="List your requested Anime or Games, and any specific tracks you'd like matched to the edits flow (e.g., Suicideboys Phonk)..."
                className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5 font-display">
                Reference Video Link (e.g. YouTube clip style you like)
              </label>
              <input
                type="text"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                placeholder="https://youtu.be/..."
                className="w-full bg-black/60 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {step === 4 && isSuccess && (
          <div className="text-center py-6 space-y-4 animate-[zoomIn_0.3s_ease]">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-display uppercase tracking-tight">Commission Logged Successfully</h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                Your specifications have been routed to the ADMIN ledger. Authenticate as <code className="text-pink-400 font-mono">the_kaito_editz</code> to review and approve!
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="bg-zinc-800 hover:bg-zinc-750 border border-zinc-750 hover:border-cyan-400 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer inline-flex items-center gap-2"
            >
              Submit Another Commission
            </button>
          </div>
        )}

        {/* Action Controls */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-805 border-zinc-900">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Back Step
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl text-xs font-semibold font-display shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-7 py-2.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all flex items-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    TRANSMITTING...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 animate-pulse" /> TRANSMIT COMMISSION
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
