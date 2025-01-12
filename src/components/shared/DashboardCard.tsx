import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  stats?: {
    label: string;
    value: string | number;
  };
}

export default function DashboardCard({
  title,
  description,
  href,
  icon: Icon,
  stats,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className='group block'
      aria-labelledby={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className='bg-white rounded-lg border border-[#E3BAB3] shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:border-[#B76E79]'>
        <div className='p-6'>
          <div className='flex items-start space-x-4'>
            <div className='flex-shrink-0'>
              <div className='p-3 bg-gradient-to-r from-[#E3BAB3] to-[#B76E79] rounded-lg group-hover:from-[#B76E79] group-hover:to-[#E3BAB3] transition-colors'>
                <Icon className='w-6 h-6 text-[#800020]' aria-hidden='true' />
              </div>
            </div>
            <div className='flex-1 min-w-0'>
              <h3
                id={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
                className='text-lg font-semibold text-[#800020] group-hover:text-[#a36c53] transition-colors'
              >
                {title}
              </h3>
              <p className='mt-1 text-sm text-[#4A4A4A]'>{description}</p>
              {stats && (
                <div className='mt-4 pt-4 border-t border-[#E3BAB3]'>
                  <div className='flex justify-between items-baseline'>
                    <p className='text-sm font-medium text-[#4A4A4A]'>
                      {stats.label}
                    </p>
                    <p
                      className='text-2xl font-semibold text-[#800020]'
                      aria-label={`${stats.label}: ${stats.value}`}
                    >
                      {stats.value}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
