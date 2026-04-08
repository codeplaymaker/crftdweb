/**
 * Inbound Webhook — Test Suite
 *
 * Covers:
 * - Webhook signature verification
 * - Event type filtering (only email.received)
 * - Tagged reply-to address parsing (reply-{leadId}@eanexuekro.resend.app)
 * - Lead lookup and reply storage in Firestore
 * - Email content fetching (text, html, raw fallback)
 * - GET endpoint for verification
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Environment ────────────────────────────────────────────────────────────

vi.stubEnv('RESEND_API_KEY', 'test-resend-key');
vi.stubEnv('RESEND_WEBHOOK_SECRET', 'whsec_test_secret_1234567890');

// ─── Mock Svix ──────────────────────────────────────────────────────────────

const mockVerify = vi.fn();
vi.mock('svix', () => {
  class MockWebhook {
    verify(...args: unknown[]) {
      return mockVerify(...args);
    }
  }
  return { Webhook: MockWebhook };
});

// ─── Mock Firebase Admin ────────────────────────────────────────────────────

const mockBatchSet = vi.fn();
const mockBatchUpdate = vi.fn();
const mockBatchCommit = vi.fn();

const mockLeadDoc = {
  exists: true,
  data: () => ({ repId: 'rep-123', businessName: 'PLUMBS' }),
};

const mockCollection = vi.fn();
const mockDoc = vi.fn();

vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApps: vi.fn(() => [{}]),
  cert: vi.fn(),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  FieldValue: { serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP') },
}));

vi.mock('@/lib/firebase/admin', () => ({
  adminDb: {
    collection: (name: string) => {
      mockCollection(name);
      return {
        doc: (id?: string) => {
          mockDoc(id);
          return {
            get: vi.fn(async () => {
              if (name === 'repLeads') return mockLeadDoc;
              return { exists: false };
            }),
            id: id || 'auto-reply-id',
          };
        },
      };
    },
    batch: () => ({
      set: mockBatchSet,
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    }),
  },
  adminAuth: {},
}));

// ─── Mock global fetch for Resend email content API ─────────────────────────

const mockFetchResponse = {
  ok: true,
  json: async () => ({
    text: 'Hi I want my site changed',
    html: '<p>Hi I want my site changed</p>',
  }),
  text: async () => '',
};

vi.stubGlobal('fetch', vi.fn(async () => mockFetchResponse));

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeWebhookRequest(body: object, headers?: Record<string, string>) {
  return new Request('http://localhost:3000/api/webhooks/resend-inbound', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'svix-id': 'msg_test123',
      'svix-timestamp': '1712534400',
      'svix-signature': 'v1,testsig',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function makeInboundEvent(overrides: Record<string, unknown> = {}) {
  return {
    type: 'email.received',
    data: {
      email_id: 'email-abc-123',
      from: 'prospect@example.com',
      to: ['reply-LlameOqY6ByK7hrVQoWd@eanexuekro.resend.app'],
      subject: 'Re: your website',
      ...overrides,
    },
  };
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('Inbound Webhook: GET /api/webhooks/resend-inbound', () => {
  it('returns ok with configured status', async () => {
    const { GET } = await import('@/app/api/webhooks/resend-inbound/route');
    const res = await GET();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.endpoint).toBe('resend-inbound-webhook');
    expect(json.configured).toBe(true);
  });
});

describe('Inbound Webhook: POST /api/webhooks/resend-inbound', () => {
  let POST: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockVerify.mockReturnValue(undefined); // signature valid
    mockBatchCommit.mockResolvedValue(undefined);
    const mod = await import('@/app/api/webhooks/resend-inbound/route');
    POST = mod.POST as unknown as (req: Request) => Promise<Response>;
  });

  it('rejects invalid signature with 400', async () => {
    mockVerify.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const req = makeWebhookRequest(makeInboundEvent());
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Invalid signature');
  });

  it('ignores non email.received events', async () => {
    const req = makeWebhookRequest({ type: 'email.sent', data: {} });
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(mockCollection).not.toHaveBeenCalled();
  });

  it('skips emails without tagged reply-to address', async () => {
    const req = makeWebhookRequest(makeInboundEvent({
      to: ['hello@crftdweb.com'],
    }));
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.skipped).toBe(true);
    expect(mockBatchCommit).not.toHaveBeenCalled();
  });

  it('skips if lead does not exist', async () => {
    // Override the mock to return non-existent lead
    const origMockLeadExists = mockLeadDoc.exists;
    mockLeadDoc.exists = false;

    const req = makeWebhookRequest(makeInboundEvent());
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(json.skipped).toBe(true);
    expect(mockBatchCommit).not.toHaveBeenCalled();

    mockLeadDoc.exists = origMockLeadExists;
  });

  it('stores reply in Firestore with content from Resend API', async () => {
    const req = makeWebhookRequest(makeInboundEvent());
    const res = await POST(req as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.replyId).toBeDefined();

    // Verify batch operations
    expect(mockBatchSet).toHaveBeenCalledOnce();
    expect(mockBatchUpdate).toHaveBeenCalledOnce();
    expect(mockBatchCommit).toHaveBeenCalledOnce();

    // Check the reply data
    const setCall = mockBatchSet.mock.calls[0];
    const replyData = setCall[1];
    expect(replyData.leadId).toBe('LlameOqY6ByK7hrVQoWd');
    expect(replyData.repId).toBe('rep-123');
    expect(replyData.from).toBe('prospect@example.com');
    expect(replyData.subject).toBe('Re: your website');
    expect(replyData.textBody).toBe('Hi I want my site changed');
    expect(replyData.htmlBody).toBe('<p>Hi I want my site changed</p>');
    expect(replyData.resendEmailId).toBe('email-abc-123');
  });

  it('fetches email content from Resend Received Emails API', async () => {
    const req = makeWebhookRequest(makeInboundEvent());
    await POST(req as any);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.resend.com/emails/receiving/email-abc-123',
      { headers: { Authorization: 'Bearer test-resend-key' } }
    );
  });

  it('falls back to raw download when text/html are empty', async () => {
    // Mock fetch to return empty text/html but with raw download_url
    const rawContent = 'Content-Type: text/plain\r\n\r\nHi from raw email body';
    (fetch as any).mockImplementation(async (url: string) => {
      if (url.includes('/emails/receiving/')) {
        return {
          ok: true,
          json: async () => ({
            text: '',
            html: '',
            raw: { download_url: 'https://resend.com/raw/abc123' },
          }),
          text: async () => '',
        };
      }
      // Raw download URL
      return {
        ok: true,
        text: async () => rawContent,
      };
    });

    const req = makeWebhookRequest(makeInboundEvent());
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(mockBatchSet).toHaveBeenCalledOnce();

    const replyData = mockBatchSet.mock.calls[0][1];
    expect(replyData.textBody).toBe('Hi from raw email body');
  });

  it('still stores reply even if email content fetch fails', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const req = makeWebhookRequest(makeInboundEvent());
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.ok).toBe(true);
    expect(mockBatchSet).toHaveBeenCalledOnce();
    expect(mockBatchCommit).toHaveBeenCalledOnce();

    // Body should be empty but reply still recorded
    const replyData = mockBatchSet.mock.calls[0][1];
    expect(replyData.textBody).toBe('');
    expect(replyData.htmlBody).toBe('');
  });

  it('extracts leadId from various tagged address formats', async () => {
    // Test with "Name <email>" format
    const req = makeWebhookRequest(makeInboundEvent({
      to: ['CrftdWeb <reply-ABC123xyz@eanexuekro.resend.app>'],
    }));
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.ok).toBe(true);
    const replyData = mockBatchSet.mock.calls[0][1];
    expect(replyData.leadId).toBe('ABC123xyz');
  });

  it('updates lead with lastRepliedAt timestamp', async () => {
    const req = makeWebhookRequest(makeInboundEvent());
    await POST(req as any);

    expect(mockBatchUpdate).toHaveBeenCalledOnce();
    const updateCall = mockBatchUpdate.mock.calls[0];
    const updateData = updateCall[1];
    expect(updateData.lastRepliedAt).toBe('SERVER_TIMESTAMP');
    expect(updateData.updatedAt).toBe('SERVER_TIMESTAMP');
  });
});
