import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import QRCode from 'qrcode';
import { QrCode, Copy, Check, Download, ShieldCheck, X } from 'lucide-react';

export const QRCodeModal: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { currentUser, showNotification, setCurrentScreen } = useApp();
  const [qrSvg, setQrSvg] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const profileUrl = currentUser
    ? `https://facelink.app/u/${currentUser.username}`
    : 'https://facelink.app';

  useEffect(() => {
    if (!currentUser) return;
    QRCode.toString(profileUrl, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#38bdf8',
        light: '#020617',
      },
      width: 220,
    })
      .then((svg) => {
        setQrSvg(svg);
      })
      .catch((err) => console.error(err));
  }, [currentUser, profileUrl]);

  if (!currentUser) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(profileUrl);
    setCopied(true);
    showNotification('Link Copied', profileUrl, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-24 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            My FaceLink QR
          </h2>
          <p className="text-xs text-slate-400">Share in person without revealing phone number</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-3 p-0.5 bg-gradient-to-tr from-cyan-400 to-violet-600 shadow-lg shadow-cyan-500/20">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.displayName}
              className="w-full h-full rounded-[14px] object-cover"
            />
          </div>
          <h3 className="text-base font-bold text-white">{currentUser.displayName}</h3>
          <p className="text-xs text-cyan-400 font-mono">@{currentUser.username}</p>

          {/* QR Code Container */}
          <div className="my-5 p-4 bg-slate-950 border border-slate-800/80 rounded-2xl inline-block shadow-inner">
            {qrSvg ? (
              <div
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                className="w-[180px] h-[180px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
              />
            ) : (
              <div className="w-[180px] h-[180px] flex items-center justify-center text-xs text-slate-500">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 py-1 px-3 rounded-full mx-auto max-w-fit mb-5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Consent-Protected Direct Link</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            <button
              onClick={() => {
                showNotification('QR Ready', 'Take a screenshot to keep on your lock screen.', 'info');
              }}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-violet-900/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Save QR</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">How QR Profile Sharing works:</p>
        <p className="leading-relaxed text-[11px]">
          When you meet someone in a noisy venue or prefer not to use camera face search, let them scan this code. Only links marked &quot;Visible in QR Scan&quot; or &quot;Public&quot; will be revealed.
        </p>
      </div>
    </div>
  );
};
