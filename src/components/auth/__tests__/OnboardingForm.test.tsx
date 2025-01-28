import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingForm } from '@/components/auth/OnboardingForm';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('OnboardingForm', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      status: 'authenticated',
      update: mockUpdate,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the initial form step', () => {
    render(<OnboardingForm />);
    expect(screen.getByText('Welcome to CroNova')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: /what stage are you in/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('Select your last period date')
    ).not.toBeInTheDocument();
  });

  it('progresses to second step when stage is selected', async () => {
    render(<OnboardingForm />);

    const stageSelect = screen.getByRole('combobox', {
      name: /what stage are you in/i,
    });
    fireEvent.change(stageSelect, { target: { value: 'PERIMENOPAUSE' } });

    await waitFor(() => {
      expect(
        screen.getByLabelText('Select your last period date')
      ).toBeInTheDocument();
    });
  });

  it('submits form data successfully', async () => {
    render(<OnboardingForm />);

    const stageSelect = screen.getByRole('combobox', {
      name: /what stage are you in/i,
    });
    fireEvent.change(stageSelect, { target: { value: 'PERIMENOPAUSE' } });

    await waitFor(() => {
      const dateInput = screen.getByLabelText('Select your last period date');
      fireEvent.change(dateInput, { target: { value: '2024-01-01' } });
      const submitButton = screen.getByRole('button', {
        name: /complete setup/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('handles form submission errors', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Failed to save preferences' }),
    });

    render(<OnboardingForm />);

    const stageSelect = screen.getByRole('combobox', {
      name: /what stage are you in/i,
    });
    fireEvent.change(stageSelect, { target: { value: 'PERIMENOPAUSE' } });

    await waitFor(() => {
      const dateInput = screen.getByLabelText('Select your last period date');
      fireEvent.change(dateInput, { target: { value: '2024-01-01' } });
      const submitButton = screen.getByRole('button', {
        name: /complete setup/i,
      });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to save preferences'
      );
    });
  });

  it('disables submit button while loading', async () => {
    render(<OnboardingForm />);

    const stageSelect = screen.getByRole('combobox', {
      name: /what stage are you in/i,
    });
    fireEvent.change(stageSelect, { target: { value: 'PERIMENOPAUSE' } });

    await waitFor(() => {
      const submitButton = screen.getByRole('button');
      fireEvent.click(submitButton);
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Saving...');
    });
  });

  it('validates required fields', async () => {
    render(<OnboardingForm />);

    const stageSelect = screen.getByRole('combobox', {
      name: /what stage are you in/i,
    });
    expect(stageSelect).toBeRequired();
    expect(stageSelect).toHaveValue('');

    const form = screen.getByRole('form', { name: /profile setup/i });
    fireEvent.submit(form);

    await waitFor(() => {
      // Form should show validation errors and prevent submission
      expect(stageSelect).toBeInvalid();
      expect(stageSelect).toHaveAttribute('aria-required', 'true');
    });
  });

  it('applies correct styling to form elements', () => {
    render(<OnboardingForm />);

    const formContainer = screen.getByRole('region', {
      name: /onboarding form/i,
    });
    expect(formContainer).toHaveClass(
      'max-w-md',
      'mx-auto',
      'p-6',
      'bg-white',
      'rounded-lg',
      'shadow-md',
      'border',
      'border-[#E3BAB3]'
    );
  });
});
