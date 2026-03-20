import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Hunt, Business, AuditResult, Preview, PipelineStats } from './types';

/* ─── Hunts ──────────────────────────────────── */

export async function createHunt(data: Omit<Hunt, 'id' | 'createdAt'>): Promise<string> {
  const ref = adminDb.collection('hunts').doc();
  await ref.set({ ...data, id: ref.id, auditsCompleted: 0, createdAt: FieldValue.serverTimestamp() });
  return ref.id;
}

export async function getHunt(huntId: string): Promise<Hunt | null> {
  const snap = await adminDb.collection('hunts').doc(huntId).get();
  return snap.exists ? (snap.data() as Hunt) : null;
}

export async function updateHunt(huntId: string, data: Partial<Hunt>) {
  await adminDb.collection('hunts').doc(huntId).update(data);
}

/**
 * Atomically increment the auditsCompleted counter on a hunt.
 * Returns the NEW value after increment. Only one caller will see it equal `total`.
 */
export async function incrementAuditCount(huntId: string): Promise<number> {
  const ref = adminDb.collection('hunts').doc(huntId);
  // Use a transaction to read-increment-write atomically
  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.data()?.auditsCompleted ?? 0;
    const next = current + 1;
    tx.update(ref, { auditsCompleted: next });
    return next;
  });
}

export async function getRecentHunts(max = 10): Promise<Hunt[]> {
  const snap = await adminDb.collection('hunts').orderBy('createdAt', 'desc').limit(max).get();
  return snap.docs.map(d => d.data() as Hunt);
}

/* ─── Businesses ─────────────────────────────── */

export async function saveBusiness(data: Omit<Business, 'id' | 'createdAt'>): Promise<string> {
  const ref = adminDb.collection('businesses').doc();
  await ref.set({ ...data, id: ref.id, createdAt: FieldValue.serverTimestamp() });
  return ref.id;
}

export async function getBusinessesByHunt(huntId: string): Promise<Business[]> {
  const snap = await adminDb.collection('businesses').where('huntId', '==', huntId).get();
  return snap.docs.map(d => d.data() as Business);
}

export async function getBusiness(id: string): Promise<Business | null> {
  const snap = await adminDb.collection('businesses').doc(id).get();
  return snap.exists ? (snap.data() as Business) : null;
}

/* ─── Audits ─────────────────────────────────── */

export async function saveAudit(data: Omit<AuditResult, 'id' | 'createdAt'>): Promise<string> {
  const ref = adminDb.collection('audits').doc();
  await ref.set({ ...data, id: ref.id, createdAt: FieldValue.serverTimestamp() });
  return ref.id;
}

export async function getAuditsByHunt(huntId: string): Promise<AuditResult[]> {
  const snap = await adminDb.collection('audits').where('huntId', '==', huntId).get();
  return snap.docs.map(d => d.data() as AuditResult);
}

export async function getAuditByBusiness(businessId: string): Promise<AuditResult | null> {
  const snap = await adminDb.collection('audits').where('businessId', '==', businessId).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as AuditResult);
}

export async function getAuditsByGrade(huntId: string, grade: 'A' | 'B' | 'C' | 'D'): Promise<AuditResult[]> {
  const snap = await adminDb.collection('audits')
    .where('huntId', '==', huntId)
    .where('grade', '==', grade)
    .get();
  return snap.docs.map(d => d.data() as AuditResult);
}

/* ─── Previews ───────────────────────────────── */

export async function savePreview(data: Omit<Preview, 'id' | 'createdAt'>): Promise<string> {
  const ref = adminDb.collection('previews').doc();
  await ref.set({ ...data, id: ref.id, createdAt: FieldValue.serverTimestamp() });
  return ref.id;
}

export async function getPreview(id: string): Promise<Preview | null> {
  const snap = await adminDb.collection('previews').doc(id).get();
  return snap.exists ? (snap.data() as Preview) : null;
}

export async function getPreviewBySlug(slug: string): Promise<Preview | null> {
  const snap = await adminDb.collection('previews').where('slug', '==', slug).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as Preview);
}

export async function getPreviewByBusiness(businessId: string): Promise<Preview | null> {
  const snap = await adminDb.collection('previews').where('businessId', '==', businessId).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as Preview);
}

export async function getPreviewsByHunt(huntId: string): Promise<Preview[]> {
  const snap = await adminDb.collection('previews').where('huntId', '==', huntId).get();
  return snap.docs.map(d => d.data() as Preview);
}

export async function updatePreview(id: string, data: Partial<Preview>) {
  await adminDb.collection('previews').doc(id).update(data);
}

export async function deletePreview(id: string) {
  await adminDb.collection('previews').doc(id).delete();
}

export async function getRecentPreviews(max = 20): Promise<Preview[]> {
  const snap = await adminDb.collection('previews').orderBy('createdAt', 'desc').limit(max).get();
  return snap.docs.map(d => d.data() as Preview);
}

export async function deleteHunt(huntId: string) {
  // Delete hunt + all related businesses, audits, and previews
  const batch = adminDb.batch();
  batch.delete(adminDb.collection('hunts').doc(huntId));

  const [businesses, audits, previews] = await Promise.all([
    adminDb.collection('businesses').where('huntId', '==', huntId).get(),
    adminDb.collection('audits').where('huntId', '==', huntId).get(),
    adminDb.collection('previews').where('huntId', '==', huntId).get(),
  ]);

  businesses.docs.forEach(d => batch.delete(d.ref));
  audits.docs.forEach(d => batch.delete(d.ref));
  previews.docs.forEach(d => batch.delete(d.ref));

  await batch.commit();
  return {
    businesses: businesses.size,
    audits: audits.size,
    previews: previews.size,
  };
}

/* ─── Pipeline stats ─────────────────────────── */

export async function getPipelineStats(): Promise<PipelineStats> {
  const [hunts, businesses, audits, previews] = await Promise.all([
    adminDb.collection('hunts').get(),
    adminDb.collection('businesses').get(),
    adminDb.collection('audits').get(),
    adminDb.collection('previews').get(),
  ]);

  const previewDocs = previews.docs.map(d => d.data() as Preview);

  return {
    totalHunts: hunts.size,
    totalBusinesses: businesses.size,
    totalAudited: audits.size,
    totalPreviews: previewDocs.length,
    totalSent: previewDocs.filter(p => p.status !== 'pending' && p.status !== 'built' && p.status !== 'approved').length,
    totalOpened: previewDocs.filter(p => ['opened', 'clicked', 'booked'].includes(p.status)).length,
    totalClicked: previewDocs.filter(p => ['clicked', 'booked'].includes(p.status)).length,
    totalBooked: previewDocs.filter(p => p.status === 'booked').length,
  };
}
