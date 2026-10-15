import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Edit3,
  QrCode,
  ShieldCheck,
  Link2,
  Sparkles,
  MapPin,
  Settings,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { SocialBadge } from '../common/SocialBadge.tsx';

export const ProfileScreen: React.FC = () => {
  const { currentUser, setCurrentScreen } = useApp();

  if (!currentUser) return null;

  const isDiscoverable = currentUser.privacy.faceDiscoverability;
  const isFaceRegistered = currentUser.faceRegistration.isRegistered;

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                isDiscoverable ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentScreen('edit_profile')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              aria-label="Edit Profile Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentScreen('qr')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
              aria-label="View QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white tracking-tight">{currentUser.displayName}</h1>
        <p className="text-xs text-cyan-400 font-mono font-medium">@{currentUser.username}</p>

        {currentUser.recentMeetupContext && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <span>Frequent Meetups: {currentUser.recentMeetupContext}</span>
          </div>
        )}

        {currentUser.bio && (
          <p className="text-xs text-slate-300 mt-3 leading-relaxed bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
            {currentUser.bio}
          </p>
        )}

        {/* Interests */}
        {currentUser.interests && currentUser.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentUser.interests.map((interest) => (
              <span
                key={interest}
                className="text-[10px] font-semibold py-0.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
              >
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Discovery & Consent Status Pills */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          onClick={() => setCurrentScreen('privacy_settings')}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Discoverability</div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isDiscoverable ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span className="font-bold text-white">{isDiscoverable ? 'Active' : 'Paused'}</span>
          </div>
        </div>

        <div
          onClick={() => setCurrentScreen('face_registration')}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Face ID Data</div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isFaceRegistered ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
            <span className="font-bold text-white">
              {isFaceRegistered ? 'Enrolled' : 'Not Enrolled'}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Social Accounts */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Connected Social Accounts ({currentUser.socialLinks.length})
            </h3>
          </div>
          <button
            onClick={() => setCurrentScreen('manage_social_links')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage</span>
          </button>
        </div>

        {currentUser.socialLinks.length === 0 ? (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            <p>No social profiles connected yet.</p>
            <button
              onClick={() => setCurrentScreen('manage_social_links')}
              className="mt-2 py-1.5 px-3 bg-cyan-600 text-slate-950 font-bold rounded-xl text-xs inline-block"
            >
              Add Instagram or LinkedIn
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {currentUser.socialLinks.map((link) => (
              <SocialBadge key={link.id} link={link} interactive={true} showVisibilityTag={true} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Settings Shortcut */}
      <button
        onClick={() => setCurrentScreen('privacy_settings')}
        className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>Privacy &amp; Security Controls</span>
      </button>
    </div>
  );
};
