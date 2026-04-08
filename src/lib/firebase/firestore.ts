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
  notifications?: {
    email: boolean;
    reports: boolean;
    marketing: boolean;
  };
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

// Playbook Types
export interface PlaybookProgress {
  userId: string;
  // Diagnosis
  diagnosisComplete: boolean;
  diagnosisStage: string;
  diagnosisScore: number;
  diagnosisAnswers: Record<string, number>;
  businessInfo: {
    name: string;
    businessType: string;
    monthlyRevenue: string;
    burnRate: string;
    primaryGoal: string;
  };
  // Track
  milestones: Record<string, boolean>;
  // Systemize
  systemStatuses: Record<string, string>;
  // Scale
  streams: { name: string; type: 'active' | 'leveraged' | 'passive'; monthlyRevenue: number; hoursPerMonth: number }[];
  // Prove
  proofItems: { id: string; type: string; title: string; content: string; client: string; date: string; status: string }[];
  // Productize
  worksheetAnswers: Record<string, string>;
  // Prove - Case Study
  caseStudyAnswers: Record<string, string>;
  // Track - Proof entries
  trackProofEntries: { title: string; type: string; date: string }[];
  // Module visit tracking
  modulesVisited: string[];
  // Timestamps
  updatedAt: Timestamp;
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

// ─── Rep System Types ───────────────────────────────────────────────

export type RepTier = 'rep' | 'senior_rep' | 'closer';

export interface RepProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'trial' | 'inactive';
  tier?: RepTier;
  commissionRate: number; // percentage e.g. 15
  joinedAt: Timestamp;
  notes: string;
  bankDetails?: {
    accountName: string;
    sortCode: string;
    accountNumber: string;
  };
}

export type LeadStatus = 'contacted' | 'interested' | 'call_booked' | 'proposal_sent' | 'won' | 'lost';
export type LeadSource = 'cold_call' | 'linkedin' | 'email' | 'referral' | 'other';

export interface RepLead {
  id: string;
  repId: string;
  repName: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: LeadStatus;
  dealValue: number; // 0 until won
  notes: string;
  source: LeadSource;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastEmailedAt?: Timestamp | null;
  lastRepliedAt?: Timestamp | null;
}

export interface RepCommission {
  id: string;
  repId: string;
  repName: string;
  leadId: string;
  businessName: string;
  dealValue: number;
  commissionAmount: number; // dealValue * commissionRate / 100
  status: 'pending' | 'paid';
  createdAt: Timestamp;
  paidAt: Timestamp | null;
}

// ─── Rep CRUD ───────────────────────────────────────────────────────

export async function createRepProfile(uid: string, data: Omit<RepProfile, 'uid' | 'joinedAt'>) {
  await setDoc(doc(db, 'reps', uid), {
    ...data,
    uid,
    joinedAt: serverTimestamp(),
  });
}

export async function getRepProfile(uid: string): Promise<RepProfile | null> {
  const snap = await getDoc(doc(db, 'reps', uid));
  return snap.exists() ? (snap.data() as RepProfile) : null;
}

export async function getAllReps(): Promise<RepProfile[]> {
  const snap = await getDocs(collection(db, 'reps'));
  return snap.docs.map(d => d.data() as RepProfile);
}

export async function updateRepProfile(uid: string, data: Partial<RepProfile>) {
  await updateDoc(doc(db, 'reps', uid), data);
}

// ─── Lead CRUD ──────────────────────────────────────────────────────

export async function addLead(lead: Omit<RepLead, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(db, 'repLeads'));
  await setDoc(ref, {
    ...lead,
    id: ref.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getRepLeads(repId: string): Promise<RepLead[]> {
  const q = query(
    collection(db, 'repLeads'),
    where('repId', '==', repId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as RepLead);
}

export async function getAllLeads(): Promise<RepLead[]> {
  const q = query(collection(db, 'repLeads'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as RepLead);
}

export async function updateLead(leadId: string, data: Partial<RepLead>) {
  await updateDoc(doc(db, 'repLeads', leadId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLead(leadId: string) {
  await deleteDoc(doc(db, 'repLeads', leadId));
}

// ─── Commission CRUD ────────────────────────────────────────────────

export async function addCommission(commission: Omit<RepCommission, 'id' | 'createdAt' | 'paidAt'>): Promise<string> {
  const ref = doc(collection(db, 'repCommissions'));
  await setDoc(ref, {
    ...commission,
    id: ref.id,
    createdAt: serverTimestamp(),
    paidAt: null,
  });
  return ref.id;
}

export async function getRepCommissions(repId: string): Promise<RepCommission[]> {
  const q = query(
    collection(db, 'repCommissions'),
    where('repId', '==', repId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as RepCommission);
}

export async function getAllCommissions(): Promise<RepCommission[]> {
  const q = query(collection(db, 'repCommissions'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as RepCommission);
}

export async function markCommissionPaid(commissionId: string) {
  await updateDoc(doc(db, 'repCommissions', commissionId), {
    status: 'paid',
    paidAt: serverTimestamp(),
  });
}

// ─── Email Log (read-only on client — writes via API route) ─────────

export interface RepEmailLog {
  id: string;
  repId: string;
  repName: string;
  leadId: string;
  businessName: string;
  recipientEmail: string;
  templateKey: string;
  subject: string;
  body: string;
  resendId: string | null;
  status: 'sent' | 'failed';
  error?: string;
  sentAt: Timestamp;
  repliedAt?: Timestamp | null;
}

export async function getLeadEmails(leadId: string, repId: string): Promise<RepEmailLog[]> {
  const q = query(
    collection(db, 'repEmails'),
    where('repId', '==', repId),
    where('leadId', '==', leadId),
    orderBy('sentAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as RepEmailLog);
}

export interface RepEmailReply {
  id: string;
  resendEmailId: string;
  leadId: string;
  repId: string;
  from: string;
  to: string[];
  subject: string;
  textBody: string;
  htmlBody: string;
  receivedAt: Timestamp;
}

export async function getLeadReplies(leadId: string, repId: string): Promise<RepEmailReply[]> {
  const q = query(
    collection(db, 'repEmailReplies'),
    where('repId', '==', repId),
    where('leadId', '==', leadId),
    orderBy('receivedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as RepEmailReply);
}

// ─── Client Portal Types ────────────────────────────────────────────

export type ClientStage = 'discovery' | 'design' | 'build' | 'review' | 'launch' | 'maintenance';
export type ClientPackage = 'starter' | 'standard' | 'premium' | 'custom';

export interface ClientProfile {
  uid: string;
  name: string;
  businessName: string;
  email: string;
  phone?: string;
  projectName: string;
  package: ClientPackage;
  stage: ClientStage;
  startDate: string;
  launchDate?: string;
  status: 'active' | 'paused' | 'complete';
  notes?: string;
  joinedAt: Timestamp;
}

export interface ClientDeliverable {
  id: string;
  clientId: string;
  label: string;
  url: string;
  type: 'mockup' | 'staging' | 'asset' | 'document' | 'other';
  notes?: string;
  addedAt: Timestamp;
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  subject: string;
  message: string;
  status: 'open' | 'acknowledged' | 'resolved';
  reply?: string;
  submittedAt: Timestamp;
  repliedAt?: Timestamp | null;
}

export interface ClientInvoice {
  id: string;
  clientId: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  paymentLink?: string;
  paidAt?: Timestamp | null;
  createdAt: Timestamp;
}

// ─── Client CRUD (client SDK) ───────────────────────────────────────

export async function getClientProfile(uid: string): Promise<ClientProfile | null> {
  const snap = await getDoc(doc(db, 'clients', uid));
  return snap.exists() ? (snap.data() as ClientProfile) : null;
}

export async function getClientDeliverables(clientId: string): Promise<ClientDeliverable[]> {
  const q = query(
    collection(db, 'clientDeliverables'),
    where('clientId', '==', clientId),
    orderBy('addedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ClientDeliverable);
}

export async function getClientFeedback(clientId: string): Promise<ClientFeedback[]> {
  const q = query(
    collection(db, 'clientFeedback'),
    where('clientId', '==', clientId),
    orderBy('submittedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ClientFeedback);
}

export async function submitClientFeedback(
  clientId: string,
  data: { subject: string; message: string }
): Promise<string> {
  const ref = doc(collection(db, 'clientFeedback'));
  await setDoc(ref, {
    id: ref.id,
    clientId,
    subject: data.subject,
    message: data.message,
    status: 'open',
    reply: null,
    submittedAt: serverTimestamp(),
    repliedAt: null,
  });
  return ref.id;
}

export async function getClientInvoices(clientId: string): Promise<ClientInvoice[]> {
  const q = query(
    collection(db, 'clientInvoices'),
    where('clientId', '==', clientId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ClientInvoice);
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

// Playbook Progress Functions
export async function getPlaybookProgress(userId: string): Promise<PlaybookProgress | null> {
  const docRef = doc(db, 'playbookProgress', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as PlaybookProgress) : null;
}

export async function savePlaybookProgress(userId: string, data: Partial<Omit<PlaybookProgress, 'userId' | 'createdAt' | 'updatedAt'>>) {
  const docRef = doc(db, 'playbookProgress', userId);
  const existing = await getDoc(docRef);
  
  if (existing.exists()) {
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(docRef, {
      userId,
      diagnosisComplete: false,
      diagnosisStage: '',
      diagnosisScore: 0,
      diagnosisAnswers: {},
      businessInfo: { name: '', businessType: '', monthlyRevenue: '', burnRate: '', primaryGoal: '' },
      milestones: {},
      systemStatuses: {},
      streams: [],
      proofItems: [],
      modulesVisited: [],
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function updatePlaybookMilestone(userId: string, milestoneId: string, completed: boolean) {
  const progress = await getPlaybookProgress(userId);
  const milestones = progress?.milestones || {};
  milestones[milestoneId] = completed;
  await savePlaybookProgress(userId, { milestones });
}

export async function updatePlaybookSystemStatus(userId: string, systemId: string, status: string) {
  const progress = await getPlaybookProgress(userId);
  const systemStatuses = progress?.systemStatuses || {};
  systemStatuses[systemId] = status;
  await savePlaybookProgress(userId, { systemStatuses });
}

export async function trackPlaybookModuleVisit(userId: string, moduleName: string) {
  const progress = await getPlaybookProgress(userId);
  const visited = progress?.modulesVisited || [];
  if (!visited.includes(moduleName)) {
    visited.push(moduleName);
    await savePlaybookProgress(userId, { modulesVisited: visited });
  }
}

// ─── Skills ────────────────────────────────────────────────────────────────

export interface Skill {
  id: string;
  userId: string;
  name: string;
  description: string;
  trigger: string; // comma-separated keywords that activate this skill
  prompt: string;  // system-prompt injection text
  tools: string[]; // tool names this skill enables
  createdAt: Timestamp;
  usageCount: number;
}

export async function saveSkill(
  userId: string,
  skill: Omit<Skill, 'id' | 'userId' | 'createdAt' | 'usageCount'>
): Promise<string> {
  const docRef = doc(collection(db, 'skills'));
  await setDoc(docRef, {
    ...skill,
    id: docRef.id,
    userId,
    usageCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSkills(userId: string): Promise<Skill[]> {
  const q = query(
    collection(db, 'skills'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as Skill);
}

export async function deleteSkill(skillId: string): Promise<void> {
  await deleteDoc(doc(db, 'skills', skillId));
}

// ─── Prospect Memory ───────────────────────────────────────────────────────

export interface MemoryFact {
  key: string;
  value: string;
  savedAt: Timestamp;
}

export interface ProspectMemory {
  id: string;
  userId: string;
  prospect: string;
  facts: MemoryFact[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export async function getProspectMemories(userId: string): Promise<ProspectMemory[]> {
  const q = query(
    collection(db, 'prospect_memory'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => d.data() as ProspectMemory);
}

export async function getProspectMemory(userId: string, prospect: string): Promise<ProspectMemory | null> {
  const docId = `${userId}_${prospect.toLowerCase().replace(/\s+/g, '_')}`;
  const docRef = doc(db, 'prospect_memory', docId);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as ProspectMemory) : null;
}

// ─── Workspaces ────────────────────────────────────────────────────────────

export interface Workspace {
  id: string;
  userId: string;
  clientName: string;
  niche: string;
  offer: string;
  audience: string;
  goals: string;
  notes: string;
  webhookUrl?: string;
  deliverableCount: number;
  lastActivityAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Deliverable {
  id: string;
  userId: string;
  workspaceId: string;
  type: string;
  title: string;
  content: string;
  agentId: string;
  task: string;
  createdAt: Timestamp;
  // Share
  isPublic?: boolean;
  // Feedback
  rating?: 1 | -1 | null;
  // Version chain
  refinementOfId?: string;
  refinementOfTitle?: string;
}

export async function saveWorkspace(
  userId: string,
  data: Omit<Workspace, 'id' | 'userId' | 'deliverableCount' | 'lastActivityAt' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = doc(collection(db, 'workspaces'));
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    userId,
    deliverableCount: 0,
    lastActivityAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getWorkspaces(userId: string): Promise<Workspace[]> {
  const q = query(
    collection(db, 'workspaces'),
    where('userId', '==', userId),
    orderBy('lastActivityAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as Workspace);
}

export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
  const snap = await getDoc(doc(db, 'workspaces', workspaceId));
  return snap.exists() ? (snap.data() as Workspace) : null;
}

export async function updateWorkspace(workspaceId: string, data: Partial<Workspace>): Promise<void> {
  await updateDoc(doc(db, 'workspaces', workspaceId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  await deleteDoc(doc(db, 'workspaces', workspaceId));
}

export async function getDeliverables(workspaceId: string, userId: string, limitCount = 30): Promise<Deliverable[]> {
  // Query by userId only — satisfies the security rule and uses the auto-indexed
  // single-field index (no composite index creation needed). Filter and sort client-side.
  const q = query(
    collection(db, 'deliverables'),
    where('userId', '==', userId),
    limit(100)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => d.data() as Deliverable)
    .filter(d => d.workspaceId === workspaceId)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
    .slice(0, limitCount);
}

export async function getDeliverable(deliverableId: string): Promise<Deliverable | null> {
  const snap = await getDoc(doc(db, 'deliverables', deliverableId));
  return snap.exists() ? (snap.data() as Deliverable) : null;
}
