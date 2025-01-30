import React from 'react';
import { Star, Smile, Activity, Moon, Battery } from 'lucide-react';

interface MoodSelectorProps {
  value: 'GREAT' | 'GOOD' | 'NEUTRAL' | 'LOW' | 'BAD';
  onChange: (value: 'GREAT' | 'GOOD' | 'NEUTRAL' | 'LOW' | 'BAD') => void;
}

const MOOD_OPTIONS = [
  { value: 'GREAT', icon: Star, label: 'Great' },
  { value: 'GOOD', icon: Smile, label: 'Good' },
  { value: 'NEUTRAL', icon: Activity, label: 'Neutral' },
  { value: 'LOW', icon: Moon, label: 'Low' },
  { value: 'BAD', icon: Battery, label: 'Bad' },
] as const;

const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className='flex flex-col gap-4'>
      <label className='text-sm font-medium text-[#800020]'>
        How are you feeling today?
      </label>
      <div className='grid grid-cols-3 gap-3 sm:flex sm:justify-between sm:gap-4'>
        {MOOD_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type='button'
              onClick={() => onChange(option.value)}
              className={`
                flex flex-col items-center justify-center
                p-2 sm:p-4 sm:px-6
                rounded-lg border-2 transition-all
                min-h-[80px] sm:min-h-[100px]
                sm:min-w-[100px]
                ${
                  isSelected
                    ? 'border-[#800020] bg-[#F7E8E8] text-[#800020] shadow-md'
                    : 'border-[#E3BAB3] hover:border-[#800020] text-[#4A4A4A] hover:bg-[#F7E8E8]/50'
                }
              `}
              aria-label={option.label}
              aria-pressed={isSelected}
            >
              <Icon
                className={`
                  w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2
                  ${isSelected ? 'text-[#800020]' : 'text-[#B76E79]'}
                `}
              />
              <span className='text-xs sm:text-sm font-medium'>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSelector;
