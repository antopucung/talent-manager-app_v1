import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Filter, Users, Star, Plus } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Container } from '@/components/ui/layout/Container';
import { Section } from '@/components/ui/layout/Section';
import { Grid } from '@/components/ui/layout/Grid';
import { Heading } from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { TalentCard } from '@/components/ui/cards/TalentCard';

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
      <div className="min-h-screen bg-white">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <Text size="lg" className="text-neutral-600 font-medium">Loading talent directory...</Text>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <Text size="lg" className="text-status-error font-medium">Error loading talents</Text>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Section variant="default" padding="lg">
        <Container>
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-neutral-100 text-neutral-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <div>
                  <Heading level={1} variant="heading" className="text-neutral-900">
                    Talent Directory
                  </Heading>
                  <Text className="text-neutral-600 text-lg">Discover exceptional professionals for your next project</Text>
                </div>
              </div>
              <Link to="/talents/new">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-apple transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Talent
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <Card className="border border-neutral-200 shadow-apple bg-white">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-neutral-100 rounded-lg">
                    <Filter className="h-5 w-5 text-neutral-600" />
                  </div>
                  <Heading level={4} variant="heading" className="text-neutral-900">
                    Search & Filter
                  </Heading>
                </div>
              </CardHeader>
              <CardContent>
                <Grid cols={5} gap="md">
                  <Input
                    placeholder="Search skills..."
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                    className="border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white"
                  />
                  
                  <Input
                    placeholder="Location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-white"
                  />
                  
                  <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
                    <SelectTrigger className="border-neutral-200 focus:border-primary-500 bg-white">
                      <SelectValue placeholder="Experience Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                    <SelectTrigger className="border-neutral-200 focus:border-primary-500 bg-white">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.verified?.toString() || 'all'} onValueChange={(value) => handleFilterChange('verified', value === 'true' ? true : value === 'false' ? false : undefined)}>
                    <SelectTrigger className="border-neutral-200 focus:border-primary-500 bg-white">
                      <SelectValue placeholder="Verification" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-neutral-200">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">Verified Only</SelectItem>
                      <SelectItem value="false">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </Grid>
              </CardContent>
            </Card>

            {/* Results */}
            {data?.talents && data.talents.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-primary-600" />
                    <Text size="lg" weight="semibold" className="text-neutral-900">
                      {data.talents.length} Talents Found
                    </Text>
                  </div>
                </div>
                
                <Grid cols={3} gap="lg">
                  {data.talents.map((talent, index) => (
                    <TalentCard 
                      key={talent.id} 
                      talent={talent} 
                      variant={index < 2 ? 'featured' : 'default'}
                    />
                  ))}
                </Grid>
              </div>
            ) : (
              <div className="text-center py-20">
                <Card className="max-w-md mx-auto border border-neutral-200 shadow-apple bg-white">
                  <CardContent className="p-10">
                    <Search className="h-16 w-16 mx-auto mb-6 text-neutral-400" />
                    <Heading level={3} variant="heading" className="text-neutral-900 mb-4">
                      No talents found
                    </Heading>
                    <Text className="text-neutral-600 mb-8 leading-relaxed">
                      No talents match your current criteria. Try adjusting your filters or add new talent to the platform.
                    </Text>
                    <Link to="/talents/new">
                      <Button className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8 py-3 transition-all duration-300 shadow-apple">
                        <Star className="h-5 w-5 mr-2" />
                        Add the First Talent
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
