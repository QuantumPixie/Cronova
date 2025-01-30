import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { subMonths, format, parseISO, differenceInDays } from 'date-fns';

interface PeriodHistoryProps {
  periodDates: string[];
  cycleLength?: number;
}

interface ChartDataPoint {
  month: string;
  monthStart: string;
  hasPeriod: number | null;
  cycleLength: number;
  predicted?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
  label?: string;
}

const PeriodHistory = ({
  periodDates,
  cycleLength = 28,
}: PeriodHistoryProps) => {
  const sortedDates = useMemo(
    () =>
      [...periodDates].sort(
        (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
      ),
    [periodDates]
  );

  const chartData: ChartDataPoint[] = useMemo(() => {
    const today = new Date();
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(today, 5 - i);
      const monthStr = format(month, 'MMM yyyy');
      const periodDate = sortedDates.find(
        (date) => format(parseISO(date), 'MMM yyyy') === monthStr
      );

      return {
        month: monthStr,
        monthStart: format(month, 'yyyy-MM-dd'),
        hasPeriod: periodDate
          ? differenceInDays(parseISO(periodDate), month)
          : null,
        cycleLength: cycleLength,
        predicted: false,
      };
    });

    // current cycle prediction
    if (sortedDates.length > 0) {
      const lastPeriod = parseISO(sortedDates[sortedDates.length - 1]);
      const nextPredicted = new Date(lastPeriod);
      nextPredicted.setDate(nextPredicted.getDate() + cycleLength);

      if (nextPredicted > today) {
        monthlyData.push({
          month: format(nextPredicted, 'MMM yyyy'),
          monthStart: format(nextPredicted, 'yyyy-MM-dd'),
          hasPeriod: null,
          cycleLength: cycleLength,
          predicted: true,
        });
      }
    }

    return monthlyData;
  }, [sortedDates, cycleLength]);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className='bg-white p-3 rounded shadow-lg border border-[#E3BAB3]'>
        <p className='font-medium text-[#800020]'>{label}</p>
        {payload[0].payload.hasPeriod !== null && (
          <p className='text-sm text-[#4A4A4A]'>
            Period on day: {payload[0].payload.hasPeriod}
          </p>
        )}
        {payload[0].payload.predicted && (
          <p className='text-sm text-[#B76E79]'>Predicted next period</p>
        )}
      </div>
    );
  };

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-lg p-4 border border-[#E3BAB3]'>
        <h3 className='text-lg font-medium text-[#800020] mb-4'>
          Period History
        </h3>

        <div className='h-64 md:h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#E3BAB3' />
              <XAxis
                dataKey='month'
                tick={{ fill: '#4A4A4A', fontSize: 12 }}
                tickLine={{ stroke: '#E3BAB3' }}
                axisLine={{ stroke: '#E3BAB3' }}
              />
              <YAxis
                domain={[0, 31]}
                ticks={[1, 7, 14, 21, 28]}
                tick={{ fill: '#4A4A4A', fontSize: 12 }}
                tickLine={{ stroke: '#E3BAB3' }}
                axisLine={{ stroke: '#E3BAB3' }}
                label={{
                  value: 'Day of Month',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#4A4A4A', fontSize: 12 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Actual periods */}
              <Line
                type='monotone'
                dataKey='hasPeriod'
                stroke='#800020'
                strokeWidth={2}
                dot={{ r: 4, fill: '#800020' }}
                activeDot={{ r: 6, fill: '#800020' }}
                name='Period'
              />

              {/* Cycle length reference */}
              <ReferenceLine
                y={cycleLength}
                stroke='#B76E79'
                strokeDasharray='3 3'
                label={{
                  value: `${cycleLength}-day cycle`,
                  position: 'right',
                  fill: '#B76E79',
                  fontSize: 12,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-4 flex flex-wrap gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-[#800020]' />
            <span className='text-[#4A4A4A]'>Recorded Period</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full border-2 border-[#B76E79]' />
            <span className='text-[#4A4A4A]'>Predicted Period</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-0.5 bg-[#B76E79]' />
            <span className='text-[#4A4A4A]'>Average Cycle Length</span>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-lg p-4 border border-[#E3BAB3]'>
        <h4 className='text-sm font-medium text-[#800020] mb-2'>
          Recent Periods
        </h4>
        <div className='space-y-2'>
          {sortedDates
            .slice(-3)
            .reverse()
            .map((date, index) => (
              <div key={date} className='flex justify-between text-sm'>
                <span className='text-[#4A4A4A]'>
                  {index === 0 ? 'Last Period' : `Previous Period ${index}`}
                </span>
                <span className='font-medium text-[#800020]'>
                  {format(parseISO(date), 'MMM d, yyyy')}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PeriodHistory;
