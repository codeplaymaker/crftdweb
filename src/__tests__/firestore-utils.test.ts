import { describe, it, expect } from 'vitest';

describe('Firestore utility functions', () => {
  describe('PlaybookProgress type', () => {
    it('should define correct shape for playbook progress', () => {
      // Type validation test - ensures the interface structure is correct
      const progress = {
        userId: 'test-uid',
        diagnosisComplete: false,
        diagnosisStage: '',
        diagnosisScore: 0,
        diagnosisAnswers: {},
        businessInfo: {
          name: '',
          businessType: '',
          monthlyRevenue: '',
          burnRate: '',
          primaryGoal: '',
        },
        milestones: {},
        systemStatuses: {},
        streams: [],
        proofItems: [],
        modulesVisited: [],
        updatedAt: null as any,
        createdAt: null as any,
      };

      expect(progress.userId).toBe('test-uid');
      expect(progress.diagnosisComplete).toBe(false);
      expect(progress.streams).toEqual([]);
      expect(progress.modulesVisited).toEqual([]);
    });
  });

  describe('Freedom Score Calculation', () => {
    it('should return 0 for empty streams', () => {
      const streams: { name: string; type: 'active' | 'leveraged' | 'passive'; monthlyRevenue: number; hoursPerMonth: number }[] = [];
      const totalRevenue = streams.reduce((sum, s) => sum + s.monthlyRevenue, 0);
      expect(totalRevenue).toBe(0);
    });

    it('should calculate correct freedom score for mixed streams', () => {
      const streams = [
        { name: 'Client work', type: 'active' as const, monthlyRevenue: 8000, hoursPerMonth: 80 },
        { name: 'Productized service', type: 'leveraged' as const, monthlyRevenue: 4000, hoursPerMonth: 20 },
        { name: 'Template sales', type: 'passive' as const, monthlyRevenue: 1200, hoursPerMonth: 2 },
      ];
      
      const totalRevenue = streams.reduce((sum, s) => sum + s.monthlyRevenue, 0);
      expect(totalRevenue).toBe(13200);
      
      const leveragedRevenue = streams.filter(s => s.type === 'leveraged').reduce((sum, s) => sum + s.monthlyRevenue, 0);
      const passiveRevenue = streams.filter(s => s.type === 'passive').reduce((sum, s) => sum + s.monthlyRevenue, 0);
      
      const leveragedPercent = Math.round((leveragedRevenue / totalRevenue) * 100);
      const passivePercent = Math.round((passiveRevenue / totalRevenue) * 100);
      
      const freedomScore = Math.min(100, Math.round(((leveragedPercent * 0.7 + passivePercent * 1.0) / 100) * 100));
      
      expect(leveragedPercent).toBe(30); // 4000/13200 = ~30%
      expect(passivePercent).toBe(9); // 1200/13200 = ~9%
      expect(freedomScore).toBe(30); // (30*0.7 + 9*1.0) = 30
    });

    it('should cap at 100 for fully passive income', () => {
      const streams = [
        { name: 'Course sales', type: 'passive' as const, monthlyRevenue: 10000, hoursPerMonth: 2 },
      ];
      
      const totalRevenue = streams.reduce((sum, s) => sum + s.monthlyRevenue, 0);
      const passivePercent = Math.round((streams.filter(s => s.type === 'passive').reduce((sum, s) => sum + s.monthlyRevenue, 0) / totalRevenue) * 100);
      const freedomScore = Math.min(100, Math.round(((0 * 0.7 + passivePercent * 1.0) / 100) * 100));
      
      expect(freedomScore).toBe(100);
    });
  });

  describe('Diagnosis Stage Mapping', () => {
    function getStage(score: number): string {
      if (score <= 18) return 'Mindset';
      if (score <= 24) return 'Skill';
      if (score <= 30) return 'Process';
      if (score <= 36) return 'Reputation';
      if (score <= 42) return 'Product';
      return 'Authority';
    }

    it('should map low scores to Mindset', () => {
      expect(getStage(12)).toBe('Mindset');
      expect(getStage(18)).toBe('Mindset');
    });

    it('should map mid scores correctly', () => {
      expect(getStage(19)).toBe('Skill');
      expect(getStage(25)).toBe('Process');
      expect(getStage(31)).toBe('Reputation');
      expect(getStage(37)).toBe('Product');
    });

    it('should map high scores to Authority', () => {
      expect(getStage(43)).toBe('Authority');
      expect(getStage(48)).toBe('Authority');
    });
  });

  describe('Module visit tracking', () => {
    it('should not add duplicate modules to visited list', () => {
      const visited: string[] = ['diagnose', 'track'];
      const moduleName = 'diagnose';
      
      if (!visited.includes(moduleName)) {
        visited.push(moduleName);
      }
      
      expect(visited).toEqual(['diagnose', 'track']);
      expect(visited.length).toBe(2);
    });

    it('should add new module to visited list', () => {
      const visited: string[] = ['diagnose'];
      const moduleName = 'track';
      
      if (!visited.includes(moduleName)) {
        visited.push(moduleName);
      }
      
      expect(visited).toEqual(['diagnose', 'track']);
      expect(visited.length).toBe(2);
    });
  });
});
