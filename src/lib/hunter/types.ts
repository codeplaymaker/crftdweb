import { Timestamp } from 'firebase/firestore';

/* ─── Hunt ───────────────────────────────────── */

export interface Hunt {
  id: string;
  niche: string;
  city: string;
  country: string;
  status: 'running' | 'complete' | 'error';
  businessCount: number;
  gradeCounts: { A: number; B: number; C: number; D: number };
  createdAt: Timestamp;
}

/* ─── Business ───────────────────────────────── */

export interface Business {
  id: string;
  huntId: string;
  name: string;
  website: string | null;
  phone: string | null;
  address: string;
  rating: number;
  reviewCount: number;
  placeId: string;
  types: string[];       // Google Places types (e.g. "plumber", "dentist")
  createdAt: Timestamp;
}

/* ─── Audit ──────────────────────────────────── */

export interface AuditResult {
  id: string;
  businessId: string;
  huntId: string;
  // PageSpeed
  performanceScore: number;    // 0–100
  lcp: number;                 // Largest Contentful Paint (ms)
  cls: number;                 // Cumulative Layout Shift
  fcp: number;                 // First Contentful Paint (ms)
  speedIndex: number;          // Speed Index (ms)
  mobile: boolean;             // Mobile-friendly
  https: boolean;              // Has SSL
  // Meta
  hasMetaDescription: boolean;
  hasOgTags: boolean;
  hasCTA: boolean;
  // Result
  grade: 'A' | 'B' | 'C' | 'D';
  gradeReason: string;
  screenshotUrl: string | null;
  createdAt: Timestamp;
}

/* ─── Preview ────────────────────────────────── */

export type PreviewStatus = 'pending' | 'built' | 'approved' | 'sent' | 'opened' | 'clicked' | 'booked';

export interface Preview {
  id: string;
  businessId: string;
  huntId: string;
  slug: string;                // URL slug: e.g. "johns-plumbing-london"
  previewUrl: string;
  // Generated copy
  headline: string;
  subheadline: string;
  painPoints: string[];
  services: string[];
  ctaText: string;
  // Outreach
  status: PreviewStatus;
  emailSentAt: Timestamp | null;
  emailOpenedAt: Timestamp | null;
  previewClickedAt: Timestamp | null;
  callBookedAt: Timestamp | null;
  createdAt: Timestamp;
}

/* ─── Pipeline summary ───────────────────────── */

export interface PipelineStats {
  totalHunts: number;
  totalBusinesses: number;
  totalAudited: number;
  totalPreviews: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalBooked: number;
}
