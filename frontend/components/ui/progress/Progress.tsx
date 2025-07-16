import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn('w-full bg-neutral-200 rounded-full h-2', className)}>
      <div
        className={cn(
          'h-2 rounded-full transition-all duration-500 bg-primary-600',
          value === undefined && 'animate-pulse'
        )}
        style={{ width: value !== undefined ? `${value}%` : '60%' }}
      />
    </div>
  );
}
