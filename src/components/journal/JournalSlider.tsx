import React from 'react';

interface JournalSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

const JournalSlider: React.FC<JournalSliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
}) => {
  const shouldReduceNumbers = max - min > 10;
  const numbers = Array.from(
    { length: shouldReduceNumbers ? 5 : Math.floor((max - min) / step) + 1 },
    (_, i) =>
      shouldReduceNumbers
        ? min + Math.round((i * (max - min)) / 4)
        : min + i * step
  );

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className='mb-4'>
      <div className='flex justify-between items-center mb-2'>
        <label className='text-sm font-medium text-[#800020]'>{label}</label>
        <span className='text-lg font-semibold text-[#800020]'>
          {value}
          {unit}
        </span>
      </div>
      <div className='relative pt-1 px-1'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className='w-full h-2 appearance-none rounded cursor-pointer bg-[#E3BAB3] focus:outline-none focus:ring-2 focus:ring-[#800020]'
          style={{
            background: `linear-gradient(to right, #800020 0%, #800020 ${percentage}%, #E3BAB3 ${percentage}%, #E3BAB3 100%)`,
          }}
        />
        <div className='relative w-full mt-2'>
          <div className='flex justify-between px-1'>
            {numbers.map((num) => (
              <div
                key={num}
                className='flex flex-col items-center'
                style={{ flex: '0 0 auto' }}
              >
                <div
                  className={`w-1 h-2 mb-1 ${
                    num <= value ? 'bg-[#800020]' : 'bg-[#E3BAB3]'
                  }`}
                />
                <span className='text-xs text-[#4A4A4A] whitespace-nowrap'>
                  {num}
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalSlider;
