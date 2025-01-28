import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { usePathname } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image({ src, alt, width, height, ...props }: ImageProps) {
    return (
    //   eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} width={width} height={height} {...props} />
    );
  },
}));

describe('DashboardLayout', () => {
  const mockChildren = <div data-testid='mock-children'>Test Content</div>;

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  it('renders the layout with navigation and content', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    expect(
      screen.getByRole('navigation', { name: /main navigation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('mock-children')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Symptoms')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('highlights the current active page', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard/symptoms');
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    const symptomsLink = screen.getByRole('link', { name: /symptoms/i });
    expect(symptomsLink).toHaveClass('bg-[#800020]', 'text-[#E3BAB3]');
    expect(symptomsLink).not.toHaveClass(
      'text-[#800020]',
      'hover:bg-[#DCB1A7]'
    );
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    const mobileNav = screen.getByRole('navigation', {
      name: /mobile navigation/i,
    });
    expect(mobileNav).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    fireEvent.click(closeButton);
    expect(
      screen.queryByRole('navigation', { name: /mobile navigation/i })
    ).not.toBeInTheDocument();
  });

  it('renders logo and branding', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    expect(screen.getByAltText('CroNova Logo')).toBeInTheDocument();
    expect(screen.getByText('CroNova')).toBeInTheDocument();
  });

  it('applies correct styling to navigation links', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    const overview = screen.getByRole('link', { name: /overview/i });
    expect(overview).toHaveClass('inline-flex', 'items-center', 'px-4', 'py-2');
  });

  it('renders settings link', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute('href', '/dashboard/settings');
  });

  it('closes mobile menu when navigation item is clicked', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);

    // Open mobile menu
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(menuButton);

    // Verify mobile menu is open
    expect(
      screen.getByRole('navigation', { name: /mobile navigation/i })
    ).toBeInTheDocument();

    // Click the Overview link and simulate state update
    const mobileOverviewLink = screen.getAllByRole('link', {
      name: /overview/i,
    })[1];
    fireEvent.click(mobileOverviewLink);

    // Force rerender to simulate state update
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);

    // Verify mobile menu is closed
    expect(
      screen.queryByRole('navigation', { name: /mobile navigation/i })
    ).not.toBeInTheDocument();
  });

  it('maintains accessibility in mobile view', () => {
    render(<DashboardLayout>{mockChildren}</DashboardLayout>);
    const menuButton = screen.getByRole('button', { name: /open menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuButton);
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
  });
});
