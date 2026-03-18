/**
 * Rule-based grader: A-D.
 * No AI needed — pure math from PageSpeed data.
 *
 * Grade rubric:
 *   A  —  Performance ≥ 80, mobile ✓, HTTPS ✓, meta ✓, LCP < 2500ms
 *   B  —  Performance ≥ 60, mobile ✓, HTTPS ✓
 *   C  —  Performance ≥ 30 OR mobile ✓
 *   D  —  Everything else (broken, slow, not mobile-friendly)
 */

import type { AuditData } from './auditor';

export interface GradeResult {
  grade: 'A' | 'B' | 'C' | 'D';
  reason: string;
}

export function gradeWebsite(audit: AuditData): GradeResult {
  const { performanceScore, lcp, mobile, https, hasMetaDescription, hasCTA } = audit;

  // D — completely broken or performance 0 (site unreachable / errored)
  if (performanceScore === 0) {
    return { grade: 'D', reason: 'Site unreachable or broken' };
  }

  // Build issue list for reason string
  const issues: string[] = [];
  if (!mobile) issues.push('not mobile-friendly');
  if (!https) issues.push('no SSL');
  if (performanceScore < 30) issues.push(`speed score ${performanceScore}/100`);
  else if (performanceScore < 60) issues.push(`speed score ${performanceScore}/100`);
  if (lcp > 4000) issues.push(`${(lcp / 1000).toFixed(1)}s load time`);
  if (!hasMetaDescription) issues.push('no meta description');
  if (!hasCTA) issues.push('no clear CTAs');

  // A — everything good
  if (
    performanceScore >= 80 &&
    mobile &&
    https &&
    hasMetaDescription &&
    lcp < 2500
  ) {
    return { grade: 'A', reason: `Strong site — ${performanceScore}/100, fast, mobile-ready` };
  }

  // B — decent but missing some pieces
  if (performanceScore >= 60 && mobile && https) {
    const minor = issues.length > 0 ? issues.join(', ') : 'minor optimizations needed';
    return { grade: 'B', reason: `Decent site — ${minor}` };
  }

  // C — has some redeeming qualities
  if (performanceScore >= 30 || mobile) {
    return { grade: 'C', reason: issues.join(', ') || 'mediocre performance' };
  }

  // D — needs a complete rebuild
  return { grade: 'D', reason: issues.join(', ') || 'poor performance across the board' };
}
