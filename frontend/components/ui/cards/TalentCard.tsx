import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MapPin, DollarSign, ArrowRight } from 'lucide-react';
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
  default: 'hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
  featured: 'border-2 border-primary-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-primary-50',
  compact: 'hover:shadow-lg transition-shadow duration-200',
};

export function TalentCard({ talent, variant = 'default', className }: TalentCardProps) {
  return (
    <Card className={cn(cardVariants[variant], className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={cn(
              variant === 'featured' ? 'h-16 w-16 ring-4 ring-primary-100' : 'h-12 w-12'
            )}>
              <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
              <AvatarFallback className={cn(
                'text-white font-semibold',
                variant === 'featured' 
                  ? 'text-lg bg-gradient-to-br from-primary-500 to-primary-600' 
                  : 'bg-gradient-to-br from-neutral-400 to-neutral-500'
              )}>
                {talent.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center space-x-2">
                <Heading 
                  level={variant === 'featured' ? 3 : 4} 
                  variant="heading"
                  className="text-neutral-900"
                >
                  {talent.name}
                </Heading>
                {talent.isVerified && (
                  <CheckCircle className="h-5 w-5 text-accent-blue" />
                )}
              </div>
              
              {talent.location && (
                <div className="flex items-center text-sm text-neutral-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <Text size="sm" color="muted" as="span">{talent.location}</Text>
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'}
            className={cn(
              talent.subscriptionTier === 'premium' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0' 
                : ''
            )}
          >
            {talent.subscriptionTier}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {talent.bio && (
          <Text 
            size="sm" 
            color="muted" 
            className={cn(
              variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3',
              'leading-relaxed'
            )}
          >
            {talent.bio}
          </Text>
        )}
        
        <div className="flex flex-wrap gap-1">
          {talent.skills.slice(0, variant === 'featured' ? 4 : 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs border-neutral-200">
              {skill}
            </Badge>
          ))}
          {talent.skills.length > (variant === 'featured' ? 4 : 3) && (
            <Badge variant="outline" className="text-xs border-neutral-200">
              +{talent.skills.length - (variant === 'featured' ? 4 : 3)} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-neutral-600">
            {talent.experienceLevel && (
              <Text size="sm" color="muted" as="span" className="capitalize font-medium">
                {talent.experienceLevel}
              </Text>
            )}
            {talent.hourlyRate && (
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <Text size="sm" weight="semibold" as="span">
                  ${talent.hourlyRate}/hr
                </Text>
              </div>
            )}
          </div>
          
          <Badge 
            variant={talent.availability === 'available' ? 'default' : 'secondary'}
            className={cn(
              talent.availability === 'available' 
                ? 'bg-status-success hover:bg-status-success/90 text-white' 
                : 'bg-neutral-200 text-neutral-700'
            )}
          >
            {talent.availability}
          </Badge>
        </div>
        
        <Link to={`/talents/${talent.id}`}>
          <Button 
            className={cn(
              'w-full group transition-all duration-300',
              variant === 'featured' 
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0' 
                : ''
            )}
            variant={variant === 'featured' ? 'default' : 'outline'}
          >
            View Profile
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
