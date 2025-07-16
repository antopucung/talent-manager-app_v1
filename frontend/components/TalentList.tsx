import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Filter } from 'lucide-react';
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
      <Section variant="elegant" padding="xl">
        <Container>
          <div className="flex items-center justify-center h-64">
            <Text size="lg" color="muted">Loading talents...</Text>
          </div>
        </Container>
      </Section>
    );
  }

  if (error) {
    return (
      <Section variant="elegant" padding="xl">
        <Container>
          <div className="flex items-center justify-center h-64">
            <Text size="lg" className="text-status-error">Error loading talents</Text>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section variant="elegant" padding="lg">
      <Container>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="hover:bg-neutral-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <Heading level={1} variant="heading" className="text-neutral-900">
                  Talent Directory
                </Heading>
                <Text color="muted">Discover exceptional talent for your next project</Text>
              </div>
            </div>
            <Link to="/talents/new">
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0">
                Add New Talent
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="border-neutral-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-primary-600" />
                <Heading level={4} variant="heading">Search & Filter</Heading>
              </div>
            </CardHeader>
            <CardContent>
              <Grid cols={5} gap="md">
                <Input
                  placeholder="Search skills..."
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                />
                
                <Input
                  placeholder="Location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                />
                
                <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
                  <SelectTrigger className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500">
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
                  <SelectTrigger className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500">
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
                  <SelectTrigger className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500">
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
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
            <Grid cols={3} gap="lg">
              {data.talents.map((talent) => (
                <TalentCard key={talent.id} talent={talent} />
              ))}
            </Grid>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
                <Heading level={3} variant="heading" className="text-neutral-600 mb-2">
                  No talents found
                </Heading>
                <Text color="muted" className="mb-6">
                  No talents match your current criteria. Try adjusting your filters or add new talent to the platform.
                </Text>
                <Link to="/talents/new">
                  <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0">
                    Add the First Talent
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
