/**
 * Rep Career Rank System
 * 7-rank progression: Bronze → Silver → Gold → Diamond → Closer → Master → Dragon
 * Each rank has unique commission rates per package tier.
 * Aligned with the onboarding pack (Section 10).
 */

export type CareerRank = 'bronze' | 'silver' | 'gold' | 'diamond' | 'closer' | 'master' | 'dragon';

export interface RankInfo {
  key: CareerRank;
  label: string;
  emoji: string;
  requirement: string;
  unlock: string;
  commissionRates: { starter: number; launch: number; growth: number; scale: number };
}

export const CAREER_RANKS: Record<CareerRank, RankInfo> = {
  bronze: {
    key: 'bronze',
    label: 'Bronze',
    emoji: '🥉',
    requirement: 'Joined, in training',
    unlock: 'Portal access',
    commissionRates: { starter: 0, launch: 0, growth: 0, scale: 0 },
  },
  silver: {
    key: 'silver',
    label: 'Silver',
    emoji: '🥈',
    requirement: 'Training complete (60+)',
    unlock: 'Active rep, base commission',
    commissionRates: { starter: 20, launch: 15, growth: 12, scale: 10 },
  },
  gold: {
    key: 'gold',
    label: 'Gold',
    emoji: '🥇',
    requirement: '1 booked call + 2 weeks activity',
    unlock: 'Warm inbound leads',
    commissionRates: { starter: 22, launch: 17, growth: 14, scale: 12 },
  },
  diamond: {
    key: 'diamond',
    label: 'Diamond',
    emoji: '💎',
    requirement: '2 closed deals',
    unlock: 'Commission increase, recognised performer',
    commissionRates: { starter: 25, launch: 20, growth: 17, scale: 15 },
  },
  closer: {
    key: 'closer',
    label: 'Closer',
    emoji: '🎯',
    requirement: '5 closes, £5k+ revenue',
    unlock: 'Run own discovery calls',
    commissionRates: { starter: 27, launch: 22, growth: 19, scale: 17 },
  },
  master: {
    key: 'master',
    label: 'Master',
    emoji: '🔥',
    requirement: '10 closes, £15k+ revenue',
    unlock: 'Top-tier commission, Launch+ priority',
    commissionRates: { starter: 30, launch: 25, growth: 22, scale: 20 },
  },
  dragon: {
    key: 'dragon',
    label: 'Dragon',
    emoji: '🐉',
    requirement: '20+ closes or £30k+, invite confirmed',
    unlock: 'Maximum commission, full autonomy',
    commissionRates: { starter: 35, launch: 30, growth: 25, scale: 22 },
  },
};

export const RANK_ORDER: CareerRank[] = ['bronze', 'silver', 'gold', 'diamond', 'closer', 'master', 'dragon'];

/**
 * Get commission rate for a deal value at a given rank.
 * Returns percentage (e.g. 20 for 20%).
 */
export function getCommissionRateForRank(rank: CareerRank, dealValue: number): number {
  const rates = CAREER_RANKS[rank].commissionRates;
  if (dealValue <= 997) return rates.starter;
  if (dealValue <= 2497) return rates.launch;
  if (dealValue <= 4997) return rates.growth;
  return rates.scale;
}

/**
 * Get the package tier label for a deal value.
 */
export function getPackageTier(dealValue: number): string {
  if (dealValue <= 997) return 'Starter';
  if (dealValue <= 2497) return 'Launch';
  if (dealValue <= 4997) return 'Growth';
  return 'Scale';
}

/**
 * Get the next rank in the progression, or null if already Dragon.
 */
export function getNextRank(rank: CareerRank): CareerRank | null {
  const idx = RANK_ORDER.indexOf(rank);
  return idx < RANK_ORDER.length - 1 ? RANK_ORDER[idx + 1] : null;
}
