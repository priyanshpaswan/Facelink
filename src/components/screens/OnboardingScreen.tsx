import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ScanFace,
  ShieldCheck,
  Users,
  EyeOff,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle,
} from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen, login } = useApp();
  const [slide, setSlide] = useState<number>(0);

  const pillars = [
    {
      icon: ScanFace,
      title: 'Meet in Real Life. Reconnect Online.',
      subtitle:
        'Met someone great at college, a hackathon, coffee shop, gym, or festival? Find their socials without awkwardly asking for six different usernames.',
      accent: 'from-violet-500 to-cyan-400',
    },
    {
      icon: ShieldCheck,
      title: 'Consent-First Architecture',
      subtitle:
        'FaceLink is NOT surveillance. Only voluntary, verified members who explicitly activate Face Discoverability can ever be matched. Strangers and non-users are completely protected.',
      accent: 'from-cyan-400 to-emerald-400',
    },
    {
      icon: EyeOff,
      title: 'Zero Permanent Face Storage',
      subtitle:
        'Search images are discarded instantly after verification. Facial signatures are cryptographically hashed and can be deleted anytime with 1 click.',
      accent: 'from-emerald-400 to-amber-400',
    },
  ];

  const handleNext = () => {
    if (slide < pillars.length - 1) {
      setSlide(slide + 1);
    } else {
      setCurrentScreen('auth_signup');
    }
  };

  const currentPillar = pillars[slide];
  const CurrentIcon = currentPillar.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <span className="font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300">
                FL
              </span>
            </div>
          </div>
          <span className="font-bold text-base tracking-tight">FaceLink</span>
        </div>
        <button
          onClick={() => {
            // Quick explore with sample user
            login('alex@example.com');
          }}
          className="text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-2.5 rounded-lg border border-slate-800"
        >
          Quick Demo Demo Mode
        </button>
      </div>

      {/* Hero Visual */}
      <div className="my-auto py-6 text-center">
        <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
          {/* Animated Glow Rings */}
          <div className="absolute inset-0 rounded-full bg-violet-600/20 blur-2xl animate-pulse" />
          <div className="absolute inset-2 rounded-full border border-violet-500/30" />
          <div className="absolute inset-6 rounded-full border border-dashed border-cyan-400/40 animate-[spin_20s_linear_infinite]" />

          {/* Central Icon Bubble */}
          <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex items-center justify-center text-cyan-400">
            <CurrentIcon className="w-12 h-12 stroke-[1.8]" />
          </div>

          {/* Floating privacy badge */}
          <div className="absolute bottom-0 right-2 bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Lock className="w-3 h-3" />
            <span>Strict Consent</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-3">
          {currentPillar.title}
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
          {currentPillar.subtitle}
        </p>

        {/* Indicator Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {pillars.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                slide === idx ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-800'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-3 pb-4">
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-950/50 transition-all cursor-pointer active:scale-[0.99]"
        >
          <span>{slide === pillars.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentScreen('auth_login')}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors cursor-pointer"
          >
            I have an account
          </button>
          <button
            onClick={() => setCurrentScreen('safety_help')}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-900/50 hover:bg-slate-800 text-slate-400 font-medium text-xs border border-slate-800/80 transition-colors cursor-pointer"
          >
            Consent Charter
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-500">
          By proceeding, you agree to voluntary biometric registration &amp; our strict anti-stalking policy.
        </p>
      </div>
    </div>
  );
};
