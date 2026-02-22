import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro' | 'agency';
  credits: number;
  agentUsage: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RedditQuote {
  quote: string;
  subreddit: string;
  context: string;
}

export interface TruthReport {
  id: string;
  userId: string;
  niche: string;
  viabilityScore: number;
  marketSize: string;
  growthRate: string;
  competition: string;
  painPoints: string[];
  opportunities: string[];
  competitors: { name: string; weakness: string; pricing?: string }[];
  recommendedOffer: string;
  pricingRange: string;
  targetAudience?: string;
  keyInsights?: string;
  marketingChannels?: string[];
  acquisitionStrategy?: string;
  barriers?: string[];
  redditInsights?: string;
  redditQuotes?: RedditQuote[];
  urgencyFactors?: string[];
  demandSignals?: string[];
  riskFactors?: string[];
  sources?: string[];
  createdAt: Timestamp;
}

export interface Offer {
  id: string;
  userId: string;
  name: string;
  niche: string;
  targetAudience: string;
  transformation: string;
  timeframe: string;
  price: number;
  guarantee: string;
  deliverables: string[];
  bonuses: string[];
  status: 'draft' | 'active' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  agentId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Timestamp;
}

export interface ChatSession {
  id: string;
  userId: string;
  agentId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Generated Content Types
export interface GeneratedContent {
  id: string;
  userId: string;
  type: 'vsl' | 'webinar' | 'youtube' | 'facebook-ad' | 'google-ad' | 'linkedin-ad' | 'landing-page' | 'sales-page' | 'opt-in' | 'email-sequence' | 'welcome-email' | 'cart-abandonment';
  title: string;
  input: string;
  content: string;
  status: 'complete' | 'generating' | 'error';
  createdAt: Timestamp;
}

// Funnel Types
export interface FunnelStep {
  id: string;
  type: 'email' | 'sms' | 'wait' | 'call' | 'webhook';
  title: string;
  content?: string;
  delay?: string;
  status: 'active' | 'paused';
}

export interface Funnel {
  id: string;
  userId: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  steps: FunnelStep[];
  stats: {
    enrolled: number;
    completed: number;
    revenue: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Integration Types
export interface Integration {
  id: string;
  userId: string;
  provider: string;
  connected: boolean;
  status?: 'syncing' | 'synced' | 'error';
  lastSync?: Timestamp;
  records?: number;
  config?: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Analytics Types
export interface AnalyticsEvent {
  id: string;
  userId: string;
  type: 'report_generated' | 'offer_created' | 'content_generated' | 'agent_used' | 'funnel_triggered';
  metadata?: Record<string, unknown>;
  createdAt: Timestamp;
}

// User functions
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Truth Reports
export async function saveTruthReport(userId: string, report: Omit<TruthReport, 'id' | 'userId' | 'createdAt'>) {
  const docRef = doc(collection(db, 'truthReports'));
  const data = {
    ...report,
    id: docRef.id,
    userId,
    createdAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getTruthReports(userId: string, limitCount = 20): Promise<TruthReport[]> {
  const q = query(
    collection(db, 'truthReports'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as TruthReport);
}

export async function getTruthReport(reportId: string): Promise<TruthReport | null> {
  const docRef = doc(db, 'truthReports', reportId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as TruthReport) : null;
}

export async function deleteTruthReport(reportId: string) {
  await deleteDoc(doc(db, 'truthReports', reportId));
}

// Offers
export async function saveOffer(userId: string, offer: Omit<Offer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  const docRef = doc(collection(db, 'offers'));
  const data = {
    ...offer,
    id: docRef.id,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getOffers(userId: string): Promise<Offer[]> {
  const q = query(
    collection(db, 'offers'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Offer);
}

export async function getOffer(offerId: string): Promise<Offer | null> {
  const docRef = doc(db, 'offers', offerId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Offer) : null;
}

export async function updateOffer(offerId: string, data: Partial<Offer>) {
  const docRef = doc(db, 'offers', offerId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteOffer(offerId: string) {
  await deleteDoc(doc(db, 'offers', offerId));
}

// Chat Sessions
export async function saveChatSession(
  userId: string,
  agentId: string,
  title: string,
  messages: Omit<ChatMessage, 'id' | 'createdAt'>[]
) {
  const docRef = doc(collection(db, 'chatSessions'));
  const now = new Date();
  const data = {
    id: docRef.id,
    userId,
    agentId,
    title,
    messages: messages.map((msg, index) => ({
      ...msg,
      id: `${docRef.id}-${index}`,
      createdAt: now,
    })),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getChatSessions(userId: string, agentId?: string): Promise<ChatSession[]> {
  let q = query(
    collection(db, 'chatSessions'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(50)
  );

  if (agentId) {
    q = query(
      collection(db, 'chatSessions'),
      where('userId', '==', userId),
      where('agentId', '==', agentId),
      orderBy('updatedAt', 'desc'),
      limit(50)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as ChatSession);
}

export async function updateChatSession(sessionId: string, messages: ChatMessage[]) {
  const docRef = doc(db, 'chatSessions', sessionId);
  await updateDoc(docRef, {
    messages,
    updatedAt: serverTimestamp(),
  });
}

// Credits/Usage
export async function deductCredits(uid: string, amount: number): Promise<boolean> {
  const profile = await getUserProfile(uid);
  if (!profile || profile.credits < amount) {
    return false;
  }
  
  await updateUserProfile(uid, {
    credits: profile.credits - amount,
  });
  return true;
}

export async function addCredits(uid: string, amount: number) {
  const profile = await getUserProfile(uid);
  if (!profile) return;
  
  await updateUserProfile(uid, {
    credits: profile.credits + amount,
  });
}

// Generated Content Functions
export async function saveGeneratedContent(
  userId: string,
  content: Omit<GeneratedContent, 'id' | 'userId' | 'createdAt'>
) {
  const docRef = doc(collection(db, 'generatedContent'));
  const data = {
    ...content,
    id: docRef.id,
    userId,
    createdAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getGeneratedContent(userId: string, limitCount = 50): Promise<GeneratedContent[]> {
  const q = query(
    collection(db, 'generatedContent'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as GeneratedContent);
}

export async function getGeneratedContentById(contentId: string): Promise<GeneratedContent | null> {
  const docRef = doc(db, 'generatedContent', contentId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as GeneratedContent) : null;
}

export async function deleteGeneratedContent(contentId: string) {
  await deleteDoc(doc(db, 'generatedContent', contentId));
}

// Funnel Functions
export async function saveFunnel(
  userId: string,
  funnel: Omit<Funnel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const docRef = doc(collection(db, 'funnels'));
  const data = {
    ...funnel,
    id: docRef.id,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getFunnels(userId: string): Promise<Funnel[]> {
  const q = query(
    collection(db, 'funnels'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Funnel);
}

export async function getFunnel(funnelId: string): Promise<Funnel | null> {
  const docRef = doc(db, 'funnels', funnelId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as Funnel) : null;
}

export async function updateFunnel(funnelId: string, data: Partial<Funnel>) {
  const docRef = doc(db, 'funnels', funnelId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFunnel(funnelId: string) {
  await deleteDoc(doc(db, 'funnels', funnelId));
}

// Integration Functions
export async function saveIntegration(
  userId: string,
  integration: Omit<Integration, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const docRef = doc(collection(db, 'integrations'));
  const data = {
    ...integration,
    id: docRef.id,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getIntegrations(userId: string): Promise<Integration[]> {
  const q = query(
    collection(db, 'integrations'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Integration);
}

export async function updateIntegration(integrationId: string, data: Partial<Integration>) {
  const docRef = doc(db, 'integrations', integrationId);
  // Filter out undefined values as Firestore doesn't accept them
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  await updateDoc(docRef, {
    ...cleanData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteIntegration(integrationId: string) {
  await deleteDoc(doc(db, 'integrations', integrationId));
}

// Analytics Functions
export async function trackAnalyticsEvent(
  userId: string,
  type: AnalyticsEvent['type'],
  metadata?: Record<string, unknown>
) {
  const docRef = doc(collection(db, 'analyticsEvents'));
  const data = {
    id: docRef.id,
    userId,
    type,
    metadata,
    createdAt: serverTimestamp(),
  };
  await setDoc(docRef, data);
  return docRef.id;
}

export async function getAnalyticsEvents(userId: string, limitCount = 100): Promise<AnalyticsEvent[]> {
  const q = query(
    collection(db, 'analyticsEvents'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as AnalyticsEvent);
}
