import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PeriodTracker } from '@/components/menopause/PeriodTracker';
import '@testing-library/jest-dom';

jest.mock('date-fns', () => ({
  parseISO: jest.fn((str) => new Date(str)),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format: jest.fn((date, _) => {
    if (date instanceof Date) {
      return 'January 15, 2024';
    }
    return date;
  }),
}));

describe('PeriodTracker', () => {
  const mockOnUpdatePeriod = jest.fn();
  const defaultProps = {
    lastPeriodDate: '2024-01-15',
    onUpdatePeriod: mockOnUpdatePeriod,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the period tracker with last period date', () => {
    render(<PeriodTracker {...defaultProps} />);

    expect(screen.getByText('Period Tracker')).toBeInTheDocument();
    expect(screen.getByText(/Last Recorded Period:/)).toBeInTheDocument();
    expect(screen.getByLabelText('Record New Period')).toBeInTheDocument();
  });

  it('displays formatted last period date', () => {
    render(<PeriodTracker {...defaultProps} />);

    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
  });

  it('handles new period date submission', async () => {
    render(<PeriodTracker {...defaultProps} />);

    const dateInput = screen.getByLabelText('Record New Period');
    const submitButton = screen.getByRole('button', { name: /Record Period/i });

    fireEvent.change(dateInput, { target: { value: '2024-01-20' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnUpdatePeriod).toHaveBeenCalledWith('2024-01-20');
    });
  });

  it('shows loading state during submission', async () => {
    mockOnUpdatePeriod.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<PeriodTracker {...defaultProps} />);

    const dateInput = screen.getByLabelText('Record New Period');
    const submitButton = screen.getByRole('button', { name: /Record Period/i });

    fireEvent.change(dateInput, { target: { value: '2024-01-20' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Recording...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Record Period')).toBeInTheDocument();
    });
  });

  it('handles error states', async () => {
    const error = new Error('Failed to update');
    mockOnUpdatePeriod.mockRejectedValue(error);

    render(<PeriodTracker {...defaultProps} />);

    const dateInput = screen.getByLabelText('Record New Period');
    const submitButton = screen.getByRole('button', { name: /Record Period/i });

    fireEvent.change(dateInput, { target: { value: '2024-01-20' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to update')).toBeInTheDocument();
    });
  });

  it('prevents future dates from being selected', () => {
    render(<PeriodTracker {...defaultProps} />);

    const dateInput = screen.getByLabelText('Record New Period');
    const today = new Date().toISOString().split('T')[0];

    expect(dateInput).toHaveAttribute('max', today);
  });

  it('renders correctly without last period date', () => {
    render(
      <PeriodTracker
        lastPeriodDate={null}
        onUpdatePeriod={mockOnUpdatePeriod}
      />
    );

    expect(screen.queryByText(/Last Recorded Period:/)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Record New Period')).toBeInTheDocument();
  });
});
