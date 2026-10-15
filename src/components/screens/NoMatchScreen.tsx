import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Info,
  UserX,
  ExternalLink,
} from 'lucide-react';
import { DEMO_SEARCH_TARGETS } from '../../data/mockUsers.ts';

export const NoMatchScreen: React.FC = () => {
  const {
    setCurrentScreen,
    lastSearchMeta,
    communityUsers,
    setSelectedUserForView,
    currentUser,
  } = useApp();

  const [usernameQuery, setUsernameQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleUsernameSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setSearchedUser(null);

    const clean = usernameQuery.replace('@', '').trim().toLowerCase();
    if (!clean) return;

    const found = communityUsers.find(
      (u) => u.username.toLowerCase() === clean && u.id !== currentUser?.id
    );

    if (found) {
      if (!found.privacy.allowUsernameSearch) {
        setSearchError(`@${clean} has disabled username lookup in privacy settings.`);
      } else {
        setSearchedUser(found);
      }
    } else {
      setSearchError(`No registered user found with username @${clean}.`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      {/* Top Bar */}
      <button
        onClick={() => setCurrentScreen('search')}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Scanner</span>
      </button>

      {/* Main Alert Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <UserX className="w-8 h-8 text-slate-400 stroke-[1.8]" />
        </div>

        <h2 className="text-lg font-bold text-white mb-1.5">No Eligible Match Found</h2>
        <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
          We could not find an opted-in, registered FaceLink member matching this image.
        </p>

        {/* Instant Discard Notice */}
        <div className="mt-4 p-3 bg-slate-950/70 border border-emerald-900/40 rounded-2xl text-[11px] text-emerald-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Image purged immediately. Zero data retained.</span>
        </div>
      </div>

      {/* Why Did This Happen? Consent Transparency Breakdown */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Why was there no match?</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <h4 className="font-semibold text-slate-200">1. Individual Opted Out of Discovery</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              If the person is on FaceLink but turned their &ldquo;Face Discoverability&rdquo; toggle OFF, our privacy protocol strictly hides their profile (e.g. Elena Rostova in our demo).
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <h4 className="font-semibold text-slate-200">2. Individual is Not Registered</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              FaceLink strictly protects non-users. We never crawl the internet or identify unconsenting strangers.
            </p>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
            <h4 className="font-semibold text-slate-200">3. Match Confidence Below 85%</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              To prevent false positives and protect people from misidentification, FaceLink requires high landmark alignment before displaying social links.
            </p>
          </div>
        </div>
      </div>

      {/* Alternative: Search by FaceLink Username */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-3xl">
        <h3 className="text-xs font-bold text-white mb-1">Know their @username instead?</h3>
        <p className="text-[11px] text-slate-400 mb-3">
          If the person shared their handle with you verbally:
        </p>

        <form onSubmit={handleUsernameSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={usernameQuery}
              onChange={(e) => setUsernameQuery(e.target.value)}
              placeholder="e.g. jordan_creates"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
          >
            Find
          </button>
        </form>

        {searchError && (
          <div className="mt-2.5 p-2 rounded-xl bg-rose-950/50 border border-rose-900/50 text-[11px] text-rose-300">
            {searchError}
          </div>
        )}

        {searchedUser && (
          <div className="mt-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={searchedUser.avatarUrl}
                alt={searchedUser.displayName}
                className="w-9 h-9 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white">{searchedUser.displayName}</h4>
                <p className="text-[10px] text-cyan-400 font-mono">@{searchedUser.username}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedUserForView(searchedUser);
                setCurrentScreen('view_user_profile');
              }}
              className="py-1 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px]"
            >
              View
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentScreen('search')}
          className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-950/40"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Scan</span>
        </button>

        <button
          onClick={() => setCurrentScreen('home')}
          className="py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800"
        >
          Home
        </button>
      </div>
    </div>
  );
};
