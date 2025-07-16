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
  default: 'hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 bg-slate-800/80 backdrop-blur-xl border-0 border border-slate-700',
  featured: 'border-0 shadow-card-hover hover:shadow-glow-blue transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl relative overflow-hidden border border-slate-600',
  compact: 'hover:shadow-card transition-all duration-300 bg-slate-800/60 backdrop-blur-sm border border-slate-700',
};

export function TalentCard({ talent, variant = 'default', className }: TalentCardProps) {
  return (
    <Card className={cn(cardVariants[variant], className, 'group')}>
      {/* Animated background for featured cards */}
      {variant === 'featured' && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className={cn(
              'transition-all duration-300',
              variant === 'featured' 
                ? 'h-16 w-16 ring-4 ring-blue-500/30 group-hover:ring-blue-400/50 group-hover:shadow-glow-blue' 
                : 'h-12 w-12 group-hover:scale-110'
            )}>
              <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
              <AvatarFallback className={cn(
                'text-white font-bold transition-all duration-300',
                variant === 'featured' 
                  ? 'text-lg bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
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
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300' 
                      : 'text-slate-200 group-hover:text-blue-400'
                  )}
                >
                  {talent.name}
                </Heading>
                {talent.isVerified && (
                  <CheckCircle className="h-5 w-5 text-blue-400 animate-pulse" />
                )}
              </div>
              
              {talent.location && (
                <div className="flex items-center text-sm text-slate-400 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <Text size="sm" className="text-slate-400" as="span">{talent.location}</Text>
                </div>
              )}
            </div>
          </div>
          
          <Badge 
            variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'}
            className={cn(
              'transition-all duration-300',
              talent.subscriptionTier === 'premium' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-glow-purple animate-pulse' 
                : 'bg-slate-700 text-slate-300 border border-slate-600'
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
            className={cn(
              variant === 'compact' ? 'line-clamp-2' : 'line-clamp-3',
              'leading-relaxed text-slate-300'
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
              className="text-xs border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors duration-200"
            >
              {skill}
            </Badge>
          ))}
          {talent.skills.length > (variant === 'featured' ? 4 : 3) && (
            <Badge variant="outline" className="text-xs border-purple-500/30 bg-purple-500/10 text-purple-300">
              +{talent.skills.length - (variant === 'featured' ? 4 : 3)} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            {talent.experienceLevel && (
              <Text size="sm" className="text-slate-400 capitalize font-semibold" as="span">
                {talent.experienceLevel}
              </Text>
            )}
            {talent.hourlyRate && (
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <Text size="sm" weight="bold" className="text-green-400" as="span">
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
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-glow-green animate-pulse' 
                : 'bg-slate-700 text-slate-400'
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
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 shadow-xl hover:shadow-glow-blue' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 hover:shadow-xl'
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
