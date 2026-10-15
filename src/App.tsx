/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Navigation } from './components/common/Navigation.tsx';
import { NotificationToast } from './components/common/NotificationToast.tsx';
import { OnboardingScreen } from './components/screens/OnboardingScreen.tsx';
import { AuthScreen } from './components/screens/AuthScreen.tsx';
import { HomeScreen } from './components/screens/HomeScreen.tsx';
import { FaceSearchScreen } from './components/screens/FaceSearchScreen.tsx';
import { MatchFoundScreen } from './components/screens/MatchFoundScreen.tsx';
import { NoMatchScreen } from './components/screens/NoMatchScreen.tsx';
import { FaceRegistrationScreen } from './components/screens/FaceRegistrationScreen.tsx';
import { ProfileScreen } from './components/screens/ProfileScreen.tsx';
import { EditProfileScreen } from './components/screens/EditProfileScreen.tsx';
import { SocialLinksManagerScreen } from './components/screens/SocialLinksManagerScreen.tsx';
import { PrivacySettingsScreen } from './components/screens/PrivacySettingsScreen.tsx';
import { BlockedUsersScreen } from './components/screens/BlockedUsersScreen.tsx';
import { SafetyHelpScreen } from './components/screens/SafetyHelpScreen.tsx';
import { QRCodeModal } from './components/screens/QRCodeModal.tsx';
import { ViewUserProfileScreen } from './components/screens/ViewUserProfileScreen.tsx';

const AppContent: React.FC = () => {
  const { currentScreen, setCurrentScreen, currentUser } = useApp();

  // Support ?autostart=1 query param (Ultra Mode testability requirement)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && currentScreen === 'onboarding') {
      setCurrentScreen('home');
    }
  }, [currentScreen, setCurrentScreen]);

  // If user is not logged in and not already in an auth screen, show onboarding
  const isAuthOrOnboarding = [
    'onboarding',
    'auth_login',
    'auth_signup',
    'auth_forgot',
  ].includes(currentScreen);

  if (!currentUser && !isAuthOrOnboarding) {
    return <OnboardingScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'auth_login':
        return <AuthScreen initialMode="login" />;
      case 'auth_signup':
        return <AuthScreen initialMode="signup" />;
      case 'auth_forgot':
        return <AuthScreen initialMode="forgot" />;
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <FaceSearchScreen />;
      case 'match_found':
        return <MatchFoundScreen />;
      case 'no_match':
        return <NoMatchScreen />;
      case 'face_registration':
        return <FaceRegistrationScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'edit_profile':
        return <EditProfileScreen />;
      case 'manage_social_links':
        return <SocialLinksManagerScreen />;
      case 'privacy_settings':
      case 'settings':
        return <PrivacySettingsScreen />;
      case 'blocked_users':
        return <BlockedUsersScreen />;
      case 'safety_help':
        return <SafetyHelpScreen />;
      case 'qr':
        return <QRCodeModal onClose={() => setCurrentScreen('home')} />;
      case 'view_user_profile':
        return <ViewUserProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showHeaderAndNav =
    currentUser && !['onboarding', 'auth_login', 'auth_signup', 'auth_forgot'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <NotificationToast />
      {showHeaderAndNav && <Header />}
      <main className="flex-1 w-full max-w-md mx-auto relative">{renderScreen()}</main>
      {showHeaderAndNav && <Navigation />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
