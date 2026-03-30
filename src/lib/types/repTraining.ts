/**
 * Rep Training — Types
 * AI-powered cold call training for CrftdWeb sales reps.
 */

export type TrainingRatingCategory =
  | 'discovery'
  | 'listening'
  | 'objection_handling'
  | 'closing'
  | 'rapport'
  | 'control';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type RepRank = 'rookie' | 'canvasser' | 'booker' | 'hunter' | 'ace';

export interface TrainingScenario {
  id: string;
  name: string;
  description: string;
  scenarioType: 'cold_call' | 'objection' | 'follow_up' | 'gatekeeper' | 'booking';
  difficulty: DifficultyLevel;
  prospectProfile: {
    name: string;
    businessType: string;
    industry: string;
    background: string;
    hiddenMotivation: string;
    currentSituation: string;
    objections: string[];
    dealBreakers: string[];
  };
  objectives: string[];
  bonusObjectives: string[];
  estimatedDuration: number; // minutes
  tags: string[];
}

export interface TrainingMessage {
  id: string;
  role: 'prospect' | 'rep' | 'coach';
  content: string;
  timestamp: number; // ms from session start
  coachingTip?: string;
}

export interface CategoryRating {
  score: number; // 0–100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  feedback: string;
  highlights: string[];
  improvements: string[];
}

export interface TrainingRating {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  categories: Record<TrainingRatingCategory, CategoryRating>;
  summary: string;
  topStrength: string;
  topWeakness: string;
  coachingPriority: string;
  callBooked: boolean;
  transcript?: TrainingMessage[];
}

export interface TrainingSession {
  id: string;
  userId: string;
  mode: 'roleplay';
  scenarioId: string | null;
  scenario: TrainingScenario | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  messages: TrainingMessage[];
  rating: TrainingRating | null;
  duration: number; // seconds
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type DrillType =
  | 'objection_handling'
  | 'opening_lines'
  | 'call_booking'
  | 'gatekeeper'
  | 'reframing';

export interface DrillPrompt {
  id: string;
  type: DrillType;
  difficulty: DifficultyLevel;
  prompt: string;
  context?: string;
  idealFrameworks: string[];
  exampleResponse?: string;
}

export interface DrillRound {
  promptId: string;
  prompt: string;
  userResponse: string;
  aiRating: number; // 0–10
  aiFeedback: string;
  aiIdealResponse: string;
  timestamp: Date;
}

export interface DrillSession {
  id: string;
  userId: string;
  drillType: DrillType;
  difficulty: DifficultyLevel;
  rounds: DrillRound[];
  totalRounds: number;
  completedRounds: number;
  accuracy: number; // 0–100
  status: 'in_progress' | 'completed';
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
}

export interface TrainingStats {
  userId: string;
  totalSessions: number;
  totalPracticeMinutes: number;
  currentStreak: number;
  longestStreak: number;
  rank: RepRank;
  averageScore: number;
  categoryAverages: Record<TrainingRatingCategory, number>;
  scoreTrend: number[];
  categoryTrends: Record<TrainingRatingCategory, number[]>;
  weakestCategory: TrainingRatingCategory;
  strongestCategory: TrainingRatingCategory;
  drillsCompleted: number;
  drillAccuracy: number;
  unlockedAt?: Date; // set when they hit unlock threshold
  updatedAt: Date;
}

// ── Live Call Assistant ────────────────────────────────────

export interface CallTranscriptEntry {
  id: string;
  speaker: 'rep' | 'prospect' | 'unknown';
  text: string;
  timestamp: number; // seconds from call start
  createdAt: Date;
}

export interface LiveCallSession {
  id: string;
  repId: string;
  leadId?: string;
  leadName: string;
  businessType?: string;
  callGoal: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  transcript: CallTranscriptEntry[];
  duration: number; // seconds
  outcome?: 'booked' | 'follow_up' | 'not_interested' | 'callback';
  summary?: CallSummary;
  notes: string;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CallSummary {
  summary: string;
  keyPoints: string[];
  objectionsMet: string[];
  outcome: string;
  nextSteps: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  callBooked: boolean;
  followUpEmail?: string;
}
