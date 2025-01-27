import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import '@testing-library/jest-dom';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid='normal-content'>Normal render</div>;
};

const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(
      screen.getByText(/encountered an unexpected error/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /try again/i })
    ).toBeInTheDocument();
  });

  it('allows recovery via try again button', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    unmount();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('normal-content')).toBeInTheDocument();
  });

  it('logs error information to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('resets error state when new children are provided', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    unmount();

    render(
      <ErrorBoundary>
        <div data-testid='new-content'>New content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('new-content')).toBeInTheDocument();
  });

  it('displays error UI with correct styling', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const outerContainer = screen.getByTestId('error-boundary-root');
    expect(outerContainer).toHaveClass(
      'min-h-screen',
      'bg-gradient-to-b',
      'from-[#F5F2F2]',
      'to-[#F7E8E8]',
      'flex',
      'items-center',
      'justify-center'
    );

    const errorCard = screen.getByTestId('error-boundary-card');
    expect(errorCard).toHaveClass(
      'text-center',
      'p-8',
      'bg-white',
      'rounded-lg',
      'shadow-md',
      'border',
      'border-[#E3BAB3]'
    );
  });

  it('applies correct styling to try again button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainButton).toHaveClass(
      'rounded',
      'bg-[#800020]',
      'px-4',
      'py-2',
      'text-[#E3BAB3]',
      'hover:bg-[#a36c53]',
      'transition-colors'
    );
  });

  it('maintains error state until explicitly reset', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const errorHeading = screen.getByRole('heading', {
      name: 'Something went wrong',
    });
    expect(errorHeading).toBeInTheDocument();
    expect(screen.queryByTestId('normal-content')).not.toBeInTheDocument();
  });
});
