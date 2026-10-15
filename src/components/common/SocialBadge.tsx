import React from 'react';
import type { SocialLink, SocialPlatform } from '../../types/index.ts';
import {
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Globe,
  ExternalLink,
  MessageSquare,
  Lock,
  Eye,
  QrCode,
  Users,
} from 'lucide-react';

export const platformMeta: Record<
  SocialPlatform,
  { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  instagram: {
    label: 'Instagram',
    color: 'text-pink-400',
    bg: 'bg-pink-950/40',
    border: 'border-pink-800/40',
    icon: Instagram,
  },
  linkedin: {
    label: 'LinkedIn',
    color: 'text-blue-400',
    bg: 'bg-blue-950/40',
    border: 'border-blue-800/40',
    icon: Linkedin,
  },
  youtube: {
    label: 'YouTube',
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-800/40',
    icon: Youtube,
  },
  x: {
    label: 'X (Twitter)',
    color: 'text-slate-200',
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    icon: Twitter,
  },
  snapchat: {
    label: 'Snapchat',
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/40',
    border: 'border-yellow-800/40',
    icon: MessageSquare,
  },
  tiktok: {
    label: 'TikTok',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-800/40',
    icon: MessageSquare,
  },
  github: {
    label: 'GitHub',
    color: 'text-slate-300',
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    icon: Globe,
  },
  discord: {
    label: 'Discord',
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/40',
    border: 'border-indigo-800/40',
    icon: MessageSquare,
  },
  telegram: {
    label: 'Telegram',
    color: 'text-sky-400',
    bg: 'bg-sky-950/40',
    border: 'border-sky-800/40',
    icon: MessageSquare,
  },
  website: {
    label: 'Website / Portfolio',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/40',
    icon: Globe,
  },
};

export const SocialBadge: React.FC<{
  link: SocialLink;
  interactive?: boolean;
  showVisibilityTag?: boolean;
}> = ({ link, interactive = true, showVisibilityTag = false }) => {
  const meta = platformMeta[link.platform] || platformMeta.website;
  const Icon = meta.icon;

  const visibilityInfo = {
    public_face_match: { label: 'Face Search', icon: Eye, color: 'text-emerald-400' },
    qr_only: { label: 'QR Only', icon: QrCode, color: 'text-cyan-400' },
    mutual_only: { label: 'Mutual Only', icon: Users, color: 'text-violet-400' },
    hidden: { label: 'Hidden', icon: Lock, color: 'text-slate-400' },
  }[link.visibility];

  const content = (
    <div
      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
        meta.bg
      } ${meta.border} ${
        interactive ? 'hover:scale-[1.01] hover:border-slate-500 cursor-pointer shadow-md' : ''
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-xl bg-slate-950/70 ${meta.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>{meta.label}</span>
            {showVisibilityTag && visibilityInfo && (
              <span className={`text-[10px] font-normal flex items-center gap-0.5 ${visibilityInfo.color}`}>
                • {visibilityInfo.label}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 truncate">
            {link.username.startsWith('@') ? link.username : `@${link.username}`}
          </div>
        </div>
      </div>

      {interactive && (
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-white pl-2">
          <span className="text-[11px] font-medium hidden sm:inline">Connect</span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </div>
      )}
    </div>
  );

  if (interactive && link.url) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none"
        aria-label={`Open ${meta.label} profile for ${link.username}`}
      >
        {content}
      </a>
    );
  }

  return content;
};
