import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { SocialLink, SocialPlatform, VisibilityLevel } from '../../types/index.ts';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Eye,
  QrCode,
  Users,
  Lock,
  Globe,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { platformMeta, SocialBadge } from '../common/SocialBadge.tsx';

export const SocialLinksManagerScreen: React.FC = () => {
  const { currentUser, addSocialLink, updateSocialLink, removeSocialLink, setCurrentScreen } =
    useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [username, setUsername] = useState('');
  const [url, setUrl] = useState('');
  const [visibility, setVisibility] = useState<VisibilityLevel>('public_face_match');

  if (!currentUser) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    let finalUrl = url.trim();
    if (!finalUrl) {
      if (platform === 'instagram') finalUrl = `https://instagram.com/${username.replace('@', '')}`;
      else if (platform === 'linkedin') finalUrl = `https://linkedin.com/in/${username.replace('@', '')}`;
      else if (platform === 'youtube') finalUrl = `https://youtube.com/@${username.replace('@', '')}`;
      else if (platform === 'x') finalUrl = `https://x.com/${username.replace('@', '')}`;
      else if (platform === 'snapchat') finalUrl = `https://snapchat.com/add/${username.replace('@', '')}`;
      else if (platform === 'github') finalUrl = `https://github.com/${username.replace('@', '')}`;
      else if (platform === 'discord') finalUrl = `https://discord.com`;
      else if (platform === 'telegram') finalUrl = `https://t.me/${username.replace('@', '')}`;
      else finalUrl = `https://${username}`;
    }

    addSocialLink({
      platform,
      username,
      url: finalUrl,
      visibility,
    });

    setIsAdding(false);
    setUsername('');
    setUrl('');
  };

  const platformsList: SocialPlatform[] = [
    'instagram',
    'linkedin',
    'youtube',
    'x',
    'snapchat',
    'github',
    'discord',
    'telegram',
    'tiktok',
    'website',
  ];

  const visibilityOptions: Array<{
    id: VisibilityLevel;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'public_face_match',
      label: 'Visible in Face Search & QR',
      desc: 'Shown whenever a consenting person matches your face or scans your QR.',
      icon: Eye,
    },
    {
      id: 'qr_only',
      label: 'QR Code Only',
      desc: 'Hidden from face matching. Only shown if they physically scan your phone QR.',
      icon: QrCode,
    },
    {
      id: 'mutual_only',
      label: 'Mutual Connections Only',
      desc: 'Revealed only after you both accept the reconnection.',
      icon: Users,
    },
    {
      id: 'hidden',
      label: 'Hidden / Private',
      desc: 'Saved in your vault but not visible to anyone else.',
      icon: Lock,
    },
  ];

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <h2 className="text-xs font-bold text-white uppercase tracking-wider">Social Links Vault</h2>
      </div>

      {/* Intro info */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-bold text-white mb-1">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Granular Visibility Control</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          You decide exactly which social platforms are revealed when an eligible individual matches your face.
        </p>
      </div>

      {/* Add New Link Button / Drawer */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-950/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Link New Social Profile</span>
        </button>
      ) : (
        <form
          onSubmit={handleCreate}
          className="p-4 bg-slate-900 border border-violet-500/40 rounded-3xl space-y-3.5 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Link New Account</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Select Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {platformsList.map((p) => (
                <option key={p} value={p}>
                  {platformMeta[p].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Username or Handle
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. alex.shoots"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Custom URL (Optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Discovery Visibility
            </label>
            <div className="space-y-1.5">
              {visibilityOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer text-xs ${
                    visibility === opt.id
                      ? 'bg-violet-950/40 border-violet-500 text-white'
                      : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="linkVisibility"
                    value={opt.id}
                    checked={visibility === opt.id}
                    onChange={() => setVisibility(opt.id)}
                    className="mt-0.5 text-violet-600 focus:ring-0"
                  />
                  <div>
                    <span className="font-semibold block leading-tight">{opt.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Save Link
          </button>
        </form>
      )}

      {/* Existing Links List */}
      <div className="space-y-2.5 pt-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
          Active Connected Links ({currentUser.socialLinks.length})
        </h3>

        {currentUser.socialLinks.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            No social accounts connected yet. Add your Instagram, LinkedIn, or YouTube to let matched connections find you.
          </div>
        ) : (
          currentUser.socialLinks.map((link) => (
            <div
              key={link.id}
              className="p-3 bg-slate-900 border border-slate-800/80 rounded-2xl space-y-2.5"
            >
              <SocialBadge link={link} interactive={false} showVisibilityTag={true} />

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {/* Visibility dropdown */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>Visibility:</span>
                  <select
                    value={link.visibility}
                    onChange={(e) =>
                      updateSocialLink(link.id, { visibility: e.target.value as VisibilityLevel })
                    }
                    className="bg-slate-950 text-slate-300 py-1 px-2 border border-slate-800 rounded-lg focus:outline-none"
                  >
                    <option value="public_face_match">Face Search &amp; QR</option>
                    <option value="qr_only">QR Only</option>
                    <option value="mutual_only">Mutual Connections Only</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <button
                  onClick={() => removeSocialLink(link.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  aria-label="Delete Link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
