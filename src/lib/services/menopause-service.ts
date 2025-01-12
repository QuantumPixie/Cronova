import { differenceInMonths, parseISO, format } from 'date-fns';
import { MenopauseStage } from '@prisma/client';

export function suggestMenopauseStage(lastPeriodDate: string | null): {
  stage: MenopauseStage;
  reason: string;
} {
  if (!lastPeriodDate) {
    return {
      stage: 'PERIMENOPAUSE',
      reason: 'No last period date provided',
    };
  }

  const monthsSinceLastPeriod = differenceInMonths(
    new Date(),
    parseISO(lastPeriodDate)
  );

  if (monthsSinceLastPeriod >= 12) {
    return {
      stage: 'MENOPAUSE',
      reason: `It has been ${monthsSinceLastPeriod} months since your last period. Menopause is typically diagnosed after 12 months without a period.`,
    };
  }

  if (monthsSinceLastPeriod >= 3) {
    return {
      stage: 'PERIMENOPAUSE',
      reason: `It has been ${monthsSinceLastPeriod} months since your last period. This could indicate perimenopause.`,
    };
  }

  return {
    stage: 'PERIMENOPAUSE',
    reason: 'Regular periods suggest early perimenopause or pre-menopause.',
  };
}

export function getJourneyStatus(lastPeriodDate: string | null): {
  status: string;
  nextMilestone: string;
  progressPercentage: number;
} {
  if (!lastPeriodDate) {
    return {
      status: 'Journey not started',
      nextMilestone: 'Record your last period date to track your journey',
      progressPercentage: 0,
    };
  }

  const monthsSinceLastPeriod = differenceInMonths(
    new Date(),
    parseISO(lastPeriodDate)
  );
  const monthsToMenopause = 12;
  const progressPercentage = Math.min(
    (monthsSinceLastPeriod / monthsToMenopause) * 100,
    100
  );

  if (monthsSinceLastPeriod >= 12) {
    return {
      status: 'Menopause confirmed',
      nextMilestone: 'You have reached menopause',
      progressPercentage: 100,
    };
  }

  return {
    status: 'Tracking period changes',
    nextMilestone: `${
      12 - monthsSinceLastPeriod
    } more months without a period to confirm menopause`,
    progressPercentage,
  };
}

export function formatPeriodDate(date: string): string {
  return format(parseISO(date), 'MMMM d, yyyy');
}
