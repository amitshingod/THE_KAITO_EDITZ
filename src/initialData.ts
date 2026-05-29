/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoItem, FanUser, FanMessage } from "./types";

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "JUJUTSU KAISEN - Shibuya Incident [THE_KAITO_EDITZ Remix]",
    category: "anime",
    youtubeId: "8hgS9CO_V88", // Real high-quality JJK high-pace AMV edit or teaser ID
    duration: "2:45",
    views: "45.2K",
    uploadedAt: "2026-04-12"
  },
  {
    id: "v2",
    title: "VALORANT - VCT Champions Flow-State Edit",
    category: "gaming",
    youtubeId: "v-wWms8z0sE", // Valorant cinematic edit ID
    duration: "3:12",
    views: "21.6K",
    uploadedAt: "2026-05-01"
  },
  {
    id: "v3",
    title: "DEMON SLAYER - Hashira Training Glow Arc (4K 60FPS)",
    category: "amv",
    youtubeId: "8627S7-rR2c", // Demon Slayer dynamic AMV or trailer
    duration: "2:20",
    views: "58.9K",
    uploadedAt: "2026-05-18"
  },
  {
    id: "v4",
    title: "CYBERPUNK EDGERUNNERS - Let You Down [Phonk Sync]",
    category: "anime",
    youtubeId: "Xj2b00v9G-U", // Cyberpunk dynamic AMV
    duration: "3:02",
    views: "34.1K",
    uploadedAt: "2026-05-22"
  },
  {
    id: "v5",
    title: "ELDEN RING - Shadow of the Erdtree Boss Rush Speed Edit",
    category: "gaming",
    youtubeId: "Qp4x_C_jDnk", // Elden Ring epic edit
    duration: "4:05",
    views: "12.8K",
    uploadedAt: "2026-05-25"
  },
  {
    id: "v6",
    title: "ATTACK ON TITAN - Rumbling Heavy Metal Symphony Edit",
    category: "amv",
    youtubeId: "rcLofmJ6E4E", // AOT action AMV
    duration: "3:30",
    views: "29.4K",
    uploadedAt: "2026-05-27"
  }
];

export const INITIAL_SHORTS = [
  {
    id: "s1",
    title: "Solo Leveling Sung Jin-woo Shadow Reveal Sync",
    type: "Shorts",
    youtubeId: "9gXmshsP1oI", // Real anime edits short ID
    views: "102K",
    likes: "8.4K"
  },
  {
    id: "s2",
    title: "Sukuna Domain Expansion Malevolent Shrine Glow Effect",
    type: "Shorts",
    youtubeId: "J88A7HkZ8hY",
    views: "89K",
    likes: "7.1K"
  },
  {
    id: "s3",
    title: "Modern Warfare III Movement Speed Demon Edit",
    type: "Reels",
    youtubeId: "2nB1yOq0Iaw",
    views: "64K",
    likes: "5.2K"
  },
  {
    id: "s4",
    title: "Demon Slayer Zenitsu Thunder Clap & Flash 100% Speed sync",
    type: "Shorts",
    youtubeId: "vB9aK9xby9s",
    views: "140K",
    likes: "12K"
  }
];

export const INITIAL_LEADERBOARD: FanUser[] = [
  {
    id: "u1",
    username: "Zenitsu_Edits_99",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    role: "vip_editor",
    joinedAt: "2026-01-10",
    points: 4850,
    activityCount: 242,
    unlockedPremium: true
  },
  {
    id: "u2",
    username: "CyberKaitoStan",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
    role: "core_fan",
    joinedAt: "2026-02-14",
    points: 3910,
    activityCount: 153,
    unlockedPremium: true
  },
  {
    id: "u3",
    username: "GokuPhonkMaker",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    role: "core_fan",
    joinedAt: "2026-03-01",
    points: 2750,
    activityCount: 98,
    unlockedPremium: false
  },
  {
    id: "u4",
    username: "UchihaShadows",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
    role: "fan",
    joinedAt: "2026-04-20",
    points: 1540,
    activityCount: 45,
    unlockedPremium: false
  },
  {
    id: "u5",
    username: "LofiNezuko",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120",
    role: "fan",
    joinedAt: "2026-05-15",
    points: 920,
    activityCount: 19,
    unlockedPremium: false
  }
];

export const INITIAL_MESSAGES: FanMessage[] = [
  {
    id: "m1",
    userId: "u1",
    username: "Zenitsu_Edits_99",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
    role: "vip_editor",
    content: "Bro that neon glow tracking effect on Zenitsu's katana was absolute peak! 🔥 Best edit of 2026 so far!",
    createdAt: "2026-05-29T10:15:00Z",
    likes: 24
  },
  {
    id: "m2",
    userId: "u2",
    username: "CyberKaitoStan",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
    role: "core_fan",
    content: "Subscribed with 3 accounts! The transition timing with the bass drop is flawless. Can you post your premiere tutorial?",
    createdAt: "2026-05-29T10:48:00Z",
    likes: 18
  },
  {
    id: "m3",
    userId: "u3",
    username: "GokuPhonkMaker",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    role: "core_fan",
    content: "These Alight Motion and After Effects presets are god tier. Thanks for putting them in the subscriber unlocks!",
    createdAt: "2026-05-29T11:02:00Z",
    likes: 11
  }
];
