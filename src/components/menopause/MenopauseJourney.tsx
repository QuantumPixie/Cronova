import React from 'react';
import { LineChart, Clock, Calendar, Info, ArrowRight } from 'lucide-react';
import { differenceInMonths, parseISO } from 'date-fns';
import PeriodHistory from './PeriodHistory';
import { ErrorBoundary } from '../error/ErrorBoundary';

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

  const getProgressColor = () => {
    if (progressPercentage >= 75) return 'bg-[#800020]';
    if (progressPercentage >= 50) return 'bg-[#B76E79]';
    return 'bg-[#E3BAB3]';
  };

  return (
    <ErrorBoundary>
      <div className='space-y-6'>
        {/* Main Journey Card */}
        <div className='bg-white rounded-lg border border-[#E3BAB3] overflow-hidden'>
          {/* Header */}
          <div className='p-4 border-b border-[#E3BAB3] bg-gradient-to-r from-[#F5F2F2] to-[#F7E8E8]'>
            <div className='flex items-center gap-2'>
              <LineChart
                className='w-5 h-5 text-[#800020]'
                aria-hidden='true'
              />
              <h2 className='text-lg font-semibold text-[#800020]'>
                Your Menopause Journey
              </h2>
            </div>
          </div>

          <div className='p-4 space-y-6'>
            {/* Current Stage */}
            <div className='flex items-start gap-4'>
              <Calendar
                className='w-5 h-5 text-[#B76E79] mt-1'
                aria-hidden='true'
              />
              <div>
                <div className='flex items-center gap-2'>
                  <p className='font-medium text-[#800020]'>
                    Current Stage:
                    <span className='ml-2 px-3 py-1 bg-[#F5F2F2] rounded-full text-sm'>
                      {currentStage.toLowerCase()}
                    </span>
                  </p>
                </div>
                <p className='text-[#4A4A4A] mt-2'>
                  {getStageDescription(currentStage, monthsSinceLastPeriod)}
                </p>
              </div>
            </div>

            {/* Progress Tracking */}
            {lastPeriodDate && (
              <div className='flex items-start gap-4'>
                <Clock
                  className='w-5 h-5 text-[#B76E79] mt-1'
                  aria-hidden='true'
                />
                <div className='flex-1'>
                  <h3 className='font-medium text-[#800020]'>
                    Progress Tracking
                  </h3>
                  <div className='mt-4'>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-[#4A4A4A]'>
                        Progress to Menopause
                      </span>
                      <span className='font-medium text-[#800020]'>
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className='h-2 bg-[#F5F2F2] rounded-full overflow-hidden'>
                      <div
                        className={`h-full ${getProgressColor()} transition-all duration-500`}
                        style={{ width: `${progressPercentage}%` }}
                        role='progressbar'
                        aria-valuenow={Math.round(progressPercentage)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className='text-sm text-[#4A4A4A] mt-2'>
                      {monthsSinceLastPeriod} / 12 months completed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Period History */}
        <PeriodHistory
          periodDates={[
            ...periodDates,
            ...(lastPeriodDate ? [lastPeriodDate] : []),
          ]}
        />

        {/* Journey Information */}
        <div className='bg-white rounded-lg border border-[#E3BAB3] p-4'>
          <div className='flex items-center gap-2 mb-4'>
            <Info className='w-5 h-5 text-[#800020]' aria-hidden='true' />
            <h3 className='font-medium text-[#800020]'>
              Understanding Your Journey
            </h3>
          </div>

          <div className='space-y-4'>
            <div className='relative pl-6 pb-4'>
              <div className='absolute left-0 top-2 w-2 h-2 rounded-full bg-[#E3BAB3]' />
              <div className='border-l-2 border-[#E3BAB3] pl-4 ml-[3px] pb-4'>
                <h4 className='font-medium text-[#800020] flex items-center gap-2'>
                  Perimenopause
                  <ArrowRight className='w-4 h-4' aria-hidden='true' />
                </h4>
                <p className='text-sm text-[#4A4A4A] mt-1'>
                  Period changes begin, varying cycle lengths
                </p>
              </div>
            </div>

            <div className='relative pl-6 pb-4'>
              <div className='absolute left-0 top-2 w-2 h-2 rounded-full bg-[#B76E79]' />
              <div className='border-l-2 border-[#B76E79] pl-4 ml-[3px] pb-4'>
                <h4 className='font-medium text-[#800020] flex items-center gap-2'>
                  Menopause
                  <ArrowRight className='w-4 h-4' aria-hidden='true' />
                </h4>
                <p className='text-sm text-[#4A4A4A] mt-1'>
                  Confirmed after 12 months without a period
                </p>
              </div>
            </div>

            <div className='relative pl-6'>
              <div className='absolute left-0 top-2 w-2 h-2 rounded-full bg-[#800020]' />
              <div className='pl-4'>
                <h4 className='font-medium text-[#800020] flex items-center gap-2'>
                  Post-menopause
                </h4>
                <p className='text-sm text-[#4A4A4A] mt-1'>
                  New phase of life, focus on well-being
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
