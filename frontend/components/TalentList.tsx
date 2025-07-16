import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Filter, Sparkles, Users, Star } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <Sparkles className="h-16 w-16 mx-auto text-blue-500 animate-spin" />
                <Text size="lg" className="text-slate-300 font-semibold">Loading talent constellation...</Text>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <Text size="lg" className="text-red-400 font-semibold">Error loading talents</Text>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
                    className="hover:bg-slate-800 hover:text-blue-400 text-slate-300 backdrop-blur-sm border border-slate-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                <div>
                  <Heading level={1} variant="heading" className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-display">
                    Talent Constellation
                  </Heading>
                  <Text className="text-slate-300 text-lg">Discover exceptional talent for your next epic project</Text>
                </div>
              </div>
              <Link to="/talents/new">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-xl text-white font-bold transition-all duration-300 hover:scale-105">
                  <Star className="h-4 w-4 mr-2 animate-pulse" />
                  Add New Talent
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <Heading level={4} variant="heading" className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Search & Filter Magic
                  </Heading>
                  <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <Grid cols={5} gap="md">
                  <Input
                    placeholder="🔍 Search skills..."
                    value={filters.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                    className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                  />
                  
                  <Input
                    placeholder="📍 Location..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                  />
                  
                  <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
                    <SelectTrigger className="border-2 border-slate-600 focus:border-blue-500 bg-slate-700/50 backdrop-blur-sm text-slate-200">
                      <SelectValue placeholder="⭐ Experience Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">🌱 Beginner</SelectItem>
                      <SelectItem value="intermediate">🚀 Intermediate</SelectItem>
                      <SelectItem value="advanced">⚡ Advanced</SelectItem>
                      <SelectItem value="expert">👑 Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.availability} onValueChange={(value) => handleFilterChange('availability', value)}>
                    <SelectTrigger className="border-2 border-slate-600 focus:border-blue-500 bg-slate-700/50 backdrop-blur-sm text-slate-200">
                      <SelectValue placeholder="🎯 Availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">✅ Available</SelectItem>
                      <SelectItem value="busy">⏰ Busy</SelectItem>
                      <SelectItem value="unavailable">❌ Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.verified?.toString() || 'all'} onValueChange={(value) => handleFilterChange('verified', value === 'true' ? true : value === 'false' ? false : undefined)}>
                    <SelectTrigger className="border-2 border-slate-600 focus:border-blue-500 bg-slate-700/50 backdrop-blur-sm text-slate-200">
                      <SelectValue placeholder="🏆 Verification" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="true">✨ Verified Only</SelectItem>
                      <SelectItem value="false">⚪ Unverified</SelectItem>
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
                    <Users className="h-6 w-6 text-blue-500" />
                    <Text size="lg" weight="bold" className="text-slate-200">
                      {data.talents.length} Talents Found
                    </Text>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
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
                <Card className="max-w-md mx-auto border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                  <CardContent className="p-10">
                    <Search className="h-20 w-20 mx-auto mb-6 text-blue-400 animate-pulse" />
                    <Heading level={3} variant="heading" className="text-slate-200 mb-4">
                      No talents found
                    </Heading>
                    <Text className="text-slate-400 mb-8 leading-relaxed">
                      No talents match your current criteria. Try adjusting your filters or add new talent to the platform.
                    </Text>
                    <Link to="/talents/new">
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white font-bold px-8 py-3 transition-all duration-300 hover:scale-105 shadow-xl">
                        <Star className="h-5 w-5 mr-2 animate-pulse" />
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
