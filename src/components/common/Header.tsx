import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ShieldCheck, ShieldAlert, Sparkles, HelpCircle, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentUser, setCurrentScreen, toggleFaceDiscoverability, switchPersona, communityUsers } = useApp();

  if (!currentUser) return null;

  const isDiscoverable = currentUser.privacy.faceDiscoverability;
  const isFaceRegistered = currentUser.faceRegistration.isRegistered;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          aria-label="FaceLink Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">
                FL
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-violet-300 transition-colors">
                FaceLink
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-violet-950/80 text-violet-300 border border-violet-800/60 rounded">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Meet. Find. Connect.</p>
          </div>
        </button>

        {/* Right Status Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Discoverability Status Toggle */}
          <button
            onClick={() => toggleFaceDiscoverability(!isDiscoverable)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isDiscoverable
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-rose-950/60 border-rose-800/60 text-rose-300 hover:bg-rose-900/60'
            }`}
            title={isDiscoverable ? 'Face Discoverability is ON' : 'Face Discoverability is PAUSED'}
            aria-label="Toggle Face Discoverability"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDiscoverable ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="text-[11px] font-medium hidden sm:inline">
              {isDiscoverable ? 'Discoverable' : 'Hidden'}
            </span>
          </button>

          {/* Persona Switcher Menu for live testing */}
          <div className="relative group">
            <select
              aria-label="Switch Test Persona"
              value={currentUser.id}
              onChange={(e) => switchPersona(e.target.value)}
              className="bg-slate-900 text-slate-300 text-[11px] py-1 px-2 border border-slate-700 rounded-lg focus:outline-none focus:border-violet-500 cursor-pointer max-w-[100px] truncate"
            >
              <option value={currentUser.id}>@{currentUser.username}</option>
              {communityUsers
                .filter((u) => u.id !== currentUser.id)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    @{u.username} ({u.privacy.faceDiscoverability ? 'Opt-in' : 'Opt-out'})
                  </option>
                ))}
            </select>
          </div>

          {/* Ethics / Safety Info Icon */}
          <button
            onClick={() => setCurrentScreen('safety_help')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Safety & Consent Charter"
            title="Privacy & Consent Charter"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
