import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ArrowLeft,
  ShieldCheck,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Ban,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { getPermittedSocialLinks } from '../../utils/privacyRules.ts';
import { SocialBadge } from '../common/SocialBadge.tsx';
import { ReportModal } from './ReportModal.tsx';

export const ViewUserProfileScreen: React.FC = () => {
  const {
    selectedUserForView,
    currentUser,
    setCurrentScreen,
    connectWithUser,
    disconnectUser,
    blockUser,
  } = useApp();

  const [isReporting, setIsReporting] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  if (!selectedUserForView || !currentUser) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-slate-400">
        <p>No profile selected.</p>
        <button
          onClick={() => setCurrentScreen('home')}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs"
        >
          Back Home
        </button>
      </div>
    );
  }

  const user = selectedUserForView;
  const isConnected = currentUser.connections.includes(user.id);

  const permittedLinks = getPermittedSocialLinks(
    user.socialLinks,
    'face_match',
    isConnected
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-white">FaceLink Profile</span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={user.avatarUrl}
            alt={user.displayName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shadow-lg"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{user.displayName}</h2>
            <p className="text-xs text-cyan-400 font-mono">@{user.username}</p>

            {user.recentMeetupContext && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                <span className="truncate">{user.recentMeetupContext}</span>
              </div>
            )}

            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  user.privacy.faceDiscoverability ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span className="text-[10px] text-slate-300">
                {user.privacy.faceDiscoverability ? 'Face Discoverability Active' : 'Face Discoverability Paused'}
              </span>
            </div>
          </div>
        </div>

        {user.bio && (
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 mb-4">
            {user.bio}
          </p>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-[10px] font-semibold py-0.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => (isConnected ? disconnectUser(user.id) : connectWithUser(user.id))}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isConnected
              ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
              : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'
          }`}
        >
          {isConnected ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Saved in Reconnect List</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Save Reconnection</span>
            </>
          )}
        </button>
      </div>

      {/* Social Links */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
          Approved Social Links ({permittedLinks.length})
        </h3>
        {permittedLinks.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            No public links shared.
          </div>
        ) : (
          <div className="space-y-2">
            {permittedLinks.map((link) => (
              <SocialBadge key={link.id} link={link} interactive={true} />
            ))}
          </div>
        )}
      </div>

      {/* Block & Report */}
      <div className="pt-2 flex gap-2">
        <button
          onClick={() => setIsReporting(true)}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Report</span>
        </button>
        <button
          onClick={() => setShowBlockConfirm(true)}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
        >
          <Ban className="w-4 h-4 text-rose-400" />
          <span>Block</span>
        </button>
      </div>

      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 text-center shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">Block @{user.username}?</h3>
            <p className="text-xs text-slate-400 mb-4">
              They will not be able to find you through face search.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  blockUser(user.id);
                  setShowBlockConfirm(false);
                }}
                className="flex-1 py-1.5 rounded-xl bg-rose-600 text-xs font-bold text-white"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {isReporting && (
        <ReportModal
          targetUserId={user.id}
          targetUsername={user.username}
          onClose={() => setIsReporting(false)}
        />
      )}
    </div>
  );
};
