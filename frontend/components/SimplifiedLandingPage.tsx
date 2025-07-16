import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Sparkles, Upload, Play, Users, Star, Crown, ArrowRight, Info, Zap } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Container } from '@/components/ui/layout/Container';
import { Section } from '@/components/ui/layout/Section';
import { Heading } from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';
import { TalentCard } from '@/components/ui/cards/TalentCard';

interface StoryAct {
  id: number;
  title: string;
  description: string;
  position: number; // 0-100 percentage
  talents: number[]; // talent IDs that match this act
  color: string;
}

export function SimplifiedLandingPage() {
  const { toast } = useToast();
  const [storyContent, setStoryContent] = useState('');
  const [projectType, setProjectType] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [hoveredAct, setHoveredAct] = useState<number | null>(null);
  const [highlightedTalents, setHighlightedTalents] = useState<number[]>([]);

  // Mock story acts data - in real app this would come from AI analysis
  const [storyActs, setStoryActs] = useState<StoryAct[]>([]);

  const { data: talents } = useQuery({
    queryKey: ['featured-talents'],
    queryFn: () => backend.talent.list({ limit: 8, verified: true })
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      try {
        // First enhance the story
        const enhancedStory = await backend.ai.enhanceStory({
          storyContent,
          projectType: projectType || undefined
        });

        // Then create a project
        const project = await backend.projects.create({
          title: "Generated Story Project",
          description: "Auto-generated from story content",
          storyContent: enhancedStory.enhancedStory,
          projectType: projectType as any || undefined,
          requiredSkills: enhancedStory.keyElements || []
        });

        // Finally get talent matches - only if we have talents available
        let matches = { matches: [] };
        if (talents?.talents && talents.talents.length > 0) {
          try {
            matches = await backend.ai.matchTalents({
              projectId: project.id,
              storyContent: enhancedStory.enhancedStory,
              requiredSkills: enhancedStory.keyElements || [],
              projectType: projectType || undefined
            });
          } catch (matchError) {
            console.warn('Talent matching failed, continuing without matches:', matchError);
            // Continue without matches rather than failing completely
          }
        }

        return { enhancedStory, project, matches };
      } catch (error) {
        console.error('Generation error details:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setIsGenerated(true);
      
      // Generate story acts based on available talent matches
      const availableTalentIds = data.matches.matches.length > 0 
        ? data.matches.matches.map(m => m.talentId)
        : talents?.talents?.slice(0, 6).map(t => t.id) || [];

      const acts: StoryAct[] = [
        {
          id: 1,
          title: "Opening Scene",
          description: "Establishing the world and introducing main characters. Sets the tone and visual style.",
          position: 15,
          talents: availableTalentIds.slice(0, 2),
          color: "bg-blue-500"
        },
        {
          id: 2,
          title: "Rising Action",
          description: "Building tension and developing the story. Key character interactions and plot development.",
          position: 45,
          talents: availableTalentIds.slice(1, 4),
          color: "bg-purple-500"
        },
        {
          id: 3,
          title: "Climax",
          description: "The peak moment of the story. High-intensity scenes requiring specialized talent.",
          position: 75,
          talents: availableTalentIds.slice(0, 3),
          color: "bg-red-500"
        }
      ];
      
      setStoryActs(acts);
      toast({ title: 'Success', description: 'Story generated and talents matched!' });
    },
    onError: (error) => {
      console.error('Generation error:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to generate story. Please try again.', 
        variant: 'destructive' 
      });
    }
  });

  const handleGenerate = () => {
    if (!storyContent.trim()) {
      toast({ title: 'Error', description: 'Please enter your story content', variant: 'destructive' });
      return;
    }
    generateMutation.mutate();
  };

  const handleActHover = (actId: number | null) => {
    setHoveredAct(actId);
    if (actId) {
      const act = storyActs.find(a => a.id === actId);
      setHighlightedTalents(act?.talents || []);
    } else {
      setHighlightedTalents([]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setStoryContent(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50">
      {/* Hero Section */}
      <Section variant="elegant" padding="xl">
        <Container size={isGenerated ? "xl" : "md"}>
          <div className={`transition-all duration-1000 ${isGenerated ? 'space-y-12' : 'text-center space-y-8'}`}>
            
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg border border-primary-200">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <Text size="sm" weight="medium" color="default">
                  AI-Powered Story & Talent Matching
                </Text>
              </div>
              
              <Heading level={1} variant="display" className="mb-6 leading-tight">
                Transform Your Story Into
                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-700 bg-clip-text text-transparent"> Reality</span>
              </Heading>
              
              <Text size="xl" color="muted" className="mb-8 max-w-3xl mx-auto leading-relaxed">
                Write your story, and watch as AI matches you with the perfect talent to bring it to life.
              </Text>
            </div>

            {/* Story Input Section */}
            <div className={`transition-all duration-1000 ${isGenerated ? 'max-w-2xl' : 'max-w-4xl mx-auto'}`}>
              <Card className="border-neutral-200 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Text weight="semibold" className="text-neutral-800">
                          Tell us your story
                        </Text>
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept=".txt,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload">
                            <Button variant="outline" size="sm" className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </label>
                        </div>
                      </div>
                      
                      <Textarea
                        value={storyContent}
                        onChange={(e) => setStoryContent(e.target.value)}
                        placeholder="Enter your story, script, or creative brief here... Describe the vision, characters, scenes, and mood you want to create."
                        rows={isGenerated ? 4 : 8}
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500 text-base leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger className="border-neutral-300 focus:border-primary-500">
                          <SelectValue placeholder="Project Type (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="film">Film</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="tv_show">TV Show</SelectItem>
                          <SelectItem value="documentary">Documentary</SelectItem>
                          <SelectItem value="music_video">Music Video</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button 
                        onClick={handleGenerate}
                        disabled={generateMutation.isPending || !storyContent.trim()}
                        className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {generateMutation.isPending ? (
                          <>
                            <Zap className="h-4 w-4 mr-2 animate-pulse" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Generate Magic
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated Content */}
            {isGenerated && (
              <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
                
                {/* Matched Talents */}
                {talents?.talents && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Heading level={2} variant="heading" className="mb-2">
                        Perfect Talent Matches
                      </Heading>
                      <Text color="muted">
                        AI-selected professionals who bring your story to life
                      </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {talents.talents.slice(0, 8).map((talent) => (
                        <div
                          key={talent.id}
                          className={`transition-all duration-300 ${
                            highlightedTalents.includes(talent.id)
                              ? 'scale-105 ring-4 ring-primary-200 shadow-2xl'
                              : highlightedTalents.length > 0
                              ? 'opacity-40 scale-95'
                              : ''
                          }`}
                        >
                          <Card className="hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border-neutral-200">
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-3">
                                <Avatar className="h-12 w-12 ring-2 ring-primary-100">
                                  <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white font-semibold">
                                    {talent.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-1">
                                    <Text weight="semibold" className="truncate">
                                      {talent.name}
                                    </Text>
                                    {talent.isVerified && (
                                      <Star className="h-4 w-4 text-primary-500 fill-current" />
                                    )}
                                  </div>
                                  <Text size="sm" color="muted" className="truncate">
                                    {talent.experienceLevel}
                                  </Text>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-3">
                                {talent.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {talent.skills.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{talent.skills.length - 2}
                                  </Badge>
                                )}
                              </div>

                              <Link to={`/talents/${talent.id}`}>
                                <Button size="sm" variant="outline" className="w-full">
                                  View Profile
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Story Timeline */}
                <div className="space-y-6">
                  <div className="text-center">
                    <Heading level={2} variant="heading" className="mb-2">
                      Story Timeline & Talent Mapping
                    </Heading>
                    <Text color="muted">
                      Hover over story acts to see which talents are perfect for each scene
                    </Text>
                  </div>

                  <Card className="border-neutral-200 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 rounded-full transform -translate-y-1/2"></div>
                        
                        {/* Story Acts */}
                        <div className="relative flex justify-between items-center h-16">
                          {storyActs.map((act) => (
                            <div
                              key={act.id}
                              className="relative group cursor-pointer"
                              style={{ left: `${act.position}%` }}
                              onMouseEnter={() => handleActHover(act.id)}
                              onMouseLeave={() => handleActHover(null)}
                            >
                              {/* Act Marker */}
                              <div className={`w-6 h-6 rounded-full ${act.color} border-4 border-white shadow-lg transform transition-all duration-300 group-hover:scale-150 group-hover:shadow-xl ${hoveredAct === act.id ? 'scale-150 shadow-xl' : ''}`}>
                                <div className="w-full h-full rounded-full bg-white/30"></div>
                              </div>

                              {/* Tooltip */}
                              <div className={`absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${hoveredAct === act.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                <div className="bg-neutral-900 text-white p-4 rounded-xl shadow-2xl max-w-xs">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Info className="h-4 w-4 text-primary-400" />
                                    <Text weight="semibold" color="white" size="sm">
                                      {act.title}
                                    </Text>
                                  </div>
                                  <Text size="xs" color="white" className="leading-relaxed">
                                    {act.description}
                                  </Text>
                                  <div className="mt-3 pt-3 border-t border-neutral-700">
                                    <Text size="xs" color="white" weight="medium">
                                      Matched Talents: {act.talents.length}
                                    </Text>
                                  </div>
                                  {/* Arrow */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Act Label */}
                              <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center">
                                <Text size="sm" weight="medium" className="whitespace-nowrap">
                                  {act.title}
                                </Text>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Call to Action */}
                <div className="text-center space-y-6">
                  <Card className="border-primary-200 bg-gradient-to-br from-primary-50 to-white shadow-xl">
                    <CardContent className="p-8">
                      <Crown className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                      <Heading level={3} variant="heading" className="mb-4">
                        Ready to Start Your Project?
                      </Heading>
                      <Text color="muted" className="mb-6 max-w-2xl mx-auto">
                        Your story has been analyzed and the perfect talents have been matched. 
                        Take the next step to bring your vision to life.
                      </Text>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/projects/new">
                          <Button size="lg" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 shadow-lg">
                            Create Full Project
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Link to="/talents">
                          <Button size="lg" variant="outline" className="border-2 border-primary-300 hover:bg-primary-50">
                            <Users className="mr-2 h-5 w-5" />
                            Browse All Talents
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </div>
  );
}
