import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ScanFace,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  QrCode,
  Users,
  Compass,
  ArrowRight,
  MapPin,
  ExternalLink,
  ChevronRight,
  Lock,
  Eye,
  Info,
} from 'lucide-react';
import { SocialBadge } from '../common/SocialBadge.tsx';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    communityUsers,
    setCurrentScreen,
    setActiveTab,
    toggleFaceDiscoverability,
    setSelectedUserForView,
  } = useApp();

  const [activeVenue, setActiveVenue] = useState('Tech Meetup & Hackathon');

  if (!currentUser) return null;

  const isDiscoverable = currentUser.privacy.faceDiscoverability;
  const isFaceRegistered = currentUser.faceRegistration.isRegistered;

  // Filter connections
  const connectedUsers = communityUsers.filter((u) =>
    currentUser.connections.includes(u.id)
  );

  const venues = [
    'Tech Summit & Hackathon',
    'College Campus',
    'Specialty Café',
    'Fitness & Gym',
    'Gaming Meetup',
    'Travel & Transit',
  ];

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                isDiscoverable ? 'bg-emerald-400' : 'bg-rose-500'
              }`}
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight leading-tight">
              Hey, {currentUser.displayName.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentScreen('qr')}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
        >
          <QrCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>My QR</span>
        </button>
      </div>

      {/* Discoverability Master Control Card */}
      <div
        className={`p-4 rounded-3xl border transition-all ${
          isDiscoverable
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border-emerald-800/40'
            : 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-xl ${
                isDiscoverable ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Face Discoverability</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isDiscoverable
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDiscoverable ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isDiscoverable
                  ? 'People you meet in person can discover your approved social links.'
                  : 'You are completely hidden from all face-matching searches.'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={isDiscoverable}
              onChange={(e) => toggleFaceDiscoverability(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Biometric Status Row */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span
              className={`w-2 h-2 rounded-full ${
                isFaceRegistered ? 'bg-cyan-400' : 'bg-amber-400'
              }`}
            />
            <span>
              Face ID:{' '}
              <strong className="text-white">
                {isFaceRegistered ? 'Verified & Encrypted' : 'Not Registered'}
              </strong>
            </span>
          </div>

          <button
            onClick={() => setCurrentScreen('face_registration')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] flex items-center gap-0.5"
          >
            {isFaceRegistered ? 'Manage Face ID' : 'Register Face'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Face Search Reconnect Hero Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-violet-900/50 via-slate-900 to-cyan-950/40 border border-violet-700/40 p-5 shadow-2xl">
        {/* Decorative corner visual */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Real-World Social Discovery</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight mb-1.5">
            Met someone just now?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4 max-w-xs">
            Scan their face with mutual consent to instantly find their opted-in Instagram, LinkedIn, or YouTube profile.
          </p>

          <button
            onClick={() => {
              setActiveTab('search');
              setCurrentScreen('search');
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-violet-950/60 transition-all cursor-pointer active:scale-[0.99]"
          >
            <ScanFace className="w-5 h-5 stroke-[2.2]" />
            <span>Launch Face Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Where are you meeting people? Venue tag filter */}
      <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Current Meetup Context</span>
          </div>
          <span className="text-[10px] text-slate-400">Helps refine reconnection notes</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {venues.map((venue) => (
            <button
              key={venue}
              onClick={() => setActiveVenue(venue)}
              className={`shrink-0 text-[11px] py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                activeVenue === venue
                  ? 'bg-violet-950/80 border-violet-500 text-violet-200 font-semibold shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {venue}
            </button>
          ))}
        </div>
      </div>

      {/* Reconnected People / Connections */}
      <div className="p-4 rounded-3xl bg-slate-900/70 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <h3 className="text-xs font-bold text-white">Saved Reconnections</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-violet-950 text-violet-300 rounded">
              {connectedUsers.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Mutual connections</span>
        </div>

        {connectedUsers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-slate-800/60">
            No saved connections yet. Scan someone you meet to add them to your FaceLink roll!
          </div>
        ) : (
          <div className="space-y-2">
            {connectedUsers.map((user) => (
              <div
                key={user.id}
                className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {user.displayName}
                    </h4>
                    <p className="text-[11px] text-cyan-400 font-mono">@{user.username}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                      {user.recentMeetupContext || 'Met in person'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedUserForView(user);
                    setCurrentScreen('view_user_profile');
                  }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Presets Guide Card */}
      <div className="p-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Interactive Prototype Testing Scenarios</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          In Face Search, you can test live WebRTC camera capture or pick pre-configured personas to verify privacy boundaries:
        </p>
        <ul className="text-[11px] space-y-1 pl-4 list-disc text-slate-400">
          <li>
            <strong className="text-slate-200">Jordan Taylor / Maya Chen:</strong> Opted in with Face Discoverability ON → verified match with approved links.
          </li>
          <li>
            <strong className="text-slate-200">Elena Rostova:</strong> Opted OUT of discoverability → verified &ldquo;No Match Found&rdquo; respecting consent.
          </li>
          <li>
            <strong className="text-slate-200">Unknown Individual:</strong> Non-user → verified &ldquo;No Match Found&rdquo;, image instantly discarded.
          </li>
        </ul>
      </div>
    </div>
  );
};
