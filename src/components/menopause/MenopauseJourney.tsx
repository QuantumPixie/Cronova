import React from 'react';
import { LineChart, Clock, Calendar } from 'lucide-react';
import { differenceInMonths, parseISO, format } from 'date-fns';
import { PeriodHistory } from './PeriodHistory';

interface MenopauseJourneyProps {
  lastPeriodDate: string | null;
  currentStage: string;
  periodDates?: string[];
}

export function MenopauseJourney({
  lastPeriodDate,
  currentStage,
  periodDates = [],
}: MenopauseJourneyProps) {
  const monthsSinceLastPeriod = lastPeriodDate
    ? differenceInMonths(new Date(), parseISO(lastPeriodDate))
    : 0;

  const monthsToMenopause = 12;
  const progressPercentage = Math.min(
    (monthsSinceLastPeriod / monthsToMenopause) * 100,
    100
  );

  function getStageDescription(stage: string, months: number): string {
    if (months >= 12) {
      return 'You have reached menopause (12+ months without a period).';
    }

    if (months > 0) {
      return `${
        12 - months
      } more months without a period to confirm menopause.`;
    }

    switch (stage) {
      case 'PERIMENOPAUSE':
        return 'Early stage with changing periods. Track symptoms and period changes.';
      case 'MENOPAUSE':
        return 'Transition period. Track months without periods.';
      case 'POSTMENOPAUSE':
        return 'Post-menopausal stage. Continue monitoring symptoms.';
      default:
        return 'Start tracking your journey by recording your periods.';
    }
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-[#E3BAB3] p-6'>
      <div className='flex items-center gap-2 mb-6'>
        <LineChart className='w-5 h-5 text-[#800020]' />
        <h2 className='text-lg font-semibold text-[#800020]'>
          Your Menopause Journey
        </h2>
      </div>

      <div className='space-y-6'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <Calendar className='w-4 h-4 text-[#B76E79]' />
            <span className='font-medium text-[#800020]'>
              Current Stage: {currentStage.toLowerCase()}
            </span>
          </div>
          <p className='text-[#4A4A4A] ml-6'>
            {getStageDescription(currentStage, monthsSinceLastPeriod)}
          </p>
        </div>

        {lastPeriodDate && (
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <Clock className='w-4 h-4 text-[#B76E79]' />
              <span className='font-medium text-[#800020]'>
                Progress Tracking
              </span>
            </div>
            <div className='ml-6'>
              <p className='text-[#4A4A4A] mb-2'>
                Last Period: {format(parseISO(lastPeriodDate), 'MMMM d, yyyy')}
              </p>
              <div className='relative pt-1'>
                <div className='flex mb-2 items-center justify-between'>
                  <div>
                    <span className='text-xs font-semibold inline-block text-[#800020]'>
                      {Math.round(progressPercentage)}% towards confirming
                      menopause
                    </span>
                  </div>
                  <div className='text-right'>
                    <span className='text-xs font-semibold inline-block text-[#800020]'>
                      {monthsSinceLastPeriod} / 12 months
                    </span>
                  </div>
                </div>
                <div className='overflow-hidden h-2 text-xs flex rounded bg-[#E3BAB3]'>
                  <div
                    style={{ width: `${progressPercentage}%` }}
                    className='shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#800020] transition-all duration-500'
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <PeriodHistory
          periodDates={[
            ...periodDates,
            ...(lastPeriodDate ? [lastPeriodDate] : []),
          ]}
        />

        <div className='border-t border-[#E3BAB3] pt-4'>
          <h3 className='text-sm font-medium text-[#800020] mb-2'>
            Understanding Your Journey
          </h3>
          <ul className='text-sm text-[#4A4A4A] space-y-2'>
            <li>
              • Perimenopause: Period changes begin, varying cycle lengths
            </li>
            <li>• Menopause: Confirmed after 12 months without a period</li>
            <li>• Post-menopause: New phase of life, focus on well-being</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
