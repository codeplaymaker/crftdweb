import {
  collection, doc, setDoc, getDoc, getDocs,
  updateDoc, query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Hunt, Business, AuditResult, Preview, PipelineStats } from './types';

/* ─── Hunts ──────────────────────────────────── */

export async function createHunt(data: Omit<Hunt, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'hunts'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getHunt(huntId: string): Promise<Hunt | null> {
  const snap = await getDoc(doc(db, 'hunts', huntId));
  return snap.exists() ? (snap.data() as Hunt) : null;
}

export async function updateHunt(huntId: string, data: Partial<Hunt>) {
  await updateDoc(doc(db, 'hunts', huntId), data);
}

export async function getRecentHunts(max = 10): Promise<Hunt[]> {
  const q = query(collection(db, 'hunts'), orderBy('createdAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Hunt);
}

/* ─── Businesses ─────────────────────────────── */

export async function saveBusiness(data: Omit<Business, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'businesses'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getBusinessesByHunt(huntId: string): Promise<Business[]> {
  const q = query(collection(db, 'businesses'), where('huntId', '==', huntId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Business);
}

export async function getBusiness(id: string): Promise<Business | null> {
  const snap = await getDoc(doc(db, 'businesses', id));
  return snap.exists() ? (snap.data() as Business) : null;
}

/* ─── Audits ─────────────────────────────────── */

export async function saveAudit(data: Omit<AuditResult, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'audits'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getAuditsByHunt(huntId: string): Promise<AuditResult[]> {
  const q = query(collection(db, 'audits'), where('huntId', '==', huntId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as AuditResult);
}

export async function getAuditByBusiness(businessId: string): Promise<AuditResult | null> {
  const q = query(collection(db, 'audits'), where('businessId', '==', businessId), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as AuditResult);
}

export async function getAuditsByGrade(huntId: string, grade: 'A' | 'B' | 'C' | 'D'): Promise<AuditResult[]> {
  const q = query(
    collection(db, 'audits'),
    where('huntId', '==', huntId),
    where('grade', '==', grade),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as AuditResult);
}

/* ─── Previews ───────────────────────────────── */

export async function savePreview(data: Omit<Preview, 'id' | 'createdAt'>): Promise<string> {
  const ref = doc(collection(db, 'previews'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getPreview(id: string): Promise<Preview | null> {
  const snap = await getDoc(doc(db, 'previews', id));
  return snap.exists() ? (snap.data() as Preview) : null;
}

export async function getPreviewBySlug(slug: string): Promise<Preview | null> {
  const q = query(collection(db, 'previews'), where('slug', '==', slug), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as Preview);
}

export async function getPreviewByBusiness(businessId: string): Promise<Preview | null> {
  const q = query(collection(db, 'previews'), where('businessId', '==', businessId), limit(1));
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as Preview);
}

export async function getPreviewsByHunt(huntId: string): Promise<Preview[]> {
  const q = query(collection(db, 'previews'), where('huntId', '==', huntId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Preview);
}

export async function updatePreview(id: string, data: Partial<Preview>) {
  await updateDoc(doc(db, 'previews', id), data);
}

/* ─── Pipeline stats ─────────────────────────── */

export async function getPipelineStats(): Promise<PipelineStats> {
  const [hunts, businesses, audits, previews] = await Promise.all([
    getDocs(collection(db, 'hunts')),
    getDocs(collection(db, 'businesses')),
    getDocs(collection(db, 'audits')),
    getDocs(collection(db, 'previews')),
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
