import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'accent' | 'white';
  className?: string;
  as?: 'p' | 'span' | 'div';
}

const textSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const textWeights = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const textColors = {
  default: 'text-dark-800',
  muted: 'text-dark-600',
  accent: 'text-primary-600',
  white: 'text-white',
};

export function Text({ 
  children, 
  size = 'base',
  weight = 'normal',
  color = 'default',
  className,
  as: Component = 'p'
}: TextProps) {
  return (
    <Component className={cn(
      textSizes[size],
      textWeights[weight],
      textColors[color],
      'leading-relaxed',
      className
    )}>
      {children}
    </Component>
  );
}
