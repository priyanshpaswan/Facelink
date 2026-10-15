import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ShieldCheck,
  Camera,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  FileText,
  Lock,
  RefreshCw,
} from 'lucide-react';

export const FaceRegistrationScreen: React.FC = () => {
  const {
    currentUser,
    setCurrentScreen,
    updateFaceRegistration,
    removeFaceRegistration,
    showNotification,
  } = useApp();

  const [hasAgreedToCharter, setHasAgreedToCharter] = useState(
    currentUser?.faceRegistration.consentAccepted || false
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(
    currentUser?.faceRegistration.photoUrl || currentUser?.avatarUrl || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isRegistered = currentUser?.faceRegistration.isRegistered;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch {
      showNotification('Camera Unavailable', 'Using simulated biometric registration.', 'warn');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 480;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
      }
    }
    stopCamera();
  };

  const handleRegisterFace = async () => {
    if (!hasAgreedToCharter) {
      showNotification('Consent Required', 'Please review and accept the biometric agreement.', 'warn');
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const simulatedHash = `EMB_${currentUser?.username.toUpperCase()}_HASH_${Math.floor(10000 + Math.random() * 90000)}`;

    updateFaceRegistration({
      isRegistered: true,
      consentAccepted: true,
      registeredAt: new Date().toISOString(),
      consentAcceptedAt: new Date().toISOString(),
      faceEmbeddingHash: simulatedHash,
      photoUrl: capturedPhoto || currentUser?.avatarUrl,
    });

    setIsProcessing(false);
    showNotification('Face ID Enrolled', 'Your voluntary face signature is securely registered.', 'success');
  };

  const handleDeleteBiometrics = () => {
    removeFaceRegistration();
    setShowDeleteConfirm(false);
    setHasAgreedToCharter(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-white">Face ID &amp; Biometrics</span>
      </div>

      {/* Status Banner */}
      <div
        className={`p-4 rounded-3xl border ${
          isRegistered
            ? 'bg-slate-900 border-emerald-500/30'
            : 'bg-slate-900 border-amber-500/30'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isRegistered ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isRegistered ? 'Face ID Verified & Active' : 'Face Registration Pending'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRegistered
                  ? `Registered on ${new Date(currentUser?.faceRegistration.registeredAt || '').toLocaleDateString()}`
                  : 'Enroll your facial signature to enable consensual discovery.'}
              </p>
            </div>
          </div>
        </div>

        {isRegistered && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Landmark Token:</span>
            <span className="text-cyan-400">{currentUser?.faceRegistration.faceEmbeddingHash}</span>
          </div>
        )}
      </div>

      {/* Facial Registration Viewfinder */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          1. Facial Signature Capture
        </h3>

        <div className="relative aspect-square max-w-[240px] mx-auto rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center mb-4">
          {isCapturing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={capturedPhoto || currentUser?.avatarUrl}
              alt="Face ID Preview"
              className="w-full h-full object-cover"
            />
          )}

          {/* Alignment Oval Overlay */}
          <div className="absolute inset-0 border-2 border-dashed border-cyan-400/50 rounded-full m-4 pointer-events-none" />
        </div>

        <div className="flex justify-center gap-2">
          {!isCapturing ? (
            <button
              onClick={startCamera}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Use Webcam</span>
            </button>
          ) : (
            <button
              onClick={handleCapture}
              className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Face</span>
            </button>
          )}
        </div>
      </div>

      {/* Biometric Consent Agreement */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Lock className="w-4 h-4 text-violet-400" />
          <span>2. Consent &amp; Data Rights Charter</span>
        </div>

        <div className="space-y-2 text-[11px] text-slate-300">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <strong className="text-white block mb-0.5">Voluntary Registration:</strong>
            You are registering voluntarily. You can turn Face Discoverability OFF at any time without deleting your account.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <strong className="text-white block mb-0.5">Vector Encryption &amp; Privacy:</strong>
            Facial imagery is never sold, publicly published, or used to train third-party generative models.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <strong className="text-white block mb-0.5">Instant Deletion Right:</strong>
            Clicking &ldquo;Delete Biometrics&rdquo; permanently purges your landmark vectors from all active indices.
          </div>
        </div>

        <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasAgreedToCharter}
            onChange={(e) => setHasAgreedToCharter(e.target.checked)}
            className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0"
          />
          <span className="text-xs font-medium text-slate-200">
            I explicitly consent to biometric landmark hashing for voluntary in-person reconnects.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleRegisterFace}
          disabled={!hasAgreedToCharter || isProcessing}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-violet-950/40 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Landmark Hash...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{isRegistered ? 'Update Biometric Enrollment' : 'Enroll Biometric Face ID'}</span>
            </>
          )}
        </button>

        {isRegistered && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 font-semibold text-xs border border-rose-800/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Biometric Data &amp; Withdraw Consent</span>
          </button>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xs w-full p-5 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-950/80 border border-rose-800/60 rounded-full flex items-center justify-center mx-auto mb-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Purge Biometric Data?</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              This will permanently delete your facial landmark signature and disable Face Discoverability. Your username and profile will remain intact.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300"
              >
                Keep Face ID
              </button>
              <button
                onClick={handleDeleteBiometrics}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
