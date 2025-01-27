import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SymptomForm } from '@/components/symptoms/SymptomForm';
import '@testing-library/jest-dom';

jest.mock('../../error/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const SYMPTOM_FIELDS = [
  { name: 'hotFlashes', label: 'Hot Flashes' },
  { name: 'nightSweats', label: 'Night Sweats' },
  { name: 'moodSwings', label: 'Mood Swings' },
  { name: 'sleepIssues', label: 'Sleep Issues' },
  { name: 'anxiety', label: 'Anxiety' },
  { name: 'fatigue', label: 'Fatigue' },
] as const;

describe('SymptomForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<SymptomForm {...defaultProps} />);

    // Check form is rendered
    expect(
      screen.getByRole('form', { name: 'Symptom Entry Form' })
    ).toBeInTheDocument();

    // Check all symptom fields are rendered
    SYMPTOM_FIELDS.forEach(({ label }) => {
      expect(
        screen.getByRole('spinbutton', { name: new RegExp(label, 'i') })
      ).toBeInTheDocument();
    });

    // Check other form elements
    expect(
      screen.getByRole('combobox', { name: /overall intensity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: /additional notes about your symptoms/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /save symptoms/i })
    ).toBeInTheDocument();
  });

  it('initializes with default values', () => {
    render(<SymptomForm {...defaultProps} />);

    // Check symptom fields default to 0
    SYMPTOM_FIELDS.forEach(({ label }) => {
      expect(
        screen.getByRole('spinbutton', { name: new RegExp(label, 'i') })
      ).toHaveValue(0);
    });

    // Check other defaults
    expect(
      screen.getByRole('combobox', { name: /overall intensity/i })
    ).toHaveValue('MODERATE');
    expect(
      screen.getByRole('textbox', {
        name: /additional notes about your symptoms/i,
      })
    ).toHaveValue('');
  });

  it('initializes with provided values', () => {
    const initialData = {
      date: '2024-01-20',
      hotFlashes: 5,
      nightSweats: 3,
      moodSwings: 7,
      sleepIssues: 4,
      anxiety: 6,
      fatigue: 8,
      intensity: 'SEVERE' as const,
      notes: 'Test notes',
    };

    render(<SymptomForm {...defaultProps} initialData={initialData} />);

    // Check all fields have initial values
    expect(
      screen.getByRole('spinbutton', { name: /hot flashes/i })
    ).toHaveValue(5);
    expect(
      screen.getByRole('spinbutton', { name: /night sweats/i })
    ).toHaveValue(3);
    expect(
      screen.getByRole('spinbutton', { name: /mood swings/i })
    ).toHaveValue(7);
    expect(
      screen.getByRole('spinbutton', { name: /sleep issues/i })
    ).toHaveValue(4);
    expect(screen.getByRole('spinbutton', { name: /anxiety/i })).toHaveValue(6);
    expect(screen.getByRole('spinbutton', { name: /fatigue/i })).toHaveValue(8);
    expect(
      screen.getByRole('combobox', { name: /overall intensity/i })
    ).toHaveValue('SEVERE');
    expect(
      screen.getByRole('textbox', {
        name: /additional notes about your symptoms/i,
      })
    ).toHaveValue('Test notes');
  });

  it('validates numeric input fields', () => {
    render(<SymptomForm {...defaultProps} />);

    const symptomInputs = SYMPTOM_FIELDS.map((field) =>
      screen.getByRole('spinbutton', { name: new RegExp(field.label, 'i') })
    ) as HTMLInputElement[];

    symptomInputs.forEach((input) => {
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '10');
      expect(input).toHaveAttribute('required');
    });
  });

  it('prevents future dates', () => {
    render(<SymptomForm {...defaultProps} />);

    const dateInput = screen
      .getByRole('group', { name: /date/i })
      .querySelector('input');
    expect(dateInput).toHaveAttribute(
      'max',
      new Date().toISOString().split('T')[0]
    );
  });

  it('handles form submission correctly', async () => {
    render(<SymptomForm {...defaultProps} />);

    // Fill out the form
    fireEvent.change(screen.getByRole('spinbutton', { name: /hot flashes/i }), {
      target: { value: '5' },
    });
    fireEvent.change(
      screen.getByRole('spinbutton', { name: /night sweats/i }),
      {
        target: { value: '3' },
      }
    );
    fireEvent.change(
      screen.getByRole('combobox', { name: /overall intensity/i }),
      {
        target: { value: 'SEVERE' },
      }
    );
    fireEvent.change(
      screen.getByRole('textbox', {
        name: /additional notes about your symptoms/i,
      }),
      {
        target: { value: 'Test notes' },
      }
    );

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save symptoms/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          hotFlashes: 5,
          nightSweats: 3,
          intensity: 'SEVERE',
          notes: 'Test notes',
        })
      );
    });
  });

  it('shows loading state during submission', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    render(<SymptomForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /save symptoms/i }));

    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Save Symptoms');
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  it('handles submission errors', async () => {
    const error = new Error('Failed to save symptoms');
    mockOnSubmit.mockRejectedValue(error);

    render(<SymptomForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /save symptoms/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to save symptoms'
      );
    });
  });
});
