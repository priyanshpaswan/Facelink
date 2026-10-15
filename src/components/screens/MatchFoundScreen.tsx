import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShieldCheck,
  CheckCircle2,
  UserPlus,
  UserCheck,
  ShieldAlert,
  Ban,
  ArrowLeft,
  Share2,
  Sparkles,
  MapPin,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { getPermittedSocialLinks } from '../../utils/privacyRules.ts';
import { SocialBadge } from '../common/SocialBadge.tsx';
import { ReportModal } from './ReportModal.tsx';

export const MatchFoundScreen: React.FC = () => {
  const {
    lastMatchCandidate,
    currentUser,
    setCurrentScreen,
    connectWithUser,
    disconnectUser,
    blockUser,
    showNotification,
  } = useApp();

  const [isReporting, setIsReporting] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  if (!lastMatchCandidate || !currentUser) {
    return (
      <div className="max-w-md mx-auto p-6 text-center text-slate-400">
        <p>No active match candidate found.</p>
        <button
          onClick={() => setCurrentScreen('search')}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs"
        >
          Back to Face Search
        </button>
      </div>
    );
  }

  const { user, confidence, matchedFeaturePoints } = lastMatchCandidate;
  const isConnected = currentUser.connections.includes(user.id);

  // Apply privacy filter: ONLY show links permitted for face_match!
  const permittedLinks = getPermittedSocialLinks(
    user.socialLinks,
    'face_match',
    isConnected
  );

  const handleToggleConnect = () => {
    if (isConnected) {
      disconnectUser(user.id);
    } else {
      connectWithUser(user.id);
    }
  };

  const handleConfirmBlock = () => {
    blockUser(user.id);
    setShowBlockConfirm(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('search')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Scan</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Face Match ({(confidence * 100).toFixed(1)}%)</span>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/80 shadow-lg shadow-cyan-950/50"
            />
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 p-1 rounded-lg shadow">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-white truncate">{user.displayName}</h2>
            </div>
            <p className="text-xs text-cyan-400 font-mono font-medium">@{user.username}</p>

            {user.recentMeetupContext && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                <span className="truncate">{user.recentMeetupContext}</span>
              </div>
            )}

            <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{matchedFeaturePoints} Facial Landmark Points Aligned</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl text-xs text-slate-300 leading-relaxed mb-4">
            {user.bio}
          </div>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="mb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Interests &amp; Hobbies
            </label>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-[11px] py-1 px-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Reconnect Action Button */}
        <button
          onClick={handleToggleConnect}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isConnected
              ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
              : 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-violet-950/40'
          }`}
        >
          {isConnected ? (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Saved in Your Reconnect List</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Save &amp; Connect with {user.displayName.split(' ')[0]}</span>
            </>
          )}
        </button>
      </div>

      {/* Approved Social Media Links */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Approved Social Profiles ({permittedLinks.length})
          </h3>
          <span className="text-[10px] text-slate-400">Owner-approved for face discovery</span>
        </div>

        {permittedLinks.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            {user.displayName} has not enabled public social links for this match.
          </div>
        ) : (
          <div className="space-y-2">
            {permittedLinks.map((link) => (
              <SocialBadge key={link.id} link={link} interactive={true} />
            ))}
          </div>
        )}
      </div>

      {/* Privacy Guarantee Note */}
      <div className="p-3.5 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          FaceLink consent guarantee: This individual voluntarily registered, accepted biometric hashing, and marked their profile as discoverable. Hidden links remain strictly confidential.
        </p>
      </div>

      {/* Trust & Safety Controls: Report & Block */}
      <div className="pt-2 flex gap-2">
        <button
          onClick={() => setIsReporting(true)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Report Match</span>
        </button>

        <button
          onClick={() => setShowBlockConfirm(true)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Ban className="w-4 h-4 text-rose-400" />
          <span>Block User</span>
        </button>
      </div>

      {/* Block Confirmation Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-950/80 border border-rose-800/60 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-400">
              <Ban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Block @{user.username}?</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              They will no longer be able to discover you in Face Search, and they will be removed from your matches immediately.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBlockConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
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
