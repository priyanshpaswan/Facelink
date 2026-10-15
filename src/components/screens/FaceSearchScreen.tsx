import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Camera,
  ScanFace,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Upload,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { DEMO_SEARCH_TARGETS, DemoPresetMatch } from '../../data/mockUsers.ts';

export const FaceSearchScreen: React.FC = () => {
  const {
    currentUser,
    executeFaceSearch,
    rateLimitRemaining,
    rateLimitWaitMs,
    showNotification,
    setCurrentScreen,
  } = useApp();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [selectedDemoTarget, setSelectedDemoTarget] = useState<DemoPresetMatch | null>(
    DEMO_SEARCH_TARGETS[0]
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(DEMO_SEARCH_TARGETS[0].image);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('Ready to scan');
  const [scanProgress, setScanProgress] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera access
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsCameraActive(true);
      showNotification('Camera Enabled', 'Point camera at consenting person to match.', 'info');
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      setHasPermission(false);
      setIsCameraActive(false);
      showNotification(
        'Camera Permission',
        'Camera not accessible in this environment. You can use preset test portraits or upload a photo.',
        'warn'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCaptureFromCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      setSelectedDemoTarget(null);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setSelectedDemoTarget(null);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const runMatchingPipeline = async (tokenToMatch: string, imageToUse: string, label: string) => {
    if (rateLimitRemaining <= 0) {
      showNotification('Rate Limit Protected', 'Please wait before performing more scans.', 'error');
      return;
    }

    setIsScanning(true);
    setScanProgress(15);
    setScanStep('Detecting face & landmarks...');

    await new Promise((r) => setTimeout(r, 600));
    setScanProgress(45);
    setScanStep('Extracting encrypted feature embeddings...');

    await new Promise((r) => setTimeout(r, 600));
    setScanProgress(75);
    setScanStep('Querying voluntary consent registry...');

    await new Promise((r) => setTimeout(r, 600));
    setScanProgress(95);
    setScanStep('Verifying discoverability & privacy flags...');

    await new Promise((r) => setTimeout(r, 400));
    setIsScanning(false);
    setScanProgress(100);

    // Call context matching execution
    executeFaceSearch(tokenToMatch, imageToUse, label);
  };

  const handleStartScan = () => {
    if (selectedDemoTarget) {
      runMatchingPipeline(
        selectedDemoTarget.token,
        selectedDemoTarget.image,
        selectedDemoTarget.label
      );
    } else if (capturedImage) {
      // Simulate real custom scan: if user took camera picture or uploaded, match against first consenting user as demo
      runMatchingPipeline(
        'EMB_JORDAN_TAYLOR_7721A',
        capturedImage,
        'Live Camera Capture'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-28 space-y-4">
      {/* Top Banner & Anti-Stalking Warning */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-950/60 to-slate-900 border border-violet-800/50 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <h3 className="font-bold text-white">FaceLink Consent Protocol Active</h3>
          <p className="text-slate-300 mt-0.5 text-[11px] leading-relaxed">
            Only users who opted into Face Discoverability can be discovered. Search photos are never stored. Always ask for permission before scanning someone in real life.
          </p>
        </div>
      </div>

      {/* Main Viewfinder Card */}
      <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="relative aspect-square w-full bg-slate-900 flex items-center justify-center overflow-hidden">
          {/* Live Camera Feed */}
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Scan Target"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-500">
              <ScanFace className="w-16 h-16 mx-auto mb-2 text-slate-700" />
              <p className="text-xs">Select a test persona or activate camera</p>
            </div>
          )}

          {/* Futuristic Scanner HUD Overlays */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Corner reticle brackets */}
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <div className="w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            </div>

            {/* Center Landmark Grid Target */}
            <div className="self-center relative flex items-center justify-center">
              <div
                className={`w-48 h-48 rounded-full border border-dashed transition-all ${
                  isScanning
                    ? 'border-cyan-400 animate-[spin_8s_linear_infinite] shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'border-violet-500/40'
                }`}
              />

              {/* Facial landmark points */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-28 h-28">
                  {/* Eyes */}
                  <span className="absolute top-8 left-6 w-2 h-2 rounded-full bg-cyan-400/80 animate-ping" />
                  <span className="absolute top-8 right-6 w-2 h-2 rounded-full bg-cyan-400/80 animate-ping" />
                  {/* Nose */}
                  <span className="absolute top-14 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {/* Mouth */}
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-cyan-400/60" />
                </div>
              </div>

              {/* Scanning Laser Beam */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[bounce_1.5s_infinite]" />
              )}
            </div>

            <div className="flex justify-between items-end">
              <div className="w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              <div className="w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
            </div>
          </div>

          {/* Scanning Status Badge */}
          {isScanning && (
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 border border-cyan-500/50 backdrop-blur-md rounded-2xl p-3 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {scanStep}
                </span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Viewfinder Controls Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={requestCameraPermission}
                className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Camera</span>
              </button>
            ) : (
              <button
                onClick={handleCaptureFromCamera}
                className="py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap Photo</span>
              </button>
            )}

            <label className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-violet-400" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-[11px] text-slate-400">
            Searches:{' '}
            <strong className={rateLimitRemaining > 1 ? 'text-cyan-400' : 'text-rose-400'}>
              {rateLimitRemaining}/6
            </strong>
          </div>
        </div>
      </div>

      {/* Primary Scan Button */}
      <button
        onClick={handleStartScan}
        disabled={isScanning || (!capturedImage && !selectedDemoTarget)}
        className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-violet-950/60 transition-all cursor-pointer active:scale-[0.99]"
      >
        <ScanFace className="w-5 h-5 stroke-[2.2]" />
        <span>{isScanning ? 'Processing Face Signature...' : 'Match Opted-In Profile'}</span>
      </button>

      {/* Interactive Testing Presets Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Interactive Demo Profiles</span>
          </div>
          <span className="text-[10px] text-slate-400">Tap to load &amp; test privacy rules</span>
        </div>

        <div className="space-y-2">
          {DEMO_SEARCH_TARGETS.map((target) => {
            const isSelected = selectedDemoTarget?.label === target.label;
            const isOptedOut = target.expectedOutcome === 'no_match_opted_out';
            const isStranger = target.expectedOutcome === 'no_match_stranger';

            return (
              <div
                key={target.label}
                onClick={() => {
                  setSelectedDemoTarget(target);
                  setCapturedImage(target.image);
                  stopCamera();
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-950/40 border-cyan-400 ring-1 ring-cyan-400/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={target.image}
                    alt={target.label}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{target.label}</h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          target.expectedOutcome === 'match'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : isOptedOut
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {target.expectedOutcome === 'match'
                          ? 'Opted In'
                          : isOptedOut
                          ? 'Opted Out'
                          : 'Non-User'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{target.subtitle}</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight line-clamp-1">
                      {target.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
