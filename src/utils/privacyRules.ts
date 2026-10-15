import type { SocialLink, UserProfile, VisibilityLevel } from '../types/index.ts';

/**
 * Validates whether a user's profile is discoverable via face search.
 * Enforces strict consent and privacy rules.
 */
export function isUserDiscoverableByFace(user: UserProfile): boolean {
  if (!user.faceRegistration?.isRegistered) {
    return false;
  }
  if (!user.faceRegistration?.consentAccepted) {
    return false;
  }
  if (!user.privacy?.faceDiscoverability) {
    return false;
  }
  return true;
}

/**
 * Filters a user's social links based on the viewer's discovery context
 * and the owner's granular visibility permissions.
 */
export function getPermittedSocialLinks(
  links: SocialLink[],
  context: 'face_match' | 'qr_scan' | 'profile_view',
  isMutualConnection: boolean
): SocialLink[] {
  if (!links || !Array.isArray(links)) return [];

  return links.filter((link) => {
    if (!link.url || !link.username) return false;

    // Explicitly hidden links never appear
    if (link.visibility === 'hidden') {
      return false;
    }

    // Mutual only links require existing connection
    if (link.visibility === 'mutual_only') {
      return isMutualConnection;
    }

    // QR only links appear only when scanned via direct QR code
    if (link.visibility === 'qr_only') {
      return context === 'qr_scan';
    }

    // Public face match links appear in face search, QR, and profile views
    if (link.visibility === 'public_face_match') {
      return true;
    }

    return false;
  });
}

/**
 * Checks if a target user can be searched or interacted with by the current user.
 */
export function canSearchProfile(
  targetUser: UserProfile,
  currentUserId: string
): { canSearch: boolean; error?: string } {
  if (targetUser.id === currentUserId) {
    return { canSearch: false, error: 'CANNOT_SEARCH_SELF' };
  }

  // Check reciprocal block
  if (targetUser.blockedUserIds?.includes(currentUserId)) {
    return { canSearch: false, error: 'USER_BLOCKED' };
  }

  return { canSearch: true };
}
