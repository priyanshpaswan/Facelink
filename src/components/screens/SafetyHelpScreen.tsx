import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  EyeOff,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const SafetyHelpScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>
        <span className="text-xs font-bold text-white uppercase tracking-wider">Safety Charter</span>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-gradient-to-br from-violet-950/60 via-slate-900 to-cyan-950/40 border border-violet-800/50 rounded-3xl p-5 shadow-2xl space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>The FaceLink Consent Guarantee</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          FaceLink was created to solve a genuine real-world problem: reconnecting with people you actually met in person (at college, events, cafes, gyms, travel). We believe face-matching technology is only ethical when grounded in complete transparency, voluntary opt-in, and strict user consent.
        </p>
      </div>

      {/* 4 Pillars of Protection */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider px-1">
          Core Safety Principles
        </h3>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>1. Strict Voluntary Opt-In (No Strangers)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
            FaceLink NEVER searches against non-users or unconsenting bystanders. If an individual has not registered or has paused discoverability, no match will ever be returned.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <EyeOff className="w-4 h-4 shrink-0" />
            <span>2. Zero Permanent Search Storage</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
            Search photos captured via camera are evaluated in ephemeral memory and discarded immediately. No history of query images is saved.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
            <Lock className="w-4 h-4 shrink-0" />
            <span>3. Anti-Stalking &amp; Anti-Scraping Rate Limiting</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
            The platform enforces a strict window limit (maximum 6 scans per 10 minutes) and logs anomaly patterns to eliminate bulk harvesting, creepy surveillance, or persistent tracking.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span>4. User Control &amp; Granular Visibility</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
            You choose which accounts appear on face match. You can pause Face Discoverability with 1 switch, or delete your entire facial signature and account at any time.
          </p>
        </div>
      </div>

      {/* In-Person Reconnect Etiquette */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-2">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Real-Life Etiquette Guidelines</span>
        </h3>
        <ul className="text-[11px] text-slate-400 space-y-1.5 pl-4 list-disc leading-relaxed">
          <li>
            <strong className="text-slate-300">Always ask first:</strong> Say &ldquo;Are you on FaceLink? Let&apos;s reconnect!&rdquo; Never snap pictures covertly.
          </li>
          <li>
            <strong className="text-slate-300">Prefer QR in loud spots:</strong> If you are in a crowded bar or transit station, tap &ldquo;My QR&rdquo; for an instant physical scan.
          </li>
          <li>
            <strong className="text-slate-300">Respect privacy choices:</strong> If someone turns discoverability off, do not pressure them.
          </li>
        </ul>
      </div>

      {/* Production Architecture Roadmap Note */}
      <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-3xl text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Prototype Architecture &amp; Future Backend</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          This prototype demonstrates the complete frontend user journey, privacy controls, and simulated face matching with transparent demo profiles. In production, this connects to a Python / Flask backend with SQLite/PostgreSQL, zero-knowledge encrypted vector embeddings, and multi-factor liveness anti-spoofing verification.
        </p>
      </div>
    </div>
  );
};
