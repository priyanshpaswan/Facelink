import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ArrowLeft, Save, User, Tag, Plus, X, Image as ImageIcon } from 'lucide-react';

export const EditProfileScreen: React.FC = () => {
  const { currentUser, updateProfile, setCurrentScreen } = useApp();

  if (!currentUser) return null;

  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [recentMeetupContext, setRecentMeetupContext] = useState(
    currentUser.recentMeetupContext || ''
  );
  const [interests, setInterests] = useState<string[]>(currentUser.interests || []);
  const [newTag, setNewTag] = useState('');

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  ];

  const handleAddTag = () => {
    const clean = newTag.trim();
    if (clean && !interests.includes(clean)) {
      setInterests([...interests, clean]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setInterests(interests.filter((t) => t !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      bio,
      avatarUrl,
      recentMeetupContext,
      interests,
    });
    setCurrentScreen('profile');
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('profile')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel</span>
        </button>
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">Edit Profile</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Avatar Picker */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Profile Avatar
          </label>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400"
            />
            <div className="flex-1 min-w-0">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Image URL"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Pick sample preset below:</span>
            </div>
          </div>

          <div className="flex gap-2">
            {sampleAvatars.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatarUrl(url)}
                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                  avatarUrl === url ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60'
                }`}
              >
                <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Display Name */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Bio / Reconnect Note
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="What are your interests or what circles do you run in?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Recent Meetup Context
            </label>
            <input
              type="text"
              value={recentMeetupContext}
              onChange={(e) => setRecentMeetupContext(e.target.value)}
              placeholder="e.g. Stanford AI Builders, Equinox Gym, Blue Bottle"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Interests & Tags */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
            Interests &amp; Topics
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add interest (e.g. Hackathons, Travel)"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-white"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-violet-950/40 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
