/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoItem {
  id: string; // unique identifier
  title: string;
  category: "anime" | "gaming" | "shorts" | "amv" | "other";
  youtubeId: string; // The 11-char ID
  duration?: string;
  views?: string;
  uploadedAt: string;
}

export interface FanUser {
  id: string;
  username: string;
  avatarUrl: string;
  role: "fan" | "core_fan" | "admin" | "vip_editor";
  joinedAt: string;
  points: number;
  activityCount: number;
  unlockedPremium: boolean;
}

export interface FanMessage {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  role: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CommissionRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  discordId?: string;
  projectType: "anime_mv" | "gaming_montage" | "short_reel" | "custom_3d";
  budget: string;
  timeline: string;
  references: string;
  details: string;
  status: "pending" | "reviewing" | "accepted" | "completed";
  createdAt: string;
}

export type ThemeType = "cyberpunk" | "shonen" | "minimal";
