import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ArrowLeft, UserX, ShieldCheck } from 'lucide-react';

export const BlockedUsersScreen: React.FC = () => {
  const { currentUser, communityUsers, unblockUser, setCurrentScreen } = useApp();

  if (!currentUser) return null;

  const blockedUsers = communityUsers.filter((u) =>
    currentUser.blockedUserIds.includes(u.id)
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('settings')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Settings</span>
        </button>
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">Blocked Profiles</h2>
      </div>

      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-bold text-white mb-1">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Reciprocal Discovery Shield</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Blocked individuals can never match your face, see your profile, or discover your approved links.
        </p>
      </div>

      {blockedUsers.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
          <UserX className="w-10 h-10 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
          <p>No blocked users.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blockedUsers.map((user) => (
            <div
              key={user.id}
              className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-10 h-10 rounded-xl object-cover grayscale opacity-75"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{user.displayName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">@{user.username}</p>
                </div>
              </div>

              <button
                onClick={() => unblockUser(user.id)}
                className="py-1 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
