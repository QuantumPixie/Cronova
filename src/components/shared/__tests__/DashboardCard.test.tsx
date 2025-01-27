import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardCard from '@/components/shared/DashboardCard';
import { Calendar } from 'lucide-react';
import '@testing-library/jest-dom';

// mock next/link
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('DashboardCard', () => {
  const defaultProps = {
    title: 'Test Card',
    description: 'Test Description',
    href: '/test',
    icon: Calendar,
  };

  it('renders basic card elements correctly', () => {
    render(<DashboardCard {...defaultProps} />);

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders stats when provided', () => {
    const propsWithStats = {
      ...defaultProps,
      stats: {
        label: 'Total Entries',
        value: '42',
      },
    };

    render(<DashboardCard {...propsWithStats} />);

    expect(screen.getByText('Total Entries')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders without stats section when stats are not provided', () => {
    render(<DashboardCard {...defaultProps} />);

    expect(screen.queryByText('Total Entries')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    render(<DashboardCard {...defaultProps} />);

    const card = screen.getByTestId('dashboard-card');
    expect(card).toHaveClass(
      'bg-white',
      'rounded-lg',
      'border',
      'border-[#E3BAB3]'
    );
  });

  it('renders icon with correct color class', () => {
    render(<DashboardCard {...defaultProps} />);

    const icon = screen.getByTestId('dashboard-card-icon');
    expect(icon).toHaveClass('text-[#800020]');
  });

  it('renders with gradient background for icon container', () => {
    render(<DashboardCard {...defaultProps} />);

    const iconContainer = screen.getByTestId('dashboard-card-icon-container');
    expect(iconContainer).toHaveClass(
      'bg-gradient-to-r',
      'from-[#E3BAB3]',
      'to-[#B76E79]'
    );
  });
});
