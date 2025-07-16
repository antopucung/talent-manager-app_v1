import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, CheckCircle, ArrowLeft } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function TalentList() {
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    experienceLevel: '',
    availability: '',
    verified: undefined as boolean | undefined
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['talents', filters],
    queryFn: () => backend.talent.list({
      skills: filters.skills || undefined,
      location: filters.location || undefined,
      experienceLevel: filters.experienceLevel as any || undefined,
      availability: filters.availability as any || undefined,
      verified: filters.verified
    })
  });

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading talents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading talents</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Talent Directory</h1>
        </div>
        <Link to="/talents/new">
          <Button>Add New Talent</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search skills..."
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
            />
            
            <Input
              placeholder="Location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
            
            <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.verified?.toString() || 'all'} onValueChange={(value) => handleFilterChange('verified', value === 'true' ? true : value === 'false' ? false : undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified Only</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.talents.map((talent) => (
          <Card key={talent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                    <AvatarFallback>{talent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>{talent.name}</span>
                      {talent.isVerified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </CardTitle>
                    {talent.location && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {talent.location}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={talent.subscriptionTier === 'premium' ? 'default' : talent.subscriptionTier === 'basic' ? 'secondary' : 'outline'}>
                  {talent.subscriptionTier}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {talent.bio && (
                <p className="text-sm text-gray-600 line-clamp-2">{talent.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-1">
                {talent.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {talent.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{talent.skills.length - 3} more
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {talent.experienceLevel && (
                    <span className="capitalize">{talent.experienceLevel}</span>
                  )}
                  {talent.hourlyRate && (
                    <span>${talent.hourlyRate}/hr</span>
                  )}
                </div>
                
                <Badge 
                  variant={talent.availability === 'available' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {talent.availability}
                </Badge>
              </div>
              
              <Link to={`/talents/${talent.id}`}>
                <Button className="w-full" variant="outline">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {data?.talents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No talents found matching your criteria</div>
          <Link to="/talents/new">
            <Button className="mt-4">Add the first talent</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
