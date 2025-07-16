import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Play, Users, Star, ArrowRight, Sparkles, Brain, Target, Wand2, CheckCircle, Film, Award } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress/Progress';

interface StoryAct {
  id: number;
  title: string;
  description: string;
  position: number;
  talents: number[];
  color: string;
  icon: React.ReactNode;
}

interface SimulationStep {
  id: string;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
}

export function SimplifiedLandingPage() {
  const { toast } = useToast();
  const [storyContent, setStoryContent] = useState('');
  const [projectType, setProjectType] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [hoveredAct, setHoveredAct] = useState<number | null>(null);
  const [highlightedTalents, setHighlightedTalents] = useState<number[]>([]);
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [storyActs, setStoryActs] = useState<StoryAct[]>([]);

  const { data: talents } = useQuery({
    queryKey: ['featured-talents'],
    queryFn: () => backend.talent.list({ limit: 8, verified: true })
  });

  // Enhanced simulation steps
  const simulationSteps: SimulationStep[] = [
    {
      id: 'analyzing',
      title: 'Analyzing Story Structure',
      description: 'AI is examining narrative elements and character development...',
      duration: 2000,
      icon: <Brain className="h-6 w-6" />
    },
    {
      id: 'enhancing',
      title: 'Enhancing Creative Vision',
      description: 'Optimizing storytelling techniques and visual narrative...',
      duration: 2500,
      icon: <Wand2 className="h-6 w-6" />
    },
    {
      id: 'matching',
      title: 'Matching Perfect Talent',
      description: 'Finding the ideal professionals for your project...',
      duration: 3000,
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 'optimizing',
      title: 'Finalizing Recommendations',
      description: 'Preparing your personalized talent constellation...',
      duration: 1500,
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  // Demo story content
  const demoText = "A visionary tech entrepreneur discovers an ancient artifact that bridges the digital and physical worlds. As corporate forces seek to control this power, she must assemble a diverse team of creators, innovators, and storytellers to protect humanity's creative future. The story explores themes of innovation, collaboration, and the transformative power of human creativity in an increasingly digital age.";

  // Auto-execution logic
  useEffect(() => {
    const shouldTrigger = storyContent.trim().length > 20 && projectType;
    
    if (isAutoDemo && shouldTrigger && !isSimulating && !isGenerated) {
      setTimeout(() => {
        handleGenerate();
      }, 1000);
    }
  }, [storyContent, projectType, isAutoDemo, isSimulating, isGenerated]);

  // Simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    let stepIndex = 0;
    let progress = 0;
    const totalDuration = simulationSteps.reduce((sum, step) => sum + step.duration, 0);

    const runStep = () => {
      if (stepIndex >= simulationSteps.length) {
        setIsSimulating(false);
        setIsGenerated(true);
        generateMockResults();
        return;
      }

      setCurrentStep(stepIndex);
      const currentStepDuration = simulationSteps[stepIndex].duration;
      const stepProgressIncrement = (currentStepDuration / totalDuration) * 100;

      const progressInterval = setInterval(() => {
        progress += 1;
        setSimulationProgress(Math.min(progress, 100));
      }, currentStepDuration / 100);

      setTimeout(() => {
        clearInterval(progressInterval);
        stepIndex++;
        runStep();
      }, currentStepDuration);
    };

    runStep();
  }, [isSimulating]);

  const generateMockResults = () => {
    const availableTalentIds = talents?.talents?.slice(0, 6).map(t => t.id) || [1, 2, 3, 4, 5, 6];

    const acts: StoryAct[] = [
      {
        id: 1,
        title: "Discovery",
        description: "Introduction of the protagonist and the mysterious artifact discovery.",
        position: 20,
        talents: availableTalentIds.slice(0, 2),
        color: "from-blue-500 to-cyan-500",
        icon: <Film className="h-4 w-4" />
      },
      {
        id: 2,
        title: "Revelation",
        description: "The true power of the artifact is revealed, raising the stakes.",
        position: 50,
        talents: availableTalentIds.slice(1, 4),
        color: "from-purple-500 to-pink-500",
        icon: <Sparkles className="h-4 w-4" />
      },
      {
        id: 3,
        title: "Resolution",
        description: "The final confrontation and the triumph of creative collaboration.",
        position: 80,
        talents: availableTalentIds.slice(0, 3),
        color: "from-green-500 to-blue-500",
        icon: <Award className="h-4 w-4" />
      }
    ];
    
    setStoryActs(acts);
    
    toast({ 
      title: 'Analysis Complete', 
      description: 'Your story has been enhanced and talent matches found.' 
    });
  };

  const handleGenerate = () => {
    if (!storyContent.trim()) {
      toast({ 
        title: 'Story Required', 
        description: 'Please enter your story content first', 
        variant: 'destructive' 
      });
      return;
    }
    
    setIsSimulating(true);
    setSimulationProgress(0);
    setCurrentStep(0);
  };

  const startDemo = () => {
    setStoryContent('');
    setProjectType('');
    setIsGenerated(false);
    setIsSimulating(false);
    setIsAutoDemo(true);
    
    // Typing animation
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < demoText.length) {
        setStoryContent(demoText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setProjectType('film');
        }, 500);
      }
    }, 40);
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

  const mockEnhancedStory = `${storyContent}

ENHANCED NARRATIVE STRUCTURE:

This compelling narrative has been refined with professional storytelling techniques, incorporating three-act structure with precisely calibrated pacing and character development arcs. The story now features enhanced visual storytelling opportunities, strategic emotional beats, and clear production requirements.

Key enhancements include:
• Strengthened character motivations and conflict resolution
• Optimized scene transitions for cinematic flow
• Enhanced dialogue and visual metaphors
• Strategic placement of emotional peaks for audience engagement
• Technical specifications for production planning

The enhanced version provides a solid foundation for a compelling visual narrative that will resonate with audiences and attract top-tier talent for production.`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Section variant="default" padding="xl">
        <Container size="lg">
          <div className={`transition-all duration-700 ${isGenerated ? 'space-y-16' : 'text-center space-y-12'}`}>
            
            {/* Header */}
            <div className="text-center relative">
              <div className="inline-flex items-center space-x-3 bg-neutral-100 rounded-full px-6 py-3 mb-8">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <Text size="sm" weight="medium" className="text-neutral-700">
                  AI-Powered Creative Platform
                </Text>
              </div>
              
              <Heading level={1} variant="display" className="mb-6 leading-tight text-neutral-900">
                Transform Your Vision Into
                <br />
                <span className="text-primary-600">Cinematic Reality</span>
              </Heading>
              
              <Text size="xl" className="mb-12 max-w-3xl mx-auto leading-relaxed text-neutral-600">
                Professional storytelling meets intelligent talent matching. 
                Create compelling narratives and connect with industry professionals.
              </Text>

              {/* Demo Button */}
              {!isGenerated && !isSimulating && (
                <div className="mb-12">
                  <Button 
                    onClick={startDemo}
                    size="lg"
                    className="group bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:shadow-apple-lg"
                  >
                    <Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    <span>Experience Demo</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Story Input Section */}
            <div className={`transition-all duration-700 ${isGenerated ? 'max-w-2xl' : 'max-w-4xl mx-auto'}`}>
              <Card className="border border-neutral-200 shadow-apple bg-white">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Text weight="semibold" className="text-neutral-900 text-lg">
                          Tell Your Story
                        </Text>
                      </div>
                      
                      <Textarea
                        value={storyContent}
                        onChange={(e) => setStoryContent(e.target.value)}
                        placeholder="Describe your creative vision, story concept, or project idea. The more detail you provide, the better we can match you with the perfect talent..."
                        rows={isGenerated ? 4 : 6}
                        className="border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-base leading-relaxed bg-white resize-none"
                        disabled={isSimulating}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={projectType} onValueChange={setProjectType} disabled={isSimulating}>
                        <SelectTrigger className="border-neutral-200 focus:border-primary-500 bg-white h-12">
                          <SelectValue placeholder="Project Type (Optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-neutral-200">
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
                        disabled={isSimulating || !storyContent.trim()}
                        className="h-12 font-semibold text-base bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300 hover:shadow-apple"
                      >
                        {isSimulating ? (
                          <>
                            <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-3" />
                            <span>Enhance & Match</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simulation Progress */}
            {isSimulating && (
              <div className="space-y-8 animate-fade-in">
                <Card className="border border-neutral-200 shadow-apple-lg bg-white">
                  <CardContent className="p-10">
                    <div className="text-center space-y-8">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="p-4 rounded-full bg-primary-50 text-primary-600">
                          {simulationSteps[currentStep]?.icon}
                        </div>
                        <Heading level={3} variant="heading" className="text-neutral-900">
                          {simulationSteps[currentStep]?.title}
                        </Heading>
                      </div>
                      
                      <Text className="max-w-2xl mx-auto text-neutral-600 text-lg">
                        {simulationSteps[currentStep]?.description}
                      </Text>
                      
                      <div className="space-y-4">
                        <Progress 
                          value={simulationProgress} 
                          className="w-full max-w-2xl mx-auto h-2 bg-neutral-100"
                        />
                        <div className="flex items-center justify-center space-x-2">
                          <Text size="lg" weight="semibold" className="text-neutral-900">
                            {Math.round(simulationProgress)}%
                          </Text>
                          <Text className="text-neutral-600">Complete</Text>
                        </div>
                      </div>

                      {/* Steps Indicator */}
                      <div className="flex justify-center space-x-4">
                        {simulationSteps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                              index < currentStep ? 'bg-primary-600' :
                              index === currentStep ? 'bg-primary-600 animate-pulse' :
                              'bg-neutral-200'
                            }`} />
                            {index < simulationSteps.length - 1 && (
                              <div className={`w-8 h-0.5 transition-all duration-500 ${
                                index < currentStep ? 'bg-primary-600' : 'bg-neutral-200'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Generated Content */}
            {isGenerated && (
              <div className="space-y-16 animate-fade-in">
                
                {/* Enhanced Story Preview */}
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-status-success/10 text-status-success rounded-full px-6 py-3 mb-6">
                      <CheckCircle className="h-5 w-5" />
                      <Text size="sm" weight="semibold">
                        Story Enhanced Successfully
                      </Text>
                    </div>
                    <Heading level={2} variant="heading" className="mb-4 text-neutral-900">
                      Your Enhanced Story
                    </Heading>
                    <Text className="text-neutral-600 text-lg">
                      Professional narrative structure with optimized storytelling elements
                    </Text>
                  </div>

                  <Card className="border border-neutral-200 shadow-apple bg-white">
                    <CardContent className="p-8">
                      <div className="prose prose-lg max-w-none">
                        <Text className="whitespace-pre-wrap leading-relaxed text-neutral-700">
                          {mockEnhancedStory}
                        </Text>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Matched Talents */}
                {talents?.talents && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-3 bg-primary-50 text-primary-600 rounded-full px-6 py-3 mb-6">
                        <Users className="h-5 w-5" />
                        <Text size="sm" weight="semibold">
                          Perfect Matches Found
                        </Text>
                      </div>
                      <Heading level={2} variant="heading" className="mb-4 text-neutral-900">
                        Recommended Talent
                      </Heading>
                      <Text className="text-neutral-600 text-lg">
                        Professionals selected based on your project requirements
                      </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {talents.talents.slice(0, 8).map((talent, index) => (
                        <div
                          key={talent.id}
                          className={`transition-all duration-500 ${
                            highlightedTalents.includes(talent.id)
                              ? 'scale-105 z-10'
                              : highlightedTalents.length > 0
                              ? 'opacity-50 scale-95'
                              : 'hover:scale-105'
                          }`}
                        >
                          <Card className="border border-neutral-200 shadow-apple hover:shadow-apple-lg transition-all duration-300 bg-white group">
                            {/* Match Score Badge */}
                            <div className="absolute top-3 right-3 z-10">
                              <Badge className="bg-status-success text-white border-0 font-semibold">
                                {95 - index * 3}%
                              </Badge>
                            </div>

                            <CardContent className="p-6">
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="h-14 w-14 ring-2 ring-neutral-100">
                                  <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                                  <AvatarFallback className="bg-neutral-100 text-neutral-600 font-semibold">
                                    {talent.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <Text weight="semibold" className="truncate text-neutral-900">
                                      {talent.name}
                                    </Text>
                                    {talent.isVerified && (
                                      <Star className="h-4 w-4 text-film-gold fill-current" />
                                    )}
                                  </div>
                                  <Text size="sm" className="truncate text-neutral-500 capitalize">
                                    {talent.experienceLevel}
                                  </Text>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-4">
                                {talent.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs bg-neutral-100 text-neutral-600">
                                    {skill}
                                  </Badge>
                                ))}
                                {talent.skills.length > 2 && (
                                  <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-600">
                                    +{talent.skills.length - 2}
                                  </Badge>
                                )}
                              </div>

                              {/* AI Reasoning */}
                              <div className="bg-neutral-50 p-3 rounded-lg mb-4">
                                <Text size="xs" className="text-neutral-600 font-medium">
                                  {index === 0 ? 'Perfect for narrative development & character depth' : 
                                   index === 1 ? 'Ideal for visual storytelling & cinematography' :
                                   index === 2 ? 'Expert in technical production & post-production' :
                                   'Specialist in creative direction & project management'}
                                </Text>
                              </div>

                              <Link to={`/talents/${talent.id}`}>
                                <Button 
                                  size="sm" 
                                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-all duration-300"
                                >
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
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-film-gold/10 text-film-gold rounded-full px-6 py-3 mb-6">
                      <Film className="h-5 w-5" />
                      <Text size="sm" weight="semibold">
                        Production Timeline
                      </Text>
                    </div>
                    <Heading level={2} variant="heading" className="mb-4 text-neutral-900">
                      Story Structure & Talent Mapping
                    </Heading>
                    <Text className="text-neutral-600 text-lg">
                      Hover over story acts to see recommended talent for each scene
                    </Text>
                  </div>

                  <Card className="border border-neutral-200 shadow-apple bg-white">
                    <CardContent className="p-10">
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-200 rounded-full transform -translate-y-1/2"></div>
                        
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
                              <div className={`w-6 h-6 rounded-full bg-primary-600 border-4 border-white shadow-apple transform transition-all duration-300 group-hover:scale-150 ${hoveredAct === act.id ? 'scale-150' : ''} flex items-center justify-center`}>
                                <div className="text-white text-xs">
                                  {act.icon}
                                </div>
                              </div>

                              {/* Tooltip */}
                              <div className={`absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${hoveredAct === act.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                <div className="bg-white border border-neutral-200 shadow-apple-lg p-4 rounded-apple max-w-xs">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="p-1 rounded bg-primary-50 text-primary-600">
                                      {act.icon}
                                    </div>
                                    <Text weight="semibold" className="text-neutral-900">
                                      {act.title}
                                    </Text>
                                  </div>
                                  <Text size="sm" className="text-neutral-600 leading-relaxed mb-3">
                                    {act.description}
                                  </Text>
                                  <div className="pt-2 border-t border-neutral-100">
                                    <Text size="sm" className="text-neutral-900 font-medium">
                                      Matched Talents: {act.talents.length}
                                    </Text>
                                  </div>
                                </div>
                              </div>

                              {/* Act Label */}
                              <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center">
                                <Text size="sm" weight="medium" className="whitespace-nowrap text-neutral-700">
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
                <div className="text-center space-y-8">
                  <Card className="border border-neutral-200 shadow-apple bg-white">
                    <CardContent className="p-10">
                      <Heading level={2} variant="heading" className="mb-6 text-neutral-900">
                        Ready to Begin Production?
                      </Heading>
                      <Text className="mb-8 max-w-2xl mx-auto text-neutral-600 text-lg leading-relaxed">
                        Your story has been enhanced and the perfect talent has been identified. 
                        Take the next step to bring your vision to life.
                      </Text>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/projects/new">
                          <Button 
                            size="lg" 
                            className="bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-8 py-4 text-lg transition-all duration-300 hover:shadow-apple-lg"
                          >
                            Create Project
                            <ArrowRight className="ml-3 h-5 w-5" />
                          </Button>
                        </Link>
                        <Link to="/talents">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-semibold px-8 py-4 text-lg transition-all duration-300"
                          >
                            <Users className="mr-3 h-5 w-5" />
                            Browse All Talent
                          </Button>
                        </Link>
                        <Button 
                          size="lg" 
                          variant="outline"
                          onClick={() => {
                            setIsGenerated(false);
                            setStoryContent('');
                            setProjectType('');
                            setSimulationProgress(0);
                            setIsAutoDemo(false);
                          }}
                          className="border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-900 font-semibold px-8 py-4 text-lg transition-all duration-300"
                        >
                          Try Another Story
                          <Sparkles className="ml-3 h-5 w-5" />
                        </Button>
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
