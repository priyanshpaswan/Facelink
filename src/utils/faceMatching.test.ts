import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateRateLimit,
  calculateSimulatedSimilarity,
  findConsentingFaceMatch,
  MIN_FACE_CONFIDENCE_THRESHOLD,
} from './faceMatching.ts';
import type { UserProfile } from '../types/index.ts';

const mockBaseUser: UserProfile = {
  id: 'u-1',
  username: 'alex_rivers',
  email: 'alex@example.com',
  displayName: 'Alex Rivers',
  bio: 'Software Engineer & Photography',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  interests: ['Tech', 'Photography'],
  faceRegistration: {
    isRegistered: true,
    consentAccepted: true,
    faceEmbeddingHash: 'EMB_TOKEN_ALEX_12345678',
  },
  privacy: {
    faceDiscoverability: true,
    allowUsernameSearch: true,
    allowQrScan: true,
    blurPhotosUntilMatch: false,
    notifyOnMatch: true,
    rateLimitProtected: true,
  },
  socialLinks: [
    {
      id: 'sl-1',
      platform: 'instagram',
      username: 'alex.shoots',
      url: 'https://instagram.com/alex.shoots',
      visibility: 'public_face_match',
    },
  ],
  blockedUserIds: [],
  connections: [],
  createdAt: '2026-01-01T00:00:00.000Z',
};

test('rate limit allows searches within quota', () => {
  const now = 1000000;
  const timestamps = [now - 5000, now - 1000];
  const result = evaluateRateLimit(timestamps, 5, 60000, now);
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 3);
});

test('rate limit blocks when threshold is reached', () => {
  const now = 1000000;
  const timestamps = [now - 5000, now - 4000, now - 3000, now - 2000, now - 1000];
  const result = evaluateRateLimit(timestamps, 5, 60000, now);
  assert.equal(result.allowed, false);
  assert.equal(result.remaining, 0);
  assert.ok(result.waitTimeMs > 0);
});

test('similarity comparison yields high score for identical token', () => {
  const score = calculateSimulatedSimilarity('EMB_TOKEN_ALEX_12345678', 'EMB_TOKEN_ALEX_12345678');
  assert.ok(score >= MIN_FACE_CONFIDENCE_THRESHOLD);
});

test('matches consenting opted-in user with high confidence', () => {
  const matchResult = findConsentingFaceMatch(
    'EMB_TOKEN_ALEX_12345678',
    [mockBaseUser],
    'viewer-999',
    []
  );
  assert.ok(matchResult.candidate !== null);
  assert.equal(matchResult.candidate?.user.id, 'u-1');
});

test('never matches if candidate has disabled face discoverability', () => {
  const optedOutUser: UserProfile = {
    ...mockBaseUser,
    id: 'u-opted-out',
    privacy: {
      ...mockBaseUser.privacy,
      faceDiscoverability: false, // Turned OFF
    },
  };

  const matchResult = findConsentingFaceMatch(
    'EMB_TOKEN_ALEX_12345678',
    [optedOutUser],
    'viewer-999',
    []
  );
  assert.equal(matchResult.candidate, null);
  assert.equal(matchResult.rejectedReason, 'NO_ELIGIBLE_CONSENTING_MATCH');
});

test('never matches if candidate has not consented to face registration', () => {
  const noConsentUser: UserProfile = {
    ...mockBaseUser,
    id: 'u-no-consent',
    faceRegistration: {
      ...mockBaseUser.faceRegistration,
      consentAccepted: false,
    },
  };

  const matchResult = findConsentingFaceMatch(
    'EMB_TOKEN_ALEX_12345678',
    [noConsentUser],
    'viewer-999',
    []
  );
  assert.equal(matchResult.candidate, null);
});

test('never matches user who has blocked the searcher', () => {
  const blockingUser: UserProfile = {
    ...mockBaseUser,
    id: 'u-blocker',
    blockedUserIds: ['viewer-999'],
  };

  const matchResult = findConsentingFaceMatch(
    'EMB_TOKEN_ALEX_12345678',
    [blockingUser],
    'viewer-999',
    []
  );
  assert.equal(matchResult.candidate, null);
});
