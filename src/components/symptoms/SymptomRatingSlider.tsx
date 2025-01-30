import React from 'react';

interface SymptomRatingSliderProps {
  label: string;
  value: number;
  onChange: (event: { target: { name: string; value: number } }) => void;
  name: string;
  required?: boolean;
}

const SymptomRatingSlider: React.FC<SymptomRatingSliderProps> = ({
  label,
  value,
  onChange,
  name,
  required = true,
}) => {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      target: {
        name,
        value: parseInt(event.target.value, 10),
      },
    });
  };

  // Generate array of numbers 0-10 for labels
  const numbers = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className='mb-6' role='group' aria-labelledby={`${name}-label`}>
      <div className='flex justify-between items-center mb-2'>
        <label
          id={`${name}-label`}
          htmlFor={name}
          className='text-sm font-medium text-[#800020]'
        >
          {label}
        </label>
        <span className='text-lg font-semibold text-[#800020]'>{value}</span>
      </div>
      <div className='relative pt-1'>
        <input
          type='range'
          id={name}
          name={name}
          min={0}
          max={10}
          step={1}
          value={value}
          onChange={handleSliderChange}
          className='w-full h-2 appearance-none rounded cursor-pointer bg-[#E3BAB3] focus:outline-none focus:ring-2 focus:ring-[#800020]'
          required={required}
          style={{
            background: `linear-gradient(to right, #800020 0%, #800020 ${
              value * 10
            }%, #E3BAB3 ${value * 10}%, #E3BAB3 100%)`,
          }}
        />
        <div className='relative w-full mt-2'>
          <div className='flex justify-between'>
            {numbers.map((num) => (
              <div key={num} className='flex flex-col items-center'>
                <div
                  className={`w-1 h-2 mb-1 ${
                    num <= value ? 'bg-[#800020]' : 'bg-[#E3BAB3]'
                  }`}
                />
                <span className='text-xs text-[#4A4A4A]'>{num}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomRatingSlider;
