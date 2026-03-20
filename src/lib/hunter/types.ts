import { Timestamp } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';

type TimestampLike = Timestamp | FieldValue;

/* ─── Hunt ───────────────────────────────────── */

export interface Hunt {
  id: string;
  niche: string;
  city: string;
  country: string;
  status: 'running' | 'complete' | 'error';
  businessCount: number;
  gradeCounts: { A: number; B: number; C: number; D: number };
  createdAt: TimestampLike;
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
  createdAt: TimestampLike;
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
  createdAt: TimestampLike;
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
  problemHeadline: string;
  problemSubheadline: string;
  painPoints: string[];
  services: string[];
  ctaText: string;
  // Outreach
  status: PreviewStatus;
  emailSentAt: TimestampLike | null;
  emailOpenedAt: TimestampLike | null;
  previewClickedAt: TimestampLike | null;
  callBookedAt: TimestampLike | null;
  createdAt: TimestampLike;
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
