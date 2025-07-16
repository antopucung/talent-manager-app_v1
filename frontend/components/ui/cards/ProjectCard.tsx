import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heading } from '../typography/Heading';
import { Text } from '../typography/Text';
import type { Project } from '~backend/talent/types';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured';
  className?: string;
}

const cardVariants = {
  default: 'hover:shadow-lg transition-shadow duration-200',
  featured: 'border-2 border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-primary-50',
};

export function ProjectCard({ project, variant = 'default', className }: ProjectCardProps) {
  return (
    <Card className={cn(cardVariants[variant], className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Heading level={4} variant="heading" className="text-neutral-900 mb-2">
              {project.title}
            </Heading>
            
            <div className="flex items-center space-x-4 text-sm text-neutral-600">
              {project.location && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <Text size="sm" color="muted" as="span">{project.location}</Text>
                </div>
              )}
              
              {project.startDate && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <Text size="sm" color="muted" as="span">
                    {new Date(project.startDate).toLocaleDateString()}
                  </Text>
                </div>
              )}
            </div>
          </div>
          
          {project.projectType && (
            <Badge variant="outline" className="capitalize border-neutral-200">
              {project.projectType.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {project.description && (
          <Text size="sm" color="muted" className="line-clamp-3 leading-relaxed">
            {project.description}
          </Text>
        )}
        
        {project.requiredSkills.length > 0 && (
          <div>
            <Text size="sm" weight="medium" className="mb-2">Required Skills:</Text>
            <div className="flex flex-wrap gap-1">
              {project.requiredSkills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.requiredSkills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.requiredSkills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4">
            {(project.budgetMin || project.budgetMax) && (
              <div className="flex items-center text-sm">
                <DollarSign className="h-3 w-3 mr-1 text-neutral-500" />
                <Text size="sm" weight="semibold" as="span">
                  {project.budgetMin && project.budgetMax 
                    ? `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`
                    : project.budgetMin 
                    ? `From $${project.budgetMin.toLocaleString()}`
                    : `Up to $${project.budgetMax?.toLocaleString()}`
                  }
                </Text>
              </div>
            )}
          </div>
          
          <Badge 
            variant={project.status === 'open' ? 'default' : 'secondary'}
            className={cn(
              project.status === 'open' 
                ? 'bg-status-success text-white' 
                : 'bg-neutral-200 text-neutral-700'
            )}
          >
            {project.status}
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/projects/${project.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full group"
            >
              View Details
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link to={`/projects/${project.id}/matching`}>
            <Button 
              className={cn(
                'group',
                variant === 'featured' 
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700' 
                  : ''
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Find Talent
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
