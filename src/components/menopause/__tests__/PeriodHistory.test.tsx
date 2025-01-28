import React from 'react';
import { render, screen } from '@testing-library/react';
import { PeriodHistory } from '@/components/menopause/PeriodHistory';
import '@testing-library/jest-dom';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='responsive-container'>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='line-chart'>{children}</div>
  ),
  Line: () => <div data-testid='line' />,
  XAxis: () => <div data-testid='x-axis' />,
  YAxis: () => <div data-testid='y-axis' />,
  CartesianGrid: () => <div data-testid='cartesian-grid' />,
  Tooltip: () => <div data-testid='tooltip' />,
}));

jest.mock('../../error/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('PeriodHistory', () => {
  const defaultProps = {
    periodDates: ['2024-01-15', '2023-12-15', '2023-11-15'],
    cycleLength: 28,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all necessary elements', () => {
    render(<PeriodHistory {...defaultProps} />);
    expect(screen.getByRole('region')).toHaveAccessibleName(
      'Period History Chart'
    );
    expect(screen.getByText('Period History')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('line')).toHaveLength(2);
  });

  it('renders with custom cycle length', () => {
    render(<PeriodHistory {...defaultProps} cycleLength={35} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('handles empty period dates array', () => {
    render(<PeriodHistory periodDates={[]} cycleLength={28} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('displays the legend information', () => {
    render(<PeriodHistory {...defaultProps} />);
    const legend = screen.getByRole('complementary', { name: 'Chart Legend' });
    expect(legend).toBeInTheDocument();
    expect(legend).toHaveTextContent('Solid line shows your recorded periods');
    expect(legend).toHaveTextContent('Dashed line shows average cycle length');
  });

  it('provides proper ARIA labels for accessibility', () => {
    render(<PeriodHistory {...defaultProps} />);
    expect(screen.getByRole('region')).toHaveAccessibleName(
      'Period History Chart'
    );
    expect(screen.getByLabelText('Chart Legend')).toBeInTheDocument();
  });

  it('applies correct styling', () => {
    render(<PeriodHistory {...defaultProps} />);
    const container = screen.getByRole('region');
    expect(container).toHaveClass(
      'bg-white',
      'rounded-lg',
      'p-4',
      'border',
      'border-[#E3BAB3]'
    );
  });

  it('renders with a single period date', () => {
    render(<PeriodHistory periodDates={['2024-01-15']} cycleLength={28} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('handles future dates correctly', () => {
    const futureDates = ['2025-01-15', '2024-12-15'];
    render(<PeriodHistory periodDates={futureDates} cycleLength={28} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});
