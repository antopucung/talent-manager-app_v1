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
          'h-2 rounded-full transition-all duration-300',
          value === undefined 
            ? 'bg-gradient-to-r from-primary-400 to-primary-600 animate-pulse' 
            : 'bg-gradient-to-r from-primary-500 to-primary-600'
        )}
        style={{ width: value !== undefined ? `${value}%` : '60%' }}
      />
    </div>
  );
}
