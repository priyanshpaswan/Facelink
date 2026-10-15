import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Lock, Mail, User, ShieldCheck, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export const AuthScreen: React.FC<{ initialMode?: 'login' | 'signup' | 'forgot' }> = ({
  initialMode = 'login',
}) => {
  const { login, signup, setCurrentScreen, showNotification } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      if (!email) {
        setError('Please enter your email or username');
        return;
      }
      login(email);
    } else if (mode === 'signup') {
      if (!username || !displayName || !email) {
        setError('Please fill out all fields');
        return;
      }
      if (!consentChecked) {
        setError('You must accept the Consent & Anti-Stalking Policy');
        return;
      }
      signup(username, displayName, email);
    } else if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your registered email address');
        return;
      }
      showNotification(
        'Password Reset Sent',
        `A secure one-time recovery link has been simulated for ${email}.`,
        'success'
      );
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center p-5 max-w-md mx-auto">
      {/* Top back button */}
      <button
        onClick={() => setCurrentScreen('onboarding')}
        className="self-start flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 p-1 rounded-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 mx-auto mb-3 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Profile'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Log into your secure FaceLink account'}
            {mode === 'signup' && 'Join the consensual social discovery network'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Quick Demo Persona Shortcuts */}
        {mode === 'login' && (
          <div className="mb-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>One-Click Test Login:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => login('pratikkumarpaswan57@gmail.com')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-left border border-slate-700/60 truncate"
              >
                <div className="font-semibold text-[11px] text-white">@pratik_kp</div>
                <div className="text-[10px] text-emerald-400">Opted In • Full Links</div>
              </button>
              <button
                type="button"
                onClick={() => login('jordan@studio.design')}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-left border border-slate-700/60 truncate"
              >
                <div className="font-semibold text-[11px] text-white">@jordan_creates</div>
                <div className="text-[10px] text-cyan-400">Hackathon Designer</div>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Full Name / Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Unique Username
                </label>
                <div className="relative">
                  <span className="text-slate-500 font-mono absolute left-3 top-2.5 text-xs">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="alex_m"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-violet-600 focus:ring-0"
              />
              <span className="text-[11px] text-slate-400 leading-tight">
                I agree to voluntary face discoverability policies, acknowledge that no facial data is shared without explicit consent, and agree not to use FaceLink for stalking.
              </span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-violet-950/40 transition-all cursor-pointer mt-2"
          >
            {mode === 'login' && 'Log In to FaceLink'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Send Password Recovery'}
          </button>
        </form>

        {/* Footer switches */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Log in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <p>
              Remembered your password?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Back to login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
