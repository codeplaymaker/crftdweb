/**
 * Rep Training Service — Firestore CRUD
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  TrainingSession,
  TrainingMessage,
  TrainingRating,
  TrainingStats,
  TrainingRatingCategory,
  DrillSession,
  DrillRound,
  RepRank,
  LiveCallSession,
  CallTranscriptEntry,
  CallSummary,
} from '../types/repTraining';
import { getRank, scoreToGrade } from './repKnowledgeBase';

const CATEGORIES: TrainingRatingCategory[] = [
  'discovery', 'listening', 'objection_handling', 'closing', 'rapport', 'control',
];

// ── Training Sessions ──────────────────────────────────────

export class RepTrainingService {

  static async createTrainingSession(
    userId: string,
    data: Partial<TrainingSession>
  ): Promise<string> {
    const sessionId = doc(collection(db, 'repTrainingSessions')).id;
    const session = {
      id: sessionId,
      userId,
      mode: 'roleplay',
      scenarioId: data.scenarioId || null,
      scenario: data.scenario || null,
      status: 'in_progress',
      messages: [],
      rating: null,
      duration: 0,
      startedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(doc(db, 'repTrainingSessions', sessionId), session);
    return sessionId;
  }

  static async getTrainingSession(sessionId: string): Promise<TrainingSession | null> {
    const snap = await getDoc(doc(db, 'repTrainingSessions', sessionId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      ...d,
      id: snap.id,
      startedAt: d.startedAt?.toDate?.() || new Date(),
      endedAt: d.endedAt?.toDate?.() || undefined,
      createdAt: d.createdAt?.toDate?.() || new Date(),
      updatedAt: d.updatedAt?.toDate?.() || new Date(),
    } as TrainingSession;
  }

  static async addMessage(sessionId: string, message: TrainingMessage): Promise<void> {
    const ref = doc(db, 'repTrainingSessions', sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Session not found');
    const messages = [...(snap.data().messages || []), message];
    await updateDoc(ref, { messages, updatedAt: Timestamp.now() });
  }

  static async completeSession(sessionId: string, rating: TrainingRating, duration: number): Promise<void> {
    await updateDoc(doc(db, 'repTrainingSessions', sessionId), {
      status: 'completed',
      endedAt: Timestamp.now(),
      rating,
      duration,
      updatedAt: Timestamp.now(),
    });
  }

  static async getUserTrainingSessions(userId: string, max = 20): Promise<TrainingSession[]> {
    const q = query(
      collection(db, 'repTrainingSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        startedAt: data.startedAt?.toDate?.() || new Date(),
        endedAt: data.endedAt?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as TrainingSession;
    });
  }

  // ── Drill Sessions ─────────────────────────────────────

  static async createDrillSession(userId: string, data: Partial<DrillSession>): Promise<string> {
    const sessionId = doc(collection(db, 'repDrillSessions')).id;
    const session = {
      id: sessionId,
      userId,
      drillType: data.drillType || 'objection_handling',
      difficulty: data.difficulty || 'beginner',
      rounds: [],
      totalRounds: data.totalRounds || 5,
      completedRounds: 0,
      accuracy: 0,
      status: 'in_progress',
      startedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
    };
    await setDoc(doc(db, 'repDrillSessions', sessionId), session);
    return sessionId;
  }

  static async addDrillRound(sessionId: string, round: DrillRound): Promise<void> {
    const ref = doc(db, 'repDrillSessions', sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error('Drill session not found');
    const data = snap.data();
    const rounds = [...(data.rounds || []), round];
    const completedRounds = rounds.length;
    const totalScore = rounds.reduce((sum: number, r: DrillRound) => sum + r.aiRating, 0);
    const accuracy = (totalScore / (completedRounds * 10)) * 100;
    const updates: Record<string, unknown> = { rounds, completedRounds, accuracy };
    if (completedRounds >= (data.totalRounds || 5)) {
      updates.status = 'completed';
      updates.endedAt = Timestamp.now();
    }
    await updateDoc(ref, updates);
  }

  static async getDrillSession(sessionId: string): Promise<DrillSession | null> {
    const snap = await getDoc(doc(db, 'repDrillSessions', sessionId));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      ...data,
      id: snap.id,
      startedAt: data.startedAt?.toDate?.() || new Date(),
      endedAt: data.endedAt?.toDate?.() || undefined,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    } as DrillSession;
  }

  static async getUserDrillSessions(userId: string, max = 20): Promise<DrillSession[]> {
    const q = query(
      collection(db, 'repDrillSessions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        startedAt: data.startedAt?.toDate?.() || new Date(),
        endedAt: data.endedAt?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      } as DrillSession;
    });
  }

  // ── Training Stats ─────────────────────────────────────

  static async getTrainingStats(userId: string): Promise<TrainingStats | null> {
    const snap = await getDoc(doc(db, 'repTrainingStats', userId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      ...d,
      updatedAt: d.updatedAt?.toDate?.() || new Date(),
      unlockedAt: d.unlockedAt?.toDate?.() || undefined,
    } as TrainingStats;
  }

  static async updateTrainingStats(
    userId: string,
    completedSession: TrainingSession
  ): Promise<TrainingStats> {
    const existing = await this.getTrainingStats(userId);
    const rating = completedSession.rating;
    if (!rating) throw new Error('Session must have a rating');

    const totalSessions = (existing?.totalSessions || 0) + 1;
    const totalMinutes =
      (existing?.totalPracticeMinutes || 0) + Math.round((completedSession.duration || 0) / 60);

    const prevTotal = (existing?.averageScore || 0) * (existing?.totalSessions || 0);
    const averageScore = (prevTotal + rating.overallScore) / totalSessions;

    const categoryAverages: Record<TrainingRatingCategory, number> = existing?.categoryAverages || {
      discovery: 0, listening: 0, objection_handling: 0, closing: 0, rapport: 0, control: 0,
    };
    const categoryTrends: Record<TrainingRatingCategory, number[]> = existing?.categoryTrends || {
      discovery: [], listening: [], objection_handling: [], closing: [], rapport: [], control: [],
    };

    CATEGORIES.forEach((cat) => {
      const score = rating.categories[cat]?.score || 0;
      const prevCatTotal = (categoryAverages[cat] || 0) * (existing?.totalSessions || 0);
      categoryAverages[cat] = (prevCatTotal + score) / totalSessions;
      categoryTrends[cat] = [...(categoryTrends[cat] || []), score].slice(-10);
    });

    let weakest: TrainingRatingCategory = 'discovery';
    let strongest: TrainingRatingCategory = 'discovery';
    let weakestScore = 100, strongestScore = 0;
    CATEGORIES.forEach((cat) => {
      if (categoryAverages[cat] < weakestScore) { weakestScore = categoryAverages[cat]; weakest = cat; }
      if (categoryAverages[cat] > strongestScore) { strongestScore = categoryAverages[cat]; strongest = cat; }
    });

    const scoreTrend = [...(existing?.scoreTrend || []), rating.overallScore].slice(-10);

    const today = new Date().toDateString();
    const lastDate = existing?.updatedAt ? new Date(existing.updatedAt).toDateString() : '';
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let currentStreak = existing?.currentStreak || 0;
    if (lastDate === today) { /* same day */ }
    else if (lastDate === yesterday) { currentStreak += 1; }
    else { currentStreak = 1; }

    const longestStreak = Math.max(existing?.longestStreak || 0, currentStreak);
    const rank = getRank(averageScore, totalSessions);

    // Check if just unlocked (crossed 60 average)
    const wasUnlocked = !!(existing?.unlockedAt);
    const nowUnlocked = averageScore >= 60;

    const stats: TrainingStats = {
      userId,
      totalSessions,
      totalPracticeMinutes: totalMinutes,
      currentStreak,
      longestStreak,
      rank,
      averageScore,
      categoryAverages,
      scoreTrend,
      categoryTrends,
      weakestCategory: weakest,
      strongestCategory: strongest,
      drillsCompleted: existing?.drillsCompleted || 0,
      drillAccuracy: existing?.drillAccuracy || 0,
      unlockedAt: wasUnlocked ? existing!.unlockedAt : (nowUnlocked ? new Date() : undefined),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'repTrainingStats', userId), {
      ...stats,
      updatedAt: Timestamp.now(),
      unlockedAt: stats.unlockedAt ? Timestamp.fromDate(stats.unlockedAt) : null,
    });

    // Auto-promote Bronze → Silver when training unlocks
    if (!wasUnlocked && nowUnlocked) {
      try {
        const repDoc = await getDoc(doc(db, 'reps', userId));
        if (repDoc.exists()) {
          const data = repDoc.data();
          if (!data.careerRank || data.careerRank === 'bronze') {
            await updateDoc(doc(db, 'reps', userId), { careerRank: 'silver' });
          }
        }
      } catch (e) {
        console.error('Auto-promote to silver failed:', e);
      }
    }

    return stats;
  }

  static async updateDrillStats(userId: string, drillSession: DrillSession): Promise<void> {
    const existing = await this.getTrainingStats(userId);
    const drillsCompleted = (existing?.drillsCompleted || 0) + 1;
    const prevTotal = (existing?.drillAccuracy || 0) * (existing?.drillsCompleted || 0);
    const drillAccuracy = (prevTotal + drillSession.accuracy) / drillsCompleted;
    await setDoc(doc(db, 'repTrainingStats', userId), {
      ...(existing || {
        userId, totalSessions: 0, totalPracticeMinutes: 0, currentStreak: 0, longestStreak: 0,
        rank: 'rookie', averageScore: 0, scoreTrend: [],
        categoryAverages: { discovery: 0, listening: 0, objection_handling: 0, closing: 0, rapport: 0, control: 0 },
        categoryTrends: { discovery: [], listening: [], objection_handling: [], closing: [], rapport: [], control: [] },
        weakestCategory: 'discovery', strongestCategory: 'discovery',
      }),
      drillsCompleted,
      drillAccuracy,
      updatedAt: Timestamp.now(),
    }, { merge: true });
  }

  // ── All rep stats for admin ────────────────────────────

  static async getAllRepStats(): Promise<TrainingStats[]> {
    const snap = await getDocs(collection(db, 'repTrainingStats'));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        unlockedAt: data.unlockedAt?.toDate?.() || undefined,
      } as TrainingStats;
    });
  }

  // ── Live Call Sessions ─────────────────────────────────

  static async createLiveCallSession(
    repId: string,
    data: Partial<LiveCallSession>
  ): Promise<string> {
    const id = doc(collection(db, 'repCallSessions')).id;
    const session = {
      id,
      repId,
      leadId: data.leadId || null,
      leadName: data.leadName || 'Prospect',
      businessType: data.businessType || '',
      callGoal: data.callGoal || 'Book a discovery call',
      status: 'in_progress',
      transcript: [],
      duration: 0,
      notes: '',
      outcome: null,
      summary: null,
      startedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await setDoc(doc(db, 'repCallSessions', id), session);
    return id;
  }

  static async addCallTranscriptEntry(
    sessionId: string,
    entry: CallTranscriptEntry
  ): Promise<void> {
    const ref = doc(db, 'repCallSessions', sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const transcript = [...(snap.data().transcript || []), entry];
    await updateDoc(ref, { transcript, updatedAt: Timestamp.now() });
  }

  static async completeCallSession(
    sessionId: string,
    summary: CallSummary,
    duration: number,
    outcome: LiveCallSession['outcome'],
    notes: string,
    audioUrl?: string,
    finalTranscript?: CallTranscriptEntry[]
  ): Promise<void> {
    const update: Record<string, unknown> = {
      status: 'completed',
      summary,
      duration,
      outcome,
      notes,
      endedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    if (audioUrl) update.audioUrl = audioUrl;
    if (finalTranscript) update.transcript = finalTranscript;
    await updateDoc(doc(db, 'repCallSessions', sessionId), update);
  }

  static async getUserCallSessions(repId: string, max = 20): Promise<LiveCallSession[]> {
    const q = query(
      collection(db, 'repCallSessions'),
      where('repId', '==', repId),
      orderBy('createdAt', 'desc'),
      limit(max)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        startedAt: data.startedAt?.toDate?.() || new Date(),
        endedAt: data.endedAt?.toDate?.() || undefined,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as LiveCallSession;
    });
  }
}
