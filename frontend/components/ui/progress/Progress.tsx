import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  return (
    <div className={cn('w-full bg-slate-700/50 rounded-full h-3 backdrop-blur-sm border border-slate-600', className)}>
      <div
        className={cn(
          'h-3 rounded-full transition-all duration-500 relative overflow-hidden',
          value === undefined 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse shadow-glow-blue' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-glow-blue'
        )}
        style={{ width: value !== undefined ? `${value}%` : '60%' }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
