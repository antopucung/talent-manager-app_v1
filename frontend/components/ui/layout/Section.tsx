import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'elegant' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sectionVariants = {
  default: 'bg-white',
  dark: 'bg-gradient-to-br from-neutral-900 to-neutral-800 text-white',
  elegant: 'bg-gradient-to-br from-neutral-50 to-white',
  gradient: 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white',
};

const sectionPadding = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
};

export function Section({ 
  children, 
  variant = 'default', 
  padding = 'lg',
  className 
}: SectionProps) {
  return (
    <section className={cn(
      sectionVariants[variant],
      sectionPadding[padding],
      className
    )}>
      {children}
    </section>
  );
}
