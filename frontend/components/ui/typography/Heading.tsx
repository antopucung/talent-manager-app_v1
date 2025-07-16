import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'display' | 'heading' | 'subheading';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const headingStyles = {
  display: {
    1: 'text-5xl md:text-7xl font-bold font-display tracking-tight leading-none',
    2: 'text-4xl md:text-6xl font-bold font-display tracking-tight leading-none',
    3: 'text-3xl md:text-5xl font-bold font-display tracking-tight',
    4: 'text-2xl md:text-4xl font-bold font-display tracking-tight',
    5: 'text-xl md:text-3xl font-bold font-display',
    6: 'text-lg md:text-2xl font-bold font-display',
  },
  heading: {
    1: 'text-3xl md:text-5xl font-semibold font-display tracking-tight',
    2: 'text-2xl md:text-4xl font-semibold font-display tracking-tight',
    3: 'text-xl md:text-3xl font-semibold font-display',
    4: 'text-lg md:text-2xl font-semibold font-display',
    5: 'text-base md:text-xl font-semibold font-display',
    6: 'text-sm md:text-lg font-semibold font-display',
  },
  subheading: {
    1: 'text-xl md:text-3xl font-medium text-neutral-600',
    2: 'text-lg md:text-2xl font-medium text-neutral-600',
    3: 'text-base md:text-xl font-medium text-neutral-600',
    4: 'text-sm md:text-lg font-medium text-neutral-600',
    5: 'text-xs md:text-base font-medium text-neutral-600',
    6: 'text-xs md:text-sm font-medium text-neutral-600',
  },
};

export function Heading({ 
  children, 
  level = 1, 
  variant = 'heading',
  className,
  as
}: HeadingProps) {
  const Component = as || (`h${level}` as const);
  
  return (
    <Component className={cn(
      headingStyles[variant][level],
      className
    )}>
      {children}
    </Component>
  );
}
