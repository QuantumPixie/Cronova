import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { subMonths, format, parseISO } from 'date-fns';

interface PeriodHistoryProps {
  periodDates: string[];
  cycleLength?: number;
}

export function PeriodHistory({
  periodDates,
  cycleLength = 28,
}: PeriodHistoryProps) {
  const sortedDates = [...periodDates].sort(
    (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
  );

  // Generate data for the last 12 months
  const now = new Date();
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = subMonths(now, 11 - i);
    const monthStr = format(month, 'MMM yyyy');
    const hasRecord = sortedDates.some(
      (date) => format(parseISO(date), 'MMM yyyy') === monthStr
    );

    return {
      month: monthStr,
      hasPeriod: hasRecord ? cycleLength : 0,
      average: cycleLength,
    };
  });

  return (
    <div className='bg-white rounded-lg p-4 border border-[#E3BAB3]'>
      <h3 className='text-[#800020] font-medium mb-4'>Period History</h3>
      <div className='h-64'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={monthlyData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' tick={{ fontSize: 12 }} interval={1} />
            <YAxis
              label={{
                value: 'Days',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
            />
            <Tooltip />
            <Line
              type='monotone'
              dataKey='hasPeriod'
              stroke='#B76E79'
              name='Recorded Period'
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type='monotone'
              dataKey='average'
              stroke='#E3BAB3'
              strokeDasharray='5 5'
              name='Average Cycle'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='mt-4 text-sm text-[#4A4A4A]'>
        <p>• Solid line shows your recorded periods</p>
        <p>• Dashed line shows average cycle length</p>
      </div>
    </div>
  );
}
