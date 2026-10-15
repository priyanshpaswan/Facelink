import type { MatchCandidate, UserProfile } from '../types/index.ts';
import { canSearchProfile, isUserDiscoverableByFace } from './privacyRules.ts';

export const MIN_FACE_CONFIDENCE_THRESHOLD = 0.85; // 85% match requirement
export const RATE_LIMIT_MAX_SEARCHES = 6; // Max 6 searches
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

/**
 * Checks client-side rate limiting to prevent bulk scraping or stalking.
 */
export function evaluateRateLimit(
  timestamps: number[],
  maxAllowed: number = RATE_LIMIT_MAX_SEARCHES,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
  now: number = Date.now()
): { allowed: boolean; remaining: number; waitTimeMs: number } {
  const windowStart = now - windowMs;
  const recentSearches = timestamps.filter((t) => t > windowStart);

  if (recentSearches.length >= maxAllowed) {
    const oldestInWindow = Math.min(...recentSearches);
    const waitTimeMs = Math.max(0, oldestInWindow + windowMs - now);
    return {
      allowed: false,
      remaining: 0,
      waitTimeMs,
    };
  }

  return {
    allowed: true,
    remaining: maxAllowed - recentSearches.length,
    waitTimeMs: 0,
  };
}

/**
 * Compares two embedding tokens / hashes and computes a cosine-like similarity ratio (0 to 1).
 */
export function calculateSimulatedSimilarity(
  queryFeatureToken: string,
  targetEmbeddingToken: string
): number {
  if (!queryFeatureToken || !targetEmbeddingToken) return 0;
  if (queryFeatureToken === targetEmbeddingToken) return 0.98;

  // Approximate similarity based on character overlap and hash distance
  let commonChars = 0;
  const minLen = Math.min(queryFeatureToken.length, targetEmbeddingToken.length);
  for (let i = 0; i < minLen; i++) {
    if (queryFeatureToken[i] === targetEmbeddingToken[i]) {
      commonChars++;
    }
  }

  const similarity = minLen > 0 ? commonChars / minLen : 0;
  return Number(similarity.toFixed(3));
}

/**
 * Evaluates candidate matching with complete privacy and consent verification.
 */
export function findConsentingFaceMatch(
  searchQueryToken: string,
  allProfiles: UserProfile[],
  currentUserId: string,
  userBlockedList: string[] = []
): { candidate: MatchCandidate | null; rejectedReason?: string } {
  // Check candidate pool
  for (const candidate of allProfiles) {
    // Cannot match self
    if (candidate.id === currentUserId) continue;

    // Cannot match users you blocked or who blocked you
    if (userBlockedList.includes(candidate.id)) continue;
    const canSearch = canSearchProfile(candidate, currentUserId);
    if (!canSearch.canSearch) continue;

    // Strict Consent & Discoverability check
    if (!isUserDiscoverableByFace(candidate)) {
      continue;
    }

    const targetToken = candidate.faceRegistration.faceEmbeddingHash;
    if (!targetToken) continue;

    const similarity = calculateSimulatedSimilarity(searchQueryToken, targetToken);

    if (similarity >= MIN_FACE_CONFIDENCE_THRESHOLD) {
      return {
        candidate: {
          user: candidate,
          confidence: similarity,
          matchedFeaturePoints: Math.floor(similarity * 128),
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  return {
    candidate: null,
    rejectedReason: 'NO_ELIGIBLE_CONSENTING_MATCH',
  };
}
