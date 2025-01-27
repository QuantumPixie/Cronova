import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JournalForm } from '@/components/journal/JournalForm';
import '@testing-library/jest-dom';

jest.mock('../../error/ErrorBoundary.tsx', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('JournalForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<JournalForm {...defaultProps} />);

    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /hours of sleep/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /mood/i })).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: /exercise today/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: /stress level/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: /additional notes about your day/i })
    ).toBeInTheDocument();
  });

  it('initializes with default values', () => {
    render(<JournalForm {...defaultProps} />);

    expect(
      screen.getByRole('spinbutton', { name: /hours of sleep/i })
    ).toHaveValue(0);
    expect(screen.getByRole('combobox', { name: /mood/i })).toHaveValue(
      'NEUTRAL'
    );
    expect(
      screen.getByRole('checkbox', { name: /exercise today/i })
    ).not.toBeChecked();
    expect(
      screen.getByRole('spinbutton', { name: /stress level/i })
    ).toHaveValue(0);
    expect(
      screen.getByRole('textbox', { name: /additional notes about your day/i })
    ).toHaveValue('');
  });

  it('initializes with provided values', () => {
    const initialData = {
      date: '2024-01-20',
      mood: 'GOOD' as const,
      sleep: 8,
      exercise: true,
      stress: 5,
      notes: 'Test notes',
    };

    render(<JournalForm {...defaultProps} initialData={initialData} />);

    expect(
      screen.getByRole('spinbutton', { name: /hours of sleep/i })
    ).toHaveValue(8);
    expect(screen.getByRole('combobox', { name: /mood/i })).toHaveValue('GOOD');
    expect(
      screen.getByRole('checkbox', { name: /exercise today/i })
    ).toBeChecked();
    expect(
      screen.getByRole('spinbutton', { name: /stress level/i })
    ).toHaveValue(5);
    expect(
      screen.getByRole('textbox', { name: /additional notes about your day/i })
    ).toHaveValue('Test notes');
  });

  it('handles form submission correctly', async () => {
    render(<JournalForm {...defaultProps} />);

    // Fill out the form
    fireEvent.change(
      screen.getByRole('spinbutton', { name: /hours of sleep/i }),
      {
        target: { value: '8' },
      }
    );
    fireEvent.change(screen.getByRole('combobox', { name: /mood/i }), {
      target: { value: 'GOOD' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: /exercise today/i }));
    fireEvent.change(
      screen.getByRole('spinbutton', { name: /stress level/i }),
      {
        target: { value: '5' },
      }
    );
    fireEvent.change(
      screen.getByRole('textbox', { name: /additional notes about your day/i }),
      {
        target: { value: 'Test notes' },
      }
    );

    // Submit the form
    fireEvent.click(
      screen.getByRole('button', { name: /Save Journal Entry/i })
    );

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          mood: 'GOOD',
          sleep: 8,
          exercise: true,
          stress: 5,
          notes: 'Test notes',
          diet: [],
        })
      );
    });
  });

  it('shows loading state during submission', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<JournalForm {...defaultProps} />);

    fireEvent.click(
      screen.getByRole('button', { name: /Save Journal Entry/i })
    );

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent(
        'Save Journal Entry'
      );
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('handles submission errors', async () => {
    const error = new Error('Failed to save journal entry');
    mockOnSubmit.mockRejectedValue(error);

    render(<JournalForm {...defaultProps} />);

    fireEvent.click(
      screen.getByRole('button', { name: /Save Journal Entry/i })
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to save journal entry'
      );
    });
  });

  it('validates numeric input fields', () => {
    render(<JournalForm {...defaultProps} />);

    const sleepInput = screen.getByRole('spinbutton', {
      name: /hours of sleep/i,
    });
    const stressInput = screen.getByRole('spinbutton', {
      name: /stress level/i,
    });

    expect(sleepInput).toHaveAttribute('min', '0');
    expect(sleepInput).toHaveAttribute('max', '24');
    expect(stressInput).toHaveAttribute('min', '0');
    expect(stressInput).toHaveAttribute('max', '10');
  });

  it('prevents future dates', () => {
    render(<JournalForm {...defaultProps} />);

    const dateInput = screen
      .getByRole('group', { name: /date/i })
      .querySelector('input');
    expect(dateInput).toHaveAttribute(
      'max',
      new Date().toISOString().split('T')[0]
    );
  });
});
