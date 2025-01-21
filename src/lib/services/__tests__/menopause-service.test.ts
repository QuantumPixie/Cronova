import {
  suggestMenopauseStage,
  getJourneyStatus,
  formatPeriodDate,
} from '../menopause-service';
import { differenceInMonths } from 'date-fns';

jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  differenceInMonths: jest.fn(),
}));

describe('Menopause Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('suggestMenopauseStage', () => {
    it('returns PERIMENOPAUSE when no last period date is provided', () => {
      const result = suggestMenopauseStage(null);
      expect(result.stage).toBe('PERIMENOPAUSE');
      expect(result.reason).toBe('No last period date provided');
    });

    it('returns MENOPAUSE when 12 or more months have passed since last period', () => {
      (differenceInMonths as jest.Mock).mockReturnValue(13);

      const result = suggestMenopauseStage('2022-01-01');
      expect(result.stage).toBe('MENOPAUSE');
      expect(result.reason).toContain(
        'It has been 13 months since your last period'
      );
    });

    it('returns PERIMENOPAUSE when 3 to 11 months have passed', () => {
      (differenceInMonths as jest.Mock).mockReturnValue(6);

      const result = suggestMenopauseStage('2023-01-01');
      expect(result.stage).toBe('PERIMENOPAUSE');
      expect(result.reason).toContain(
        'It has been 6 months since your last period'
      );
    });

    it('returns PERIMENOPAUSE for less than 3 months', () => {
      (differenceInMonths as jest.Mock).mockReturnValue(1);

      const result = suggestMenopauseStage('2023-06-01');
      expect(result.stage).toBe('PERIMENOPAUSE');
      expect(result.reason).toBe(
        'Regular periods suggest early perimenopause or pre-menopause.'
      );
    });
  });

  describe('getJourneyStatus', () => {
    it('returns initial status when no last period date is provided', () => {
      const result = getJourneyStatus(null);
      expect(result.status).toBe('Journey not started');
      expect(result.progressPercentage).toBe(0);
    });

    it('calculates progress percentage correctly', () => {
      (differenceInMonths as jest.Mock).mockReturnValue(6);

      const result = getJourneyStatus('2023-01-01');
      expect(result.progressPercentage).toBeCloseTo(50);
      expect(result.status).toBe('Tracking period changes');
      expect(result.nextMilestone).toBe(
        '6 more months without a period to confirm menopause'
      );
    });

    it('returns 100% progress when 12 or more months have passed', () => {
      (differenceInMonths as jest.Mock).mockReturnValue(13);

      const result = getJourneyStatus('2022-01-01');
      expect(result.progressPercentage).toBe(100);
      expect(result.status).toBe('Menopause confirmed');
      expect(result.nextMilestone).toBe('You have reached menopause');
    });
  });

  describe('formatPeriodDate', () => {
    it('formats date correctly', () => {
      const result = formatPeriodDate('2023-05-15');
      expect(result).toBe('May 15, 2023');
    });

    it('handles different date formats', () => {
      const result1 = formatPeriodDate('2022-12-31');
      expect(result1).toBe('December 31, 2022');

      const result2 = formatPeriodDate('2023-01-01');
      expect(result2).toBe('January 1, 2023');
    });
  });
});
