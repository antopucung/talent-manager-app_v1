import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, MapPin, DollarSign, ArrowRight, Sparkles, Users, Award, TrendingUp } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      talent: "Marcus Rodriguez",
      achievement: "Cannes Lions Winner",
      description: "Creative Director Marcus led Nike's viral campaign that won 3 Cannes Lions awards",
      impact: "100M+ impressions and established him as a top creative director",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      talent: "Emma Thompson",
      achievement: "Sundance Best Picture",
      description: "Actress Emma's lead role in 'The Last Summer' won Best Picture at Sundance",
      impact: "Launched her into A-list status with 5 major film offers",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const stats = [
    { label: "Talents Matched", value: "10,000+", icon: Users },
    { label: "Projects Completed", value: "5,000+", icon: Award },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Industry Awards", value: "500+", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">AI-Powered Talent Matching</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Where Talent Meets
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Opportunity</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            The revolutionary platform that transforms careers and creates blockbuster content. 
            Join thousands of talents who've turned their passion into their profession.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/talents/new">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Join as Talent
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/projects/new">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                Find Talent
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Success Stories That Inspire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real talents, real achievements, real careers transformed. 
              See how TalentHub has become the launchpad for industry legends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {successStories.map((story, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-64 bg-gradient-to-br from-purple-400 to-blue-500">
                  <img 
                    src={story.image} 
                    alt={story.talent}
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{story.talent}</h3>
                    <p className="text-sm opacity-90">{story.achievement}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 leading-relaxed">{story.description}</p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-purple-800">{story.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                View All Success Stories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Talents */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Featured Talents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the professionals who are shaping the future of entertainment. 
              Each talent brings unique skills and proven track records.
            </p>
          </div>

          {featuredTalents?.talents && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredTalents.talents.slice(0, 6).map((talent) => (
                <Card key={talent.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-16 w-16 ring-4 ring-purple-100">
                          <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                          <AvatarFallback className="text-lg bg-gradient-to-br from-purple-400 to-blue-500 text-white">
                            {talent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>{talent.name}</span>
                            {talent.isVerified && (
                              <CheckCircle className="h-5 w-5 text-blue-500" />
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
                      <Badge variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {talent.subscriptionTier}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {talent.bio && (
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{talent.bio}</p>
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
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {talent.experienceLevel && (
                          <span className="capitalize font-medium">{talent.experienceLevel}</span>
                        )}
                        {talent.hourlyRate && (
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            <span className="font-semibold">${talent.hourlyRate}/hr</span>
                          </div>
                        )}
                      </div>
                      
                      <Badge 
                        variant={talent.availability === 'available' ? 'default' : 'secondary'}
                        className={talent.availability === 'available' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {talent.availability}
                      </Badge>
                    </div>
                    
                    <Link to={`/talents/${talent.id}`}>
                      <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Explore All Talents
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the platform where talent meets opportunity, where dreams become reality, 
            and where your next big break is just one match away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/talents/new">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100">
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/ai/story-enhancer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white/10">
                Try AI Story Enhancer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
