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
    1: 'text-6xl md:text-8xl font-black font-display tracking-tight leading-none',
    2: 'text-5xl md:text-7xl font-black font-display tracking-tight leading-none',
    3: 'text-4xl md:text-6xl font-bold font-display tracking-tight',
    4: 'text-3xl md:text-5xl font-bold font-display tracking-tight',
    5: 'text-2xl md:text-4xl font-bold font-display',
    6: 'text-xl md:text-3xl font-bold font-display',
  },
  heading: {
    1: 'text-4xl md:text-6xl font-bold font-display tracking-tight',
    2: 'text-3xl md:text-5xl font-bold font-display tracking-tight',
    3: 'text-2xl md:text-4xl font-bold font-display',
    4: 'text-xl md:text-3xl font-bold font-display',
    5: 'text-lg md:text-2xl font-bold font-display',
    6: 'text-base md:text-xl font-bold font-display',
  },
  subheading: {
    1: 'text-2xl md:text-4xl font-semibold text-slate-300',
    2: 'text-xl md:text-3xl font-semibold text-slate-300',
    3: 'text-lg md:text-2xl font-semibold text-slate-300',
    4: 'text-base md:text-xl font-semibold text-slate-300',
    5: 'text-sm md:text-lg font-semibold text-slate-300',
    6: 'text-xs md:text-base font-semibold text-slate-300',
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
