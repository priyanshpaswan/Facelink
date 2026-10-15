import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type {
  FaceRegistrationData,
  MatchCandidate,
  PrivacySettings,
  ReportSubmission,
  SocialLink,
  UserProfile,
} from '../types/index.ts';
import {
  INITIAL_CURRENT_USER,
  MOCK_COMMUNITY_USERS,
} from '../data/mockUsers.ts';
import {
  evaluateRateLimit,
  findConsentingFaceMatch,
  RATE_LIMIT_MAX_SEARCHES,
} from '../utils/faceMatching.ts';

export type ScreenId =
  | 'home'
  | 'search'
  | 'profile'
  | 'settings'
  | 'qr'
  | 'onboarding'
  | 'auth_login'
  | 'auth_signup'
  | 'auth_forgot'
  | 'face_registration'
  | 'match_found'
  | 'no_match'
  | 'edit_profile'
  | 'manage_social_links'
  | 'privacy_settings'
  | 'blocked_users'
  | 'safety_help'
  | 'view_user_profile';

interface AppContextType {
  currentUser: UserProfile | null;
  communityUsers: UserProfile[];
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  activeTab: 'home' | 'search' | 'profile' | 'settings';
  setActiveTab: (tab: 'home' | 'search' | 'profile' | 'settings') => void;
  lastMatchCandidate: MatchCandidate | null;
  setLastMatchCandidate: (c: MatchCandidate | null) => void;
  lastSearchMeta: { queryImage?: string; label?: string; reason?: string } | null;
  selectedUserForView: UserProfile | null;
  setSelectedUserForView: (u: UserProfile | null) => void;
  reports: ReportSubmission[];
  rateLimitRemaining: number;
  rateLimitWaitMs: number;
  notification: { title: string; message: string; type?: 'info' | 'success' | 'warn' | 'error' } | null;
  showNotification: (title: string, message: string, type?: 'info' | 'success' | 'warn' | 'error') => void;
  clearNotification: () => void;

  // Actions
  login: (email: string) => boolean;
  signup: (username: string, displayName: string, email: string) => boolean;
  logout: () => void;
  deleteAccount: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleFaceDiscoverability: (enabled: boolean) => void;
  updateFaceRegistration: (reg: Partial<FaceRegistrationData>) => void;
  removeFaceRegistration: () => void;
  addSocialLink: (link: Omit<SocialLink, 'id'>) => void;
  updateSocialLink: (id: string, updates: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  submitReport: (targetUserId: string, targetUsername: string, category: ReportSubmission['category'], description: string) => void;
  connectWithUser: (userId: string) => void;
  disconnectUser: (userId: string) => void;
  executeFaceSearch: (queryToken: string, queryImage?: string, label?: string) => { isMatch: boolean; candidate: MatchCandidate | null; error?: string };
  switchPersona: (userId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_USER = 'facelink_current_user_v2';
const STORAGE_KEY_COMMUNITY = 'facelink_community_users_v2';
const STORAGE_KEY_REPORTS = 'facelink_reports_v2';
const STORAGE_KEY_RATE_LIMIT = 'facelink_rate_limits_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CURRENT_USER;
  });

  const [communityUsers, setCommunityUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMUNITY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return MOCK_COMMUNITY_USERS;
  });

  const [reports, setReports] = useState<ReportSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [rateLimitTimestamps, setRateLimitTimestamps] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RATE_LIMIT);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'profile' | 'settings'>('home');
  const [lastMatchCandidate, setLastMatchCandidate] = useState<MatchCandidate | null>(null);
  const [lastSearchMeta, setLastSearchMeta] = useState<{ queryImage?: string; label?: string; reason?: string } | null>(null);
  const [selectedUserForView, setSelectedUserForView] = useState<UserProfile | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string; type?: 'info' | 'success' | 'warn' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMMUNITY, JSON.stringify(communityUsers));
  }, [communityUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RATE_LIMIT, JSON.stringify(rateLimitTimestamps));
  }, [rateLimitTimestamps]);

  const showNotification = (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    setNotification({ title, message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.title === title ? null : curr));
    }, 4000);
  };

  const clearNotification = () => setNotification(null);

  // Rate limit calculations
  const { allowed: isRateAllowed, remaining: rateLimitRemaining, waitTimeMs: rateLimitWaitMs } = useMemo(() => {
    return evaluateRateLimit(rateLimitTimestamps, RATE_LIMIT_MAX_SEARCHES);
  }, [rateLimitTimestamps]);

  // Auth actions
  const login = (email: string) => {
    const existing = communityUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      showNotification('Welcome back!', `Signed in as @${existing.username}`, 'success');
      setCurrentScreen('home');
      setActiveTab('home');
      return true;
    }
    // Fallback default
    setCurrentUser(INITIAL_CURRENT_USER);
    showNotification('Welcome back!', `Signed in as @${INITIAL_CURRENT_USER.username}`, 'success');
    setCurrentScreen('home');
    setActiveTab('home');
    return true;
  };

  const signup = (username: string, displayName: string, email: string) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username: username.replace('@', '').trim().toLowerCase(),
      displayName: displayName.trim(),
      email: email.trim().toLowerCase(),
      bio: 'New FaceLink Explorer. Ready to connect.',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80`,
      interests: ['Community', 'Tech', 'Networking'],
      faceRegistration: {
        isRegistered: false,
        consentAccepted: false,
      },
      privacy: {
        faceDiscoverability: false, // Default is OFF until face registration & explicit opt-in!
        allowUsernameSearch: true,
        allowQrScan: true,
        blurPhotosUntilMatch: false,
        notifyOnMatch: true,
        rateLimitProtected: true,
      },
      socialLinks: [],
      blockedUserIds: [],
      connections: [],
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);
    setCommunityUsers((prev) => [newUser, ...prev]);
    showNotification('Account Created!', 'Welcome to FaceLink. Register your face when you are ready.', 'success');
    setCurrentScreen('home');
    setActiveTab('home');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentScreen('onboarding');
    showNotification('Logged Out', 'You have been safely signed out.', 'info');
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const currentId = currentUser.id;
    setCommunityUsers((prev) => prev.filter((u) => u.id !== currentId));
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    showNotification('Account Deleted', 'All your profile and facial biometric records were purged permanently.', 'warn');
    setCurrentScreen('onboarding');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Profile Updated', 'Your changes have been saved.', 'success');
  };

  const toggleFaceDiscoverability = (enabled: boolean) => {
    if (!currentUser) return;
    if (enabled && (!currentUser.faceRegistration.isRegistered || !currentUser.faceRegistration.consentAccepted)) {
      showNotification('Registration Required', 'Please register your face and accept biometric consent before enabling discovery.', 'warn');
      setCurrentScreen('face_registration');
      return;
    }

    const updated: UserProfile = {
      ...currentUser,
      privacy: {
        ...currentUser.privacy,
        faceDiscoverability: enabled,
      },
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification(
      enabled ? 'Discoverability Enabled' : 'Discoverability Disabled',
      enabled
        ? 'Eligible people you meet in person can discover your approved links.'
        : 'You are now completely hidden from all face-matching searches.',
      enabled ? 'success' : 'info'
    );
  };

  const updateFaceRegistration = (reg: Partial<FaceRegistrationData>) => {
    if (!currentUser) return;
    const updatedReg = { ...currentUser.faceRegistration, ...reg };
    const updated: UserProfile = {
      ...currentUser,
      faceRegistration: updatedReg,
      // Auto-enable discoverability if user completed registration and consented
      privacy: {
        ...currentUser.privacy,
        faceDiscoverability: reg.isRegistered && reg.consentAccepted ? true : currentUser.privacy.faceDiscoverability,
      },
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  const removeFaceRegistration = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      faceRegistration: {
        isRegistered: false,
        consentAccepted: false,
        faceEmbeddingHash: undefined,
        photoUrl: undefined,
        registeredAt: undefined,
        consentAcceptedAt: undefined,
      },
      privacy: {
        ...currentUser.privacy,
        faceDiscoverability: false, // Must be disabled if face data is deleted
      },
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Biometric Data Purged', 'Your facial scan embedding has been permanently deleted.', 'warn');
  };

  const addSocialLink = (link: Omit<SocialLink, 'id'>) => {
    if (!currentUser) return;
    const newLink: SocialLink = {
      ...link,
      id: `sl_${Date.now()}`,
    };
    const updated = {
      ...currentUser,
      socialLinks: [...currentUser.socialLinks, newLink],
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Link Added', `${link.platform.toUpperCase()} profile added.`, 'success');
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    if (!currentUser) return;
    const updatedLinks = currentUser.socialLinks.map((l) => (l.id === id ? { ...l, ...updates } : l));
    const updated = { ...currentUser, socialLinks: updatedLinks };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Visibility Updated', 'Link preferences saved.', 'info');
  };

  const removeSocialLink = (id: string) => {
    if (!currentUser) return;
    const updatedLinks = currentUser.socialLinks.filter((l) => l.id !== id);
    const updated = { ...currentUser, socialLinks: updatedLinks };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Link Removed', 'Social profile disconnected.', 'info');
  };

  const blockUser = (userId: string) => {
    if (!currentUser) return;
    if (currentUser.blockedUserIds.includes(userId)) return;

    const updated = {
      ...currentUser,
      blockedUserIds: [...currentUser.blockedUserIds, userId],
      connections: currentUser.connections.filter((c) => c !== userId),
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('User Blocked', 'This user can no longer discover you or appear in your matches.', 'warn');
    setCurrentScreen('home');
  };

  const unblockUser = (userId: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      blockedUserIds: currentUser.blockedUserIds.filter((id) => id !== userId),
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('User Unblocked', 'User removed from your blocklist.', 'info');
  };

  const submitReport = (
    targetUserId: string,
    targetUsername: string,
    category: ReportSubmission['category'],
    description: string
  ) => {
    if (!currentUser) return;
    const newReport: ReportSubmission = {
      id: `rep_${Date.now()}`,
      targetUserId,
      targetUsername,
      reporterUserId: currentUser.id,
      category,
      description,
      timestamp: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    showNotification('Report Submitted', 'Thank you for keeping FaceLink safe. Our trust & safety team has logged this report.', 'success');
  };

  const connectWithUser = (userId: string) => {
    if (!currentUser) return;
    if (currentUser.connections.includes(userId)) return;
    const updated = {
      ...currentUser,
      connections: [...currentUser.connections, userId],
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Connection Saved', 'Added to your FaceLink Reconnect list.', 'success');
  };

  const disconnectUser = (userId: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      connections: currentUser.connections.filter((c) => c !== userId),
    };
    setCurrentUser(updated);
    setCommunityUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showNotification('Connection Removed', 'Profile removed from Reconnect list.', 'info');
  };

  const executeFaceSearch = (queryToken: string, queryImage?: string, label?: string) => {
    if (!currentUser) {
      return { isMatch: false, candidate: null, error: 'NOT_AUTHENTICATED' };
    }

    // Rate limit check
    const now = Date.now();
    const rateCheck = evaluateRateLimit(rateLimitTimestamps, RATE_LIMIT_MAX_SEARCHES, 10 * 60 * 1000, now);
    if (!rateCheck.allowed) {
      const waitMinutes = Math.ceil(rateCheck.waitTimeMs / 60000);
      showNotification('Rate Limit Protected', `For privacy and anti-stalking safety, please wait ${waitMinutes}m before scanning again.`, 'error');
      return { isMatch: false, candidate: null, error: 'RATE_LIMIT_EXCEEDED' };
    }

    // Record search timestamp
    setRateLimitTimestamps((prev) => [...prev, now]);

    // Search through community
    const matchOutcome = findConsentingFaceMatch(
      queryToken,
      communityUsers,
      currentUser.id,
      currentUser.blockedUserIds
    );

    setLastSearchMeta({
      queryImage,
      label,
      reason: matchOutcome.rejectedReason,
    });

    if (matchOutcome.candidate) {
      setLastMatchCandidate(matchOutcome.candidate);
      setCurrentScreen('match_found');
      return { isMatch: true, candidate: matchOutcome.candidate };
    } else {
      setLastMatchCandidate(null);
      setCurrentScreen('no_match');
      return { isMatch: false, candidate: null, error: matchOutcome.rejectedReason };
    }
  };

  const switchPersona = (userId: string) => {
    const target = communityUsers.find((u) => u.id === userId) || (userId === INITIAL_CURRENT_USER.id ? INITIAL_CURRENT_USER : null);
    if (target) {
      setCurrentUser(target);
      showNotification('Persona Switched', `Now previewing FaceLink as @${target.username}`, 'info');
    }
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_COMMUNITY);
    localStorage.removeItem(STORAGE_KEY_REPORTS);
    localStorage.removeItem(STORAGE_KEY_RATE_LIMIT);
    setCurrentUser(INITIAL_CURRENT_USER);
    setCommunityUsers(MOCK_COMMUNITY_USERS);
    setReports([]);
    setRateLimitTimestamps([]);
    setCurrentScreen('home');
    setActiveTab('home');
    showNotification('Reset to Demo Defaults', 'All settings and test profiles restored.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        communityUsers,
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        lastMatchCandidate,
        setLastMatchCandidate,
        lastSearchMeta,
        selectedUserForView,
        setSelectedUserForView,
        reports,
        rateLimitRemaining,
        rateLimitWaitMs,
        notification,
        showNotification,
        clearNotification,
        login,
        signup,
        logout,
        deleteAccount,
        updateProfile,
        toggleFaceDiscoverability,
        updateFaceRegistration,
        removeFaceRegistration,
        addSocialLink,
        updateSocialLink,
        removeSocialLink,
        blockUser,
        unblockUser,
        submitReport,
        connectWithUser,
        disconnectUser,
        executeFaceSearch,
        switchPersona,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
