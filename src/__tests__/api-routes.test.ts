import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
vi.stubEnv('OPENAI_API_KEY', 'test-key');
vi.stubEnv('PERPLEXITY_API_KEY', 'test-perplexity-key');

// Mock Firebase Admin so auth guard verifies our test tokens
vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => [{}]),
  cert: vi.fn(),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({
    verifyIdToken: vi.fn(async (token: string) => {
      if (token === 'test-firebase-token-1234567890') {
        return { uid: 'test-user-123' };
      }
      throw new Error('Invalid token');
    }),
  })),
}));

const authHeaders = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer test-firebase-token-1234567890',
};

describe('API Route: /api/engine/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should require an agent ID and message', async () => {
    const { POST } = await import('@/app/api/engine/chat/route');
    const req = new Request('http://localhost/api/engine/chat', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}),
    });

    const response = await POST(req as any);
    expect(response.status).toBe(400);
  });

  it('should reject empty messages array', async () => {
    const { POST } = await import('@/app/api/engine/chat/route');
    const req = new Request('http://localhost/api/engine/chat', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ agentId: 'offer-architect', messages: [] }),
    });

    const response = await POST(req as any);
    expect(response.status).toBe(400);
  });

  it('should return 401 without auth token', async () => {
    const { POST } = await import('@/app/api/engine/chat/route');
    const req = new Request('http://localhost/api/engine/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: 'offer-architect', message: 'test' }),
    });

    const response = await POST(req as any);
    expect(response.status).toBe(401);
  });
});

describe('API Route: /api/engine/content', () => {
  it('should require content type and input', async () => {
    const { POST } = await import('@/app/api/engine/content/route');
    const req = new Request('http://localhost/api/engine/content', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}),
    });

    const response = await POST(req as any);
    expect(response.status).toBe(400);
  });

  it('should reject missing input field', async () => {
    const { POST } = await import('@/app/api/engine/content/route');
    const req = new Request('http://localhost/api/engine/content', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ type: 'vsl' }),
    });

    const response = await POST(req as any);
    expect(response.status).toBe(400);
  });
});

describe('API Route: /api/engine/offer-autofill', () => {
  it('should return error when OpenAI is unreachable', async () => {
    const { POST } = await import('@/app/api/engine/offer-autofill/route');
    const req = new Request('http://localhost/api/engine/offer-autofill', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({}),
    });

    const response = await POST(req as any);
    // Returns 500 because it proceeds to OpenAI call which fails in test
    expect(response.status).toBe(500);
  });
});
