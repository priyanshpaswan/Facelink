import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, clearNotification } = useApp();

  if (!notification) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warn: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderMap = {
    success: 'border-emerald-600/40 bg-slate-900/95',
    warn: 'border-amber-600/40 bg-slate-900/95',
    error: 'border-rose-600/40 bg-slate-900/95',
    info: 'border-cyan-600/40 bg-slate-900/95',
  };

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto pointer-events-none animate-in fade-in slide-in-from-top-2 duration-200">
      <div
        className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl backdrop-blur-xl flex items-start gap-3 ${
          borderMap[notification.type || 'info']
        }`}
      >
        {iconMap[notification.type || 'info']}
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-xs font-bold text-white tracking-wide">{notification.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={clearNotification}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
