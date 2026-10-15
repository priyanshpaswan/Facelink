export type SocialPlatform =
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'x'
  | 'snapchat'
  | 'tiktok'
  | 'github'
  | 'discord'
  | 'telegram'
  | 'website';

export type VisibilityLevel = 'public_face_match' | 'qr_only' | 'mutual_only' | 'hidden';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  username: string;
  url: string;
  visibility: VisibilityLevel; // User decides whether this appears in face search
}

export interface FaceRegistrationData {
  isRegistered: boolean;
  registeredAt?: string;
  faceEmbeddingHash?: string; // Simulated encrypted landmark signature
  photoUrl?: string;
  consentAccepted: boolean;
  consentAcceptedAt?: string;
}

export interface PrivacySettings {
  faceDiscoverability: boolean; // Master ON/OFF toggle
  allowUsernameSearch: boolean;
  allowQrScan: boolean;
  blurPhotosUntilMatch: boolean;
  notifyOnMatch: boolean;
  rateLimitProtected: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  interests: string[];
  recentMeetupContext?: string; // e.g. "College Campus", "Tech Summit", "Coffee Shop"
  faceRegistration: FaceRegistrationData;
  privacy: PrivacySettings;
  socialLinks: SocialLink[];
  blockedUserIds: string[];
  connections: string[]; // Connected user IDs
  createdAt: string;
}

export interface MatchCandidate {
  user: UserProfile;
  confidence: number;
  matchedFeaturePoints: number;
  timestamp: string;
}

export type ScanStatus =
  | 'idle'
  | 'requesting_permission'
  | 'permission_denied'
  | 'capturing'
  | 'analyzing'
  | 'verifying_consent'
  | 'match_found'
  | 'no_match';

export interface ReportSubmission {
  id: string;
  targetUserId: string;
  targetUsername: string;
  reporterUserId: string;
  category: 'incorrect_match' | 'harassment' | 'unauthorized_photo' | 'stalking_suspicion' | 'other';
  description: string;
  timestamp: string;
}
