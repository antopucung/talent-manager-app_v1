import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin, DollarSign, ArrowRight, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';
import type { Talent } from '~backend/talent/types';

interface TalentCardProps {
  talent: Talent;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

const cardVariants = {
  default: 'hover:shadow-mega transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border-0',
  featured: 'border-0 shadow-mega hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-gradient-to-br from-primary-50/90 to-secondary-50/90 backdrop-blur-xl relative overflow-hidden',
  compact: 'hover:shadow-electric transition-all duration-300 bg-white/80 backdrop-blur-sm border border-primary-200',
};

export function TalentCard({ talent, variant = 'default', className }: TalentCardProps) {
  return (
    <Card className={cn(cardVariants[variant], className, 'group')}>
      {/* Animated background for featured cards */}
      {variant === 'featured' && (
        <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
      )}
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={cn(
              'transition-all duration-300',
              variant === 'featured' 
                ? 'h-16 w-16 ring-4 ring-primary-200 group-hover:ring-accent-neon group-hover:shadow-neon' 
                : 'h-12 w-12 group-hover:scale-110'
            )}>
              <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
              <AvatarFallback className={cn(
                'text-white font-bold transition-all duration-300',
                variant === 'featured' 
                  ? 'text-lg bg-gradient-primary group-hover:bg-gradient-neon' 
                  : 'bg-gradient-secondary'
              )}>
                {talent.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center space-x-2">
                <Heading 
                  level={variant === 'featured' ? 3 : 4} 
                  variant="heading"
                  className={cn(
                    'transition-all duration-300',
                    variant === 'featured' 
                      ? 'bg-gradient-primary bg-clip-text text-transparent group-hover:bg-gradient-neon' 
                      : 'text-dark-800 group-hover:text-primary-600'
                  )}
                >
                  {talent.name}
                </Heading>
                {talent.isVerified && (
                  <CheckCircle className="h-5 w-5 text-accent-cyan animate-pulse" />
                )}
              </div>
              
              {talent.location && (
                <div className="flex items-center text-sm text-dark-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <Text size="sm" color="muted" as="span">{talent.location}</Text>
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'}
            className={cn(
              'transition-all duration-300',
              talent.subscriptionTier === 'premium' 
                ? 'bg-gradient-secondary text-white border-0 shadow-pink animate-pulse' 
                : 'bg-primary-100 text-primary-800 border border-primary-200'
            )}
          >
            {talent.subscriptionTier === 'premium' && <Star className="h-3 w-3 mr-1" />}
            {talent.subscriptionTier}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {talent.bio && (
          <Text 
            size="sm" 
            color="muted" 
            className={cn(
              variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3',
              'leading-relaxed text-dark-700'
            )}
          >
            {talent.bio}
          </Text>
        )}
        
        <div className="flex flex-wrap gap-2">
          {talent.skills.slice(0, variant === 'featured' ? 4 : 3).map((skill) => (
            <Badge 
              key={skill} 
              variant="outline" 
              className="text-xs border-primary-200 bg-primary-50 text-primary-800 hover:bg-primary-100 transition-colors duration-200"
            >
              {skill}
            </Badge>
          ))}
          {talent.skills.length > (variant === 'featured' ? 4 : 3) && (
            <Badge variant="outline" className="text-xs border-secondary-200 bg-secondary-50 text-secondary-800">
              +{talent.skills.length - (variant === 'featured' ? 4 : 3)} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-dark-600">
            {talent.experienceLevel && (
              <Text size="sm" color="muted" as="span" className="capitalize font-semibold">
                {talent.experienceLevel}
              </Text>
            )}
            {talent.hourlyRate && (
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <Text size="sm" weight="bold" as="span" className="text-accent-neon">
                  ${talent.hourlyRate}/hr
                </Text>
              </div>
            )}
          </div>
          
          <Badge 
            variant={talent.availability === 'available' ? 'default' : 'secondary'}
            className={cn(
              'transition-all duration-300',
              talent.availability === 'available' 
                ? 'bg-gradient-success text-white shadow-neon animate-pulse' 
                : 'bg-dark-200 text-dark-700'
            )}
          >
            {talent.availability === 'available' && <Zap className="h-3 w-3 mr-1" />}
            {talent.availability}
          </Badge>
        </div>
        
        <Link to={`/talents/${talent.id}`}>
          <Button 
            className={cn(
              'w-full group transition-all duration-300 font-semibold',
              variant === 'featured' 
                ? 'bg-gradient-primary hover:bg-gradient-neon text-white border-0 shadow-electric hover:shadow-glow' 
                : 'bg-gradient-secondary hover:bg-gradient-primary text-white border-0 hover:shadow-electric'
            )}
            variant="default"
          >
            <span>View Profile</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            <Sparkles className="ml-1 h-4 w-4 group-hover:animate-spin" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
