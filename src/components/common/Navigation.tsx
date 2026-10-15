import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Home, ScanFace, User, Settings, QrCode } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, activeTab, setActiveTab, currentUser } = useApp();

  if (!currentUser) return null;

  // Don't show bottom nav on full-screen flows like onboarding or scan-camera modal
  if (currentScreen === 'onboarding') return null;

  const handleNav = (tab: 'home' | 'search' | 'profile' | 'settings' | 'qr') => {
    if (tab === 'qr') {
      setCurrentScreen('qr');
      return;
    }
    setActiveTab(tab);
    setCurrentScreen(tab);
  };

  const navItems: Array<{
    id: 'home' | 'search' | 'profile' | 'settings' | 'qr';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    isSpecial?: boolean;
  }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Face Search', icon: ScanFace, isSpecial: true },
    { id: 'qr', label: 'My QR', icon: QrCode },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'qr'
              ? currentScreen === 'qr'
              : currentScreen === item.id || (activeTab === item.id && ['match_found', 'no_match', 'edit_profile', 'manage_social_links', 'privacy_settings', 'blocked_users', 'safety_help'].includes(currentScreen) === false);

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className="relative -top-3 flex flex-col items-center group cursor-pointer focus:outline-none"
                aria-label="Face Search Scanner"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-violet-500/40 text-white'
                      : 'bg-gradient-to-tr from-violet-700/80 to-indigo-600/80 hover:from-violet-600 hover:to-cyan-500 shadow-violet-900/30 text-white'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-semibold text-violet-300 mt-1">Search</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer focus:outline-none ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
