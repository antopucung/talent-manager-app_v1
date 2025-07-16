import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin, DollarSign, ArrowRight, Star } from 'lucide-react';
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
  default: 'hover:shadow-apple-lg transition-all duration-300 bg-white border-neutral-200',
  featured: 'border-2 border-primary-200 shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 bg-gradient-to-br from-white to-primary-50',
  compact: 'hover:shadow-apple transition-all duration-300 bg-white border-neutral-200',
};

export function TalentCard({ talent, variant = 'default', className }: TalentCardProps) {
  return (
    <Card className={cn(cardVariants[variant], className, 'group')}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={cn(
              'transition-all duration-300',
              variant === 'featured' 
                ? 'h-16 w-16 ring-2 ring-primary-200 group-hover:ring-primary-300' 
                : 'h-12 w-12 group-hover:scale-105'
            )}>
              <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
              <AvatarFallback className={cn(
                'text-white font-semibold transition-all duration-300',
                variant === 'featured' 
                  ? 'text-lg bg-primary-600' 
                  : 'bg-neutral-600'
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
                    'transition-all duration-300 text-neutral-900',
                    variant === 'featured' && 'group-hover:text-primary-700'
                  )}
                >
                  {talent.name}
                </Heading>
                {talent.isVerified && (
                  <CheckCircle className="h-5 w-5 text-primary-600" />
                )}
              </div>
              
              {talent.location && (
                <div className="flex items-center text-sm text-neutral-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <Text size="sm" className="text-neutral-500" as="span">{talent.location}</Text>
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'}
            className={cn(
              'transition-all duration-300',
              talent.subscriptionTier === 'premium' 
                ? 'bg-film-gold text-white border-0' 
                : 'bg-neutral-100 text-neutral-600'
            )}
          >
            {talent.subscriptionTier === 'premium' && <Star className="h-3 w-3 mr-1" />}
            {talent.subscriptionTier}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {talent.bio && (
          <Text 
            size="sm" 
            className={cn(
              variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3',
              'leading-relaxed text-neutral-600'
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
              className="text-xs border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors duration-200"
            >
              {skill}
            </Badge>
          ))}
          {talent.skills.length > (variant === 'featured' ? 4 : 3) && (
            <Badge variant="outline" className="text-xs border-neutral-200 bg-neutral-50 text-neutral-600">
              +{talent.skills.length - (variant === 'featured' ? 4 : 3)} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            {talent.experienceLevel && (
              <Text size="sm" className="text-neutral-500 capitalize font-medium" as="span">
                {talent.experienceLevel}
              </Text>
            )}
            {talent.hourlyRate && (
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <Text size="sm" weight="semibold" className="text-neutral-700" as="span">
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
                ? 'bg-status-success text-white' 
                : 'bg-neutral-200 text-neutral-600'
            )}
          >
            {talent.availability}
          </Badge>
        </div>
        
        <Link to={`/talents/${talent.id}`}>
          <Button 
            className={cn(
              'w-full group transition-all duration-300 font-medium',
              variant === 'featured' 
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-apple' 
                : 'bg-neutral-900 hover:bg-neutral-800 text-white'
            )}
            variant="default"
          >
            <span>View Profile</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
