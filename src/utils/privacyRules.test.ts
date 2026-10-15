import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isUserDiscoverableByFace,
  getPermittedSocialLinks,
  canSearchProfile,
} from './privacyRules.ts';
import type { SocialLink, UserProfile } from '../types/index.ts';

const testLinks: SocialLink[] = [
  {
    id: 'l-1',
    platform: 'instagram',
    username: 'public_insta',
    url: 'https://instagram.com/public_insta',
    visibility: 'public_face_match',
  },
  {
    id: 'l-2',
    platform: 'linkedin',
    username: 'pro_linked',
    url: 'https://linkedin.com/in/pro_linked',
    visibility: 'qr_only',
  },
  {
    id: 'l-3',
    platform: 'snapchat',
    username: 'secret_snap',
    url: 'https://snapchat.com/add/secret_snap',
    visibility: 'hidden',
  },
  {
    id: 'l-4',
    platform: 'discord',
    username: 'gamer_tag#0001',
    url: 'https://discord.gg/profile',
    visibility: 'mutual_only',
  },
];

test('getPermittedSocialLinks filters links for face_match without mutual connection', () => {
  const visible = getPermittedSocialLinks(testLinks, 'face_match', false);
  assert.equal(visible.length, 1);
  assert.equal(visible[0].platform, 'instagram');
});

test('getPermittedSocialLinks includes mutual_only when isMutualConnection is true', () => {
  const visible = getPermittedSocialLinks(testLinks, 'face_match', true);
  assert.equal(visible.length, 2);
  const platforms = visible.map((l) => l.platform);
  assert.ok(platforms.includes('instagram'));
  assert.ok(platforms.includes('discord'));
  assert.ok(!platforms.includes('snapchat')); // hidden remains hidden
});

test('getPermittedSocialLinks includes qr_only when context is qr_scan', () => {
  const visible = getPermittedSocialLinks(testLinks, 'qr_scan', false);
  const platforms = visible.map((l) => l.platform);
  assert.ok(platforms.includes('instagram'));
  assert.ok(platforms.includes('linkedin'));
  assert.ok(!platforms.includes('snapchat'));
});

test('isUserDiscoverableByFace checks all three security flags', () => {
  const profile: UserProfile = {
    id: 'p1',
    username: 'user1',
    email: 'u1@test.com',
    displayName: 'User One',
    bio: '',
    avatarUrl: '',
    interests: [],
    faceRegistration: { isRegistered: true, consentAccepted: true },
    privacy: {
      faceDiscoverability: true,
      allowUsernameSearch: true,
      allowQrScan: true,
      blurPhotosUntilMatch: false,
      notifyOnMatch: true,
      rateLimitProtected: true,
    },
    socialLinks: [],
    blockedUserIds: [],
    connections: [],
    createdAt: '',
  };

  assert.equal(isUserDiscoverableByFace(profile), true);

  profile.privacy.faceDiscoverability = false;
  assert.equal(isUserDiscoverableByFace(profile), false);

  profile.privacy.faceDiscoverability = true;
  profile.faceRegistration.consentAccepted = false;
  assert.equal(isUserDiscoverableByFace(profile), false);

  profile.faceRegistration.consentAccepted = true;
  profile.faceRegistration.isRegistered = false;
  assert.equal(isUserDiscoverableByFace(profile), false);
});

test('canSearchProfile prevents self-search and blocked search', () => {
  const target: UserProfile = {
    id: 'target-1',
    username: 'target',
    email: 't@test.com',
    displayName: 'Target User',
    bio: '',
    avatarUrl: '',
    interests: [],
    faceRegistration: { isRegistered: true, consentAccepted: true },
    privacy: {
      faceDiscoverability: true,
      allowUsernameSearch: true,
      allowQrScan: true,
      blurPhotosUntilMatch: false,
      notifyOnMatch: true,
      rateLimitProtected: true,
    },
    socialLinks: [],
    blockedUserIds: ['blocked-user-id'],
    connections: [],
    createdAt: '',
  };

  assert.equal(canSearchProfile(target, 'target-1').canSearch, false);
  assert.equal(canSearchProfile(target, 'blocked-user-id').canSearch, false);
  assert.equal(canSearchProfile(target, 'friendly-user-id').canSearch, true);
});
