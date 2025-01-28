import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { signOut } from 'next-auth/react';
import '@testing-library/jest-dom';

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('SignOutButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign out button', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button', { name: /sign out/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Sign out of your account');
  });

  it('calls signOut when clicked', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('renders with correct styling', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'px-4',
      'py-2',
      'border',
      'border-transparent',
      'text-sm',
      'font-medium',
      'rounded-md',
      'shadow-sm',
      'text-[#E3BAB3]',
      'bg-[#800020]',
      'hover:bg-[#a36c53]'
    );
  });

  it('includes logout icon with correct attributes', () => {
    render(<SignOutButton />);
    const icon = screen.getByTestId('sign-out-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-4', 'h-4', 'mr-2');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('maintains focus states for accessibility', () => {
    render(<SignOutButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-[#B76E79]'
    );
  });
});
