import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  UserX,
  Trash2,
  KeyRound,
  FileText,
  AlertTriangle,
  RotateCcw,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Search,
} from 'lucide-react';

export const PrivacySettingsScreen: React.FC = () => {
  const {
    currentUser,
    setCurrentScreen,
    toggleFaceDiscoverability,
    updateProfile,
    deleteAccount,
    logout,
    resetAllData,
    showNotification,
  } = useApp();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!currentUser) return null;

  const isDiscoverable = currentUser.privacy.faceDiscoverability;
  const isFaceRegistered = currentUser.faceRegistration.isRegistered;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showNotification('Password Too Short', 'Password must be at least 6 characters.', 'warn');
      return;
    }
    showNotification('Password Updated', 'Your security credentials were updated.', 'success');
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <h2 className="text-xs font-bold text-white uppercase tracking-wider">Privacy &amp; Security</h2>
      </div>

      {/* Master Face Discoverability Section */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isDiscoverable ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Face Discoverability</h3>
              <p className="text-[11px] text-slate-400">Master matching availability</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDiscoverable}
              onChange={(e) => toggleFaceDiscoverability(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          {isDiscoverable ? (
            <span className="text-emerald-400 font-medium">
              ✓ Active: Registered members who meet you in person can scan your face to discover your approved links.
            </span>
          ) : (
            <span className="text-rose-400 font-medium">
              ✕ Paused: You are completely excluded from face-based discovery. No one can find you via face scanner.
            </span>
          )}
        </p>
      </div>

      {/* Biometric Face Data Management */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
          Biometric Data Management
        </h3>

        <div
          onClick={() => setCurrentScreen('face_registration')}
          className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
              <span>Face Registration Status</span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  isFaceRegistered
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {isFaceRegistered ? 'Enrolled' : 'Not Enrolled'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isFaceRegistered
                ? 'Review or purge your facial landmark signatures'
                : 'Enroll your face to enable discovery'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Granular Privacy Toggles */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">Allow Username Search</span>
              <span className="text-[10px] text-slate-400">
                Allow people to search your exact @username
              </span>
            </div>
            <input
              type="checkbox"
              checked={currentUser.privacy.allowUsernameSearch}
              onChange={(e) =>
                updateProfile({
                  privacy: { ...currentUser.privacy, allowUsernameSearch: e.target.checked },
                })
              }
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-white block">Allow QR Code Discovery</span>
              <span className="text-[10px] text-slate-400">
                Allow people to scan your direct QR badge
              </span>
            </div>
            <input
              type="checkbox"
              checked={currentUser.privacy.allowQrScan}
              onChange={(e) =>
                updateProfile({
                  privacy: { ...currentUser.privacy, allowQrScan: e.target.checked },
                })
              }
              className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-white block">Anti-Stalking Rate Limiter</span>
              <span className="text-[10px] text-slate-400">
                Max 6 searches per 10 mins (Mandatory security layer)
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              ENFORCED
            </span>
          </div>
        </div>
      </div>

      {/* Safety & Moderation Controls */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
          Safety &amp; Moderation
        </h3>

        <div
          onClick={() => setCurrentScreen('blocked_users')}
          className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <UserX className="w-4 h-4 text-rose-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">Blocked Users</h4>
              <p className="text-[11px] text-slate-400">
                {currentUser.blockedUserIds.length} user(s) blocked
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        <div
          onClick={() => setCurrentScreen('safety_help')}
          className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-cyan-400" />
            <div>
              <h4 className="text-xs font-semibold text-white">FaceLink Consent Charter</h4>
              <p className="text-[11px] text-slate-400">Our privacy and anti-surveillance guarantee</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Account Credentials & Danger Zone */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
          Account Security
        </h3>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-200 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-violet-400" />
            <span>Change Account Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={logout}
          className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-200 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-amber-400" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full p-3 bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/50 rounded-2xl flex items-center justify-between text-xs text-rose-300 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Delete Account &amp; All Biometric Data</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-500" />
        </button>
      </div>

      {/* Demo helper */}
      <div className="pt-2 text-center">
        <button
          onClick={resetAllData}
          className="text-[11px] text-slate-500 hover:text-slate-300 underline"
        >
          Reset Applet to Original Test Data
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handlePasswordChange}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 space-y-3 shadow-2xl"
          >
            <h3 className="text-sm font-bold text-white">Change Password</h3>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-cyan-600 font-bold text-xs text-slate-950 rounded-xl"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-950/80 border border-rose-800/60 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Delete Account Permanently?</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This action cannot be undone. All facial biometric vectors, social links, profile history, and matches will be permanently purged immediately.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAccount();
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
