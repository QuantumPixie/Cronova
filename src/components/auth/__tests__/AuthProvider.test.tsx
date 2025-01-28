import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import '@testing-library/jest-dom';

jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('AuthProvider', () => {
  const mockChildren = <div data-testid='test-child'>Test Content</div>;

  it('renders children within SessionProvider', () => {
    render(<AuthProvider>{mockChildren}</AuthProvider>);
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toHaveTextContent('Test Content');
  });

  it('applies correct ARIA attributes', () => {
    render(<AuthProvider>{mockChildren}</AuthProvider>);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveAttribute('aria-live', 'polite');
  });

  it('maintains child content and structure', () => {
    const complexChildren = (
      <div data-testid='complex-child'>
        <h1>Title</h1>
        <p>Content</p>
      </div>
    );

    render(<AuthProvider>{complexChildren}</AuthProvider>);
    const childElement = screen.getByTestId('complex-child');
    expect(childElement).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
