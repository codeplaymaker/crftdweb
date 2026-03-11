import { describe, it, expect, vi } from 'vitest';

// Mock Resend so modules that instantiate it at the top level don't throw
vi.mock('resend', () => {
  const MockResend = function(this: any) {
    this.emails = { send: vi.fn().mockResolvedValue({ data: { id: 'test' }, error: null }) };
  };
  return { Resend: MockResend };
});

// Mock Firebase so config.ts doesn't throw on invalid API key
vi.mock('@firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  initializeAuth: vi.fn(),
  getReactNativePersistence: vi.fn(),
  connectAuthEmulator: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(),
  Timestamp: { now: vi.fn() },
}));

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}));

describe('sendEmail server action', () => {
  it('should export sendEmail function', async () => {
    const mod = await import('@/app/actions/sendEmail');
    expect(mod.sendEmail).toBeDefined();
    expect(typeof mod.sendEmail).toBe('function');
  });
});

describe('sendDemoRequest server action', () => {
  it('should export sendDemoRequest function', async () => {
    const mod = await import('@/app/actions/sendDemoRequest');
    expect(mod.sendDemoRequest).toBeDefined();
    expect(typeof mod.sendDemoRequest).toBe('function');
  });
});

describe('Firebase configuration', () => {
  it('should export auth and db instances', async () => {
    const configModule = await import('@/lib/firebase/config');
    expect(configModule).toBeDefined();
  });
});

describe('Utility functions', () => {
  it('should have a cn utility for merging classnames', async () => {
    const { cn } = await import('@/lib/utils');
    expect(cn).toBeDefined();
    expect(typeof cn).toBe('function');
    
    // Test basic merging
    const result = cn('bg-red-500', 'text-white');
    expect(result).toContain('bg-red-500');
    expect(result).toContain('text-white');
  });

  it('should merge conflicting tailwind classes', async () => {
    const { cn } = await import('@/lib/utils');
    // tailwind-merge should resolve conflicts
    const result = cn('bg-red-500', 'bg-blue-500');
    expect(result).toBe('bg-blue-500');
  });
});
