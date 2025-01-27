import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MenopauseJourney } from '@/components/menopause/MenopauseJourney';
import { differenceInMonths, parseISO, format } from 'date-fns';
import '@testing-library/jest-dom';

jest.mock('date-fns', () => ({
  differenceInMonths: jest.fn(),
  parseISO: jest.fn(),
  format: jest.fn(),
}));

jest.mock('../../error/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('../PeriodHistory', () => ({
  PeriodHistory: () => (
    <div data-testid='period-history'>Period History Mock</div>
  ),
}));

describe('MenopauseJourney', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockDate = new Date('2024-01-27');

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (format as jest.Mock).mockImplementation((date, formatStr) => '2024-01-27');
    (parseISO as jest.Mock).mockImplementation((dateStr) => new Date(dateStr));
    (differenceInMonths as jest.Mock).mockImplementation(() => 6);
  });

  const defaultProps = {
    lastPeriodDate: '2023-07-27',
    currentStage: 'PERIMENOPAUSE',
    periodDates: ['2023-07-27', '2023-06-27', '2023-05-27'],
  };

  it('renders the basic component structure', () => {
    render(<MenopauseJourney {...defaultProps} />);

    expect(
      screen.getByRole('region', { name: /menopause journey tracker/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Your Menopause Journey')).toBeInTheDocument();
    expect(screen.getByText(/current stage:/i)).toBeInTheDocument();
    expect(screen.getByTestId('period-history')).toBeInTheDocument();
  });

  it('displays current stage and description', () => {
    render(<MenopauseJourney {...defaultProps} />);

    expect(
      screen.getByText(/current stage: perimenopause/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText('6 more months without a period to confirm menopause.')
    ).toBeInTheDocument();
  });

  it('handles different menopause stages', () => {
    const stages = [
      {
        stage: 'PERIMENOPAUSE',
        months: 0,
        expectedText:
          'Early stage with changing periods. Track symptoms and period changes.',
      },
      {
        stage: 'MENOPAUSE',
        months: 6,
        expectedText: '6 more months without a period to confirm menopause.',
      },
      {
        stage: 'POSTMENOPAUSE',
        months: 12,
        expectedText:
          'You have reached menopause (12+ months without a period).',
      },
    ];

    stages.forEach(({ stage, months, expectedText }) => {
      cleanup();
      (differenceInMonths as jest.Mock).mockReturnValue(months);

      render(<MenopauseJourney {...defaultProps} currentStage={stage} />);

      const stageDescription = screen.getByText(expectedText);
      expect(stageDescription).toBeInTheDocument();
    });
  });

  it('displays progress tracking when last period date is provided', () => {
    render(<MenopauseJourney {...defaultProps} />);

    expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
    expect(screen.getByText(/Last Period: 2024-01-27/)).toBeInTheDocument();

    const progressbar = screen.getByLabelText(
      'Progress towards confirming menopause'
    );
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('does not display progress tracking when last period date is null', () => {
    render(<MenopauseJourney {...defaultProps} lastPeriodDate={null} />);

    expect(screen.queryByText('Progress Tracking')).not.toBeInTheDocument();
  });

  it('calculates progress percentage correctly', () => {
    const scenarios = [
      { months: 0, expected: 0 },
      { months: 6, expected: 50 },
      { months: 12, expected: 100 },
      { months: 24, expected: 100 },
    ];

    scenarios.forEach(({ months, expected }) => {
      cleanup();
      (differenceInMonths as jest.Mock).mockReturnValue(months);

      render(<MenopauseJourney {...defaultProps} />);

      const progressbar = screen.getByLabelText(
        'Progress towards confirming menopause'
      );
      expect(progressbar).toHaveAttribute('aria-valuenow', expected.toString());
    });
  });

  it('displays journey information section', () => {
    render(<MenopauseJourney {...defaultProps} />);

    const journeyInfo = screen.getByRole('complementary', {
      name: 'Journey information',
    });
    expect(journeyInfo).toBeInTheDocument();
    expect(journeyInfo).toHaveTextContent(
      'Perimenopause: Period changes begin'
    );
    expect(journeyInfo).toHaveTextContent(
      'Menopause: Confirmed after 12 months without a period'
    );
    expect(journeyInfo).toHaveTextContent('Post-menopause: New phase of life');
  });

  it('passes correct period dates to PeriodHistory component', () => {
    const periodDates = ['2023-07-27', '2023-06-27'];
    render(
      <MenopauseJourney
        {...defaultProps}
        periodDates={periodDates}
        lastPeriodDate='2023-08-27'
      />
    );

    expect(screen.getByTestId('period-history')).toBeInTheDocument();
  });
});
