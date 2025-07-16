import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn('w-full bg-dark-200/30 rounded-full h-3 backdrop-blur-sm border border-white/10', className)}>
      <div
        className={cn(
          'h-3 rounded-full transition-all duration-500 relative overflow-hidden',
          value === undefined 
            ? 'bg-gradient-neon animate-pulse shadow-neon' 
            : 'bg-gradient-neon shadow-neon'
        )}
        style={{ width: value !== undefined ? `${value}%` : '60%' }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
