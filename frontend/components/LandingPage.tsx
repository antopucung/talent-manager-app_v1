import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Sparkles, Users, Award, TrendingUp, Play, Crown } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Container } from '@/components/ui/layout/Container';
import { Section } from '@/components/ui/layout/Section';
import { Grid } from '@/components/ui/layout/Grid';
import { Heading } from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { TalentCard } from '@/components/ui/cards/TalentCard';

export function LandingPage() {
  const { data: featuredTalents } = useQuery({
    queryKey: ['featured-talents'],
    queryFn: () => backend.talent.list({ limit: 6, verified: true })
  });

  const successStories = [
    {
      talent: "Sarah Chen",
      achievement: "Netflix Series Success",
      description: "Cinematographer Sarah's work on 'Midnight in Tokyo' reached 50M+ viewers in the first month",
      impact: "Career-defining project that led to 3 more Netflix contracts",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      category: "Cinematography"
    },
    {
      talent: "Marcus Rodriguez",
      achievement: "Cannes Lions Winner",
      description: "Creative Director Marcus led Nike's viral campaign that won 3 Cannes Lions awards",
      impact: "100M+ impressions and established him as a top creative director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      category: "Creative Direction"
    },
    {
      talent: "Emma Thompson",
      achievement: "Sundance Best Picture",
      description: "Actress Emma's lead role in 'The Last Summer' won Best Picture at Sundance",
      impact: "Launched her into A-list status with 5 major film offers",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      category: "Acting"
    }
  ];

  const stats = [
    { label: "Talents Matched", value: "10,000+", icon: Users },
    { label: "Projects Completed", value: "5,000+", icon: Award },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Industry Awards", value: "500+", icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="elegant" padding="xl">
        <Container>
          <div className="relative text-center">
            {/* Floating Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-primary-200">
              <Sparkles className="h-5 w-5 text-primary-600" />
              <Text size="sm" weight="medium" color="default">
                AI-Powered Talent Matching
              </Text>
            </div>
            
            {/* Main Headline */}
            <Heading level={1} variant="display" className="mb-6 leading-tight">
              Where Talent Meets
              <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent"> Stardom</span>
            </Heading>
            
            {/* Subheadline */}
            <Text size="xl" color="muted" className="mb-12 max-w-4xl mx-auto leading-relaxed">
              The exclusive platform where Hollywood's finest connect with blockbuster opportunities. 
              Join the elite network that transforms talent into legends.
            </Text>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/talents/new">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join as Talent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects/new">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-2 border-neutral-300 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Find Talent
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <Grid cols={4} gap="md" className="max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-neutral-200 hover:shadow-xl transition-all duration-300">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary-600" />
                  <Heading level={4} variant="heading" className="text-neutral-900 mb-1">
                    {stat.value}
                  </Heading>
                  <Text size="sm" color="muted">{stat.label}</Text>
                </div>
              ))}
            </Grid>
          </div>
        </Container>
      </Section>

      {/* Success Stories */}
      <Section variant="default" padding="xl">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} variant="display" className="mb-6 text-neutral-900">
              Success Stories That Inspire
            </Heading>
            <Text size="xl" color="muted" className="max-w-3xl mx-auto">
              Real talents, real achievements, real careers transformed. 
              See how TalentHub has become the launchpad for industry legends.
            </Text>
          </div>

          <Grid cols={3} gap="lg" className="mb-16">
            {successStories.map((story, index) => (
              <div key={index} className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white border border-neutral-200">
                <div className="relative h-80 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.talent}
                    className="w-full h-full object-cover mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                      {story.category}
                    </Badge>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <Heading level={4} variant="heading" className="text-white mb-2">
                      {story.talent}
                    </Heading>
                    <Text size="sm" className="text-white/90 mb-1">
                      {story.achievement}
                    </Text>
                  </div>
                </div>
                
                <div className="p-6">
                  <Text size="sm" color="muted" className="mb-4 leading-relaxed">
                    {story.description}
                  </Text>
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl">
                    <Text size="sm" weight="semibold" className="text-primary-800">
                      {story.impact}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </Grid>

          <div className="text-center">
            <Link to="/talents">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-neutral-300 hover:border-primary-300 hover:bg-primary-50">
                View All Success Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Featured Talents */}
      <Section variant="elegant" padding="xl">
        <Container>
          <div className="text-center mb-16">
            <Heading level={2} variant="display" className="mb-6 text-neutral-900">
              Meet Our Featured Talents
            </Heading>
            <Text size="xl" color="muted" className="max-w-3xl mx-auto">
              Discover the professionals who are shaping the future of entertainment. 
              Each talent brings unique skills and proven track records.
            </Text>
          </div>

          {featuredTalents?.talents && (
            <>
              <Grid cols={3} gap="lg" className="mb-12">
                {featuredTalents.talents.slice(0, 6).map((talent, index) => (
                  <TalentCard 
                    key={talent.id} 
                    talent={talent} 
                    variant={index < 2 ? 'featured' : 'default'}
                  />
                ))}
              </Grid>

              <div className="text-center">
                <Link to="/talents">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Explore All Talents
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="dark" padding="xl">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Crown className="h-5 w-5 text-primary-400" />
              <Text size="sm" weight="medium" color="white">
                Join the Elite
              </Text>
            </div>
            
            <Heading level={2} variant="display" className="mb-6 text-white">
              Ready to Transform Your Career?
            </Heading>
            
            <Text size="xl" className="mb-8 text-white/90 leading-relaxed">
              Join the platform where talent meets opportunity, where dreams become reality, 
              and where your next big break is just one match away.
            </Text>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/talents/new">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Your Journey
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/ai/story-enhancer">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Try AI Story Enhancer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
