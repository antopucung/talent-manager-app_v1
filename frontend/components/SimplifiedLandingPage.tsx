import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Sparkles, Upload, Play, Users, Star, Crown, ArrowRight, Info, Zap, CheckCircle, Clock, Wand2, Rocket, Brain, Target, Lightbulb } from 'lucide-react';
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
  color: string;
}

interface ParticleProps {
  x: number;
  y: number;
  color: string;
  size: number;
  speed: number;
}

function FloatingParticle({ x, y, color, size, speed }: ParticleProps) {
  return (
    <div
      className={`absolute rounded-full opacity-60 animate-float`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${3 + speed}s`,
      }}
    />
  );
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
  const [showPulse, setShowPulse] = useState(false);
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  const [storyActs, setStoryActs] = useState<StoryAct[]>([]);

  const { data: talents } = useQuery({
    queryKey: ['featured-talents'],
    queryFn: () => backend.talent.list({ limit: 8, verified: true })
  });

  // Generate floating particles
  useEffect(() => {
    const newParticles: ParticleProps[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#0ea5e9', '#d946ef', '#00ff88', '#ff0080', '#00d4ff'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 4,
        speed: Math.random() * 2,
      });
    }
    setParticles(newParticles);
  }, []);

  // Enhanced simulation steps with more visual appeal
  const simulationSteps: SimulationStep[] = [
    {
      id: 'analyzing',
      title: 'AI Brain Activation',
      description: 'Neural networks are analyzing your creative vision with quantum precision...',
      duration: 2500,
      icon: <Brain className="h-8 w-8 animate-pulse" />,
      color: 'text-accent-cyan'
    },
    {
      id: 'enhancing',
      title: 'Story DNA Reconstruction',
      description: 'Rebuilding narrative structure with Hollywood-grade storytelling algorithms...',
      duration: 3000,
      icon: <Wand2 className="h-8 w-8 animate-spin" />,
      color: 'text-secondary-500'
    },
    {
      id: 'matching',
      title: 'Talent Constellation Mapping',
      description: 'Scanning the universe for perfect creative matches across dimensions...',
      duration: 3500,
      icon: <Target className="h-8 w-8 animate-bounce" />,
      color: 'text-accent-neon'
    },
    {
      id: 'optimizing',
      title: 'Reality Synthesis',
      description: 'Weaving magic into reality with precision-engineered creative alchemy...',
      duration: 2000,
      icon: <Rocket className="h-8 w-8 animate-pulse" />,
      color: 'text-accent-orange'
    }
  ];

  // Demo story content
  const demoText = "In a neon-lit cyberpunk metropolis, a young hacker discovers an ancient AI that holds the key to humanity's digital soul. As corporate overlords hunt them through virtual reality labyrinths, they must choose between saving the digital world or preserving human consciousness. The fate of both realities hangs in the balance as code becomes magic and pixels transform into destiny.";

  // Auto-execution logic
  useEffect(() => {
    const shouldPulse = storyContent.trim().length > 20 && projectType;
    setShowPulse(shouldPulse);
    
    // Auto-trigger generation when demo is complete
    if (isAutoDemo && shouldPulse && !isSimulating && !isGenerated) {
      setTimeout(() => {
        handleGenerate();
      }, 1000);
    }
  }, [storyContent, projectType, isAutoDemo, isSimulating, isGenerated]);

  // Simulation effect with enhanced visuals
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
        title: "Digital Genesis",
        description: "Opening sequence in the neon metropolis. Establishing the cyberpunk world and introducing our hacker protagonist.",
        position: 15,
        talents: availableTalentIds.slice(0, 2),
        color: "from-accent-cyan to-primary-500",
        icon: <Lightbulb className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Code Awakening",
        description: "The discovery of the ancient AI. High-intensity virtual reality sequences requiring specialized technical talent.",
        position: 45,
        talents: availableTalentIds.slice(1, 4),
        color: "from-secondary-500 to-accent-pink",
        icon: <Brain className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Reality Convergence",
        description: "The climactic battle between digital and physical worlds. Epic visual effects and emotional performances.",
        position: 75,
        talents: availableTalentIds.slice(0, 3),
        color: "from-accent-neon to-accent-orange",
        icon: <Rocket className="h-5 w-5" />
      }
    ];
    
    setStoryActs(acts);
    
    // Enhanced success toast
    toast({ 
      title: '🚀 MAGIC COMPLETE!', 
      description: 'Your story has been transformed into a cinematic masterpiece!' 
    });
  };

  const handleGenerate = () => {
    if (!storyContent.trim()) {
      toast({ 
        title: '⚡ Story Required', 
        description: 'Please enter your story content first', 
        variant: 'destructive' 
      });
      return;
    }
    
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 300);
    
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
    
    // Enhanced typing animation
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
    }, 30); // Faster typing for better UX
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

[🎬 AI ENHANCED CINEMATIC VERSION]

This electrifying narrative has been supercharged with cutting-edge storytelling techniques, incorporating visual metaphors that pulse with neon energy and emotional depth that resonates across digital dimensions. The story structure follows a revolutionary three-act format with precisely calibrated character development and strategic plot points that maximize audience engagement and create viral moments.

Key visual elements have been identified to create stunning cinematography opportunities that blend practical effects with digital artistry, while the emotional core provides multiple touchpoints for authentic performances that will trend across social platforms. The enhanced version includes specific technical requirements and creative direction notes that will guide the production team toward a cohesive, impactful, and award-winning final product.

🎯 VIRAL POTENTIAL: MAXIMUM
🎨 VISUAL IMPACT: REVOLUTIONARY  
🎭 EMOTIONAL RESONANCE: TRANSCENDENT`;

  return (
    <div className="min-h-screen bg-gradient-mesh relative overflow-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle, index) => (
          <FloatingParticle key={index} {...particle} />
        ))}
      </div>

      {/* Main Content */}
      <Section variant="default" padding="xl" className="relative z-10">
        <Container size={isGenerated ? "xl" : "md"}>
          <div className={`transition-all duration-1000 ${isGenerated ? 'space-y-12' : 'text-center space-y-8'}`}>
            
            {/* Header with Enhanced Styling */}
            <div className="text-center relative">
              <div className="inline-flex items-center space-x-3 bg-gradient-primary backdrop-blur-xl rounded-full px-8 py-4 mb-8 shadow-electric border border-white/20">
                <Sparkles className="h-6 w-6 text-white animate-spin-slow" />
                <Text size="base" weight="semibold" color="white">
                  AI-Powered Quantum Story & Talent Fusion
                </Text>
                <Zap className="h-6 w-6 text-accent-yellow animate-pulse" />
              </div>
              
              <Heading level={1} variant="display" className="mb-8 leading-tight font-display">
                <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow">
                  Transform Your Story Into
                </span>
                <br />
                <span className="bg-gradient-fire bg-clip-text text-transparent">
                  Cinematic Reality
                </span>
              </Heading>
              
              <Text size="xl" className="mb-8 max-w-4xl mx-auto leading-relaxed text-dark-600">
                Write your vision, watch AI magic unfold, and connect with the perfect talent constellation to bring your dreams to life.
              </Text>

              {/* Enhanced Demo Button */}
              {!isGenerated && !isSimulating && (
                <div className="mb-8">
                  <Button 
                    onClick={startDemo}
                    className="group relative overflow-hidden bg-gradient-success hover:shadow-neon transition-all duration-300 transform hover:scale-105 border-0 text-dark-50 font-semibold px-8 py-4 text-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Play className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                    <span className="relative z-10">Experience AI Magic Demo</span>
                    <Rocket className="h-5 w-5 ml-3 group-hover:animate-pulse" />
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced Story Input Section */}
            <div className={`transition-all duration-1000 ${isGenerated ? 'max-w-2xl' : 'max-w-5xl mx-auto'}`}>
              <Card className="border-0 shadow-mega bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-accent-neon rounded-full animate-pulse" />
                          <Text weight="semibold" className="text-dark-800 text-lg">
                            Tell us your epic story
                          </Text>
                          <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="file"
                            accept=".txt,.doc,.docx"
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="cursor-pointer border-2 border-primary-300 hover:bg-gradient-primary hover:text-white hover:border-primary-500 transition-all duration-300"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Magic
                            </Button>
                          </label>
                        </div>
                      </div>
                      
                      <Textarea
                        value={storyContent}
                        onChange={(e) => setStoryContent(e.target.value)}
                        placeholder="Enter your story, script, or creative vision here... Describe the world, characters, emotions, and magic you want to create. The more vivid, the better the AI can work its magic! ✨"
                        rows={isGenerated ? 4 : 8}
                        className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 text-base leading-relaxed bg-white/80 backdrop-blur-sm transition-all duration-300"
                        disabled={isSimulating}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={projectType} onValueChange={setProjectType} disabled={isSimulating}>
                        <SelectTrigger className="border-2 border-primary-200 focus:border-primary-500 bg-white/80 backdrop-blur-sm h-12">
                          <SelectValue placeholder="🎬 Project Type (Optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="film">🎬 Film</SelectItem>
                          <SelectItem value="commercial">📺 Commercial</SelectItem>
                          <SelectItem value="tv_show">📻 TV Show</SelectItem>
                          <SelectItem value="documentary">🎥 Documentary</SelectItem>
                          <SelectItem value="music_video">🎵 Music Video</SelectItem>
                          <SelectItem value="other">✨ Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button 
                        onClick={handleGenerate}
                        disabled={isSimulating || !storyContent.trim()}
                        className={`relative overflow-hidden h-12 font-bold text-lg transition-all duration-300 transform ${
                          buttonClicked ? 'scale-95' : 'hover:scale-105'
                        } ${
                          showPulse && !isSimulating 
                            ? 'bg-gradient-neon animate-glow shadow-glow' 
                            : 'bg-gradient-primary hover:bg-gradient-secondary'
                        } border-0 text-white`}
                      >
                        <div className="absolute inset-0 bg-gradient-secondary opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        {isSimulating ? (
                          <>
                            <Zap className="h-5 w-5 mr-3 animate-spin relative z-10" />
                            <span className="relative z-10">Generating Magic...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="h-5 w-5 mr-3 relative z-10" />
                            <span className="relative z-10">Generate Magic</span>
                            <Sparkles className="h-5 w-5 ml-3 animate-pulse relative z-10" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Simulation Progress */}
            {isSimulating && (
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                <Card className="border-0 shadow-mega bg-gradient-to-br from-dark-50/90 to-dark-100/90 backdrop-blur-xl text-white">
                  <CardContent className="p-10">
                    <div className="text-center space-y-8">
                      <div className="flex items-center justify-center space-x-4">
                        <div className={`p-4 rounded-full bg-gradient-primary ${simulationSteps[currentStep]?.color}`}>
                          {simulationSteps[currentStep]?.icon}
                        </div>
                        <Heading level={2} variant="heading" className="text-white font-display">
                          {simulationSteps[currentStep]?.title}
                        </Heading>
                      </div>
                      
                      <Text className="max-w-2xl mx-auto text-white/90 text-lg">
                        {simulationSteps[currentStep]?.description}
                      </Text>
                      
                      <div className="space-y-4">
                        <Progress 
                          value={simulationProgress} 
                          className="w-full max-w-2xl mx-auto h-3 bg-dark-200"
                        />
                        <div className="flex items-center justify-center space-x-2">
                          <Text size="lg" weight="bold" color="white">
                            {Math.round(simulationProgress)}%
                          </Text>
                          <Text className="text-accent-neon">Complete</Text>
                        </div>
                      </div>

                      {/* Enhanced Steps Indicator */}
                      <div className="flex justify-center space-x-6">
                        {simulationSteps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                              index < currentStep ? 'bg-accent-neon shadow-neon' :
                              index === currentStep ? 'bg-gradient-primary animate-pulse shadow-electric' :
                              'bg-dark-300'
                            }`} />
                            {index < simulationSteps.length - 1 && (
                              <div className={`w-12 h-1 transition-all duration-500 ${
                                index < currentStep ? 'bg-accent-neon' : 'bg-dark-300'
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

            {/* Enhanced Generated Content */}
            {isGenerated && (
              <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
                
                {/* Enhanced Story Preview */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-gradient-success rounded-full px-6 py-3 mb-6 shadow-neon">
                      <CheckCircle className="h-6 w-6 text-white animate-bounce" />
                      <Text size="base" weight="bold" className="text-white">
                        Story Enhanced Successfully
                      </Text>
                      <Star className="h-6 w-6 text-accent-yellow animate-spin-slow" />
                    </div>
                    <Heading level={2} variant="heading" className="mb-4 font-display bg-gradient-primary bg-clip-text text-transparent">
                      Your Enhanced Cinematic Story
                    </Heading>
                    <Text className="text-dark-600 text-lg">
                      AI has transformed your narrative with Hollywood-grade storytelling magic
                    </Text>
                  </div>

                  <Card className="border-0 shadow-mega bg-gradient-to-br from-accent-neon/10 to-primary-500/10 backdrop-blur-xl">
                    <CardContent className="p-8">
                      <div className="prose prose-lg max-w-none">
                        <Text className="whitespace-pre-wrap leading-relaxed text-dark-800">
                          {mockEnhancedStory}
                        </Text>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Matched Talents */}
                {talents?.talents && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-3 bg-gradient-secondary rounded-full px-6 py-3 mb-6 shadow-pink">
                        <Users className="h-6 w-6 text-white animate-pulse" />
                        <Text size="base" weight="bold" className="text-white">
                          Perfect Matches Found
                        </Text>
                        <Target className="h-6 w-6 text-accent-yellow animate-bounce" />
                      </div>
                      <Heading level={2} variant="heading" className="mb-4 font-display bg-gradient-secondary bg-clip-text text-transparent">
                        AI-Selected Talent Constellation
                      </Heading>
                      <Text className="text-dark-600 text-lg">
                        Quantum-matched professionals who will bring your vision to life
                      </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {talents.talents.slice(0, 8).map((talent, index) => (
                        <div
                          key={talent.id}
                          className={`transition-all duration-500 ${
                            highlightedTalents.includes(talent.id)
                              ? 'scale-110 z-10 shadow-glow'
                              : highlightedTalents.length > 0
                              ? 'opacity-40 scale-95'
                              : 'hover:scale-105'
                          }`}
                        >
                          <Card className="border-0 shadow-mega bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl hover:shadow-glow transition-all duration-300 relative overflow-hidden group">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            
                            {/* Enhanced Match Score Badge */}
                            <div className="absolute top-3 right-3 z-10">
                              <Badge className="bg-gradient-success text-white border-0 shadow-neon animate-pulse font-bold">
                                {95 - index * 3}% ⚡
                              </Badge>
                            </div>

                            <CardContent className="p-6 relative z-10">
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="h-16 w-16 ring-4 ring-primary-200 shadow-electric">
                                  <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                                  <AvatarFallback className="bg-gradient-primary text-white font-bold text-lg">
                                    {talent.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <Text weight="bold" className="truncate text-dark-800">
                                      {talent.name}
                                    </Text>
                                    {talent.isVerified && (
                                      <Star className="h-5 w-5 text-accent-yellow fill-current animate-pulse" />
                                    )}
                                  </div>
                                  <Text size="sm" className="truncate text-dark-600 capitalize font-medium">
                                    {talent.experienceLevel}
                                  </Text>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-4">
                                {talent.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} className="text-xs bg-primary-100 text-primary-800 border border-primary-200">
                                    {skill}
                                  </Badge>
                                ))}
                                {talent.skills.length > 2 && (
                                  <Badge className="text-xs bg-secondary-100 text-secondary-800 border border-secondary-200">
                                    +{talent.skills.length - 2}
                                  </Badge>
                                )}
                              </div>

                              {/* Enhanced AI Reasoning */}
                              <div className="bg-gradient-to-r from-secondary-50 to-primary-50 p-3 rounded-xl mb-4 border border-secondary-200">
                                <Text size="xs" className="text-secondary-800 font-semibold">
                                  🎯 AI Match: {index === 0 ? 'Perfect for cyberpunk cinematography & neon aesthetics' : 
                                           index === 1 ? 'Ideal for character depth & emotional storytelling' :
                                           index === 2 ? 'Expert in VR sequences & digital world creation' :
                                           'Specialist in futuristic sound design & atmosphere'}
                                </Text>
                              </div>

                              <Link to={`/talents/${talent.id}`}>
                                <Button 
                                  size="sm" 
                                  className="w-full bg-gradient-primary hover:bg-gradient-secondary border-0 text-white font-semibold transition-all duration-300 hover:shadow-electric"
                                >
                                  View Profile ⚡
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Story Timeline */}
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-gradient-fire rounded-full px-6 py-3 mb-6 shadow-pink">
                      <Clock className="h-6 w-6 text-white animate-spin-slow" />
                      <Text size="base" weight="bold" className="text-white">
                        Production Timeline Created
                      </Text>
                      <Rocket className="h-6 w-6 text-white animate-bounce" />
                    </div>
                    <Heading level={2} variant="heading" className="mb-4 font-display bg-gradient-fire bg-clip-text text-transparent">
                      Story Timeline & Talent Constellation
                    </Heading>
                    <Text className="text-dark-600 text-lg">
                      Hover over story acts to see which talents are perfect for each epic scene
                    </Text>
                  </div>

                  <Card className="border-0 shadow-mega bg-gradient-to-br from-dark-50/90 to-dark-100/90 backdrop-blur-xl">
                    <CardContent className="p-10">
                      <div className="relative">
                        {/* Enhanced Timeline Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-neon rounded-full transform -translate-y-1/2 shadow-neon"></div>
                        
                        {/* Enhanced Story Acts */}
                        <div className="relative flex justify-between items-center h-20">
                          {storyActs.map((act) => (
                            <div
                              key={act.id}
                              className="relative group cursor-pointer"
                              style={{ left: `${act.position}%` }}
                              onMouseEnter={() => handleActHover(act.id)}
                              onMouseLeave={() => handleActHover(null)}
                            >
                              {/* Enhanced Act Marker */}
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${act.color} border-4 border-white shadow-mega transform transition-all duration-300 group-hover:scale-150 group-hover:shadow-glow ${hoveredAct === act.id ? 'scale-150 shadow-glow animate-pulse' : ''} flex items-center justify-center`}>
                                <div className="text-white">
                                  {act.icon}
                                </div>
                              </div>

                              {/* Enhanced Tooltip */}
                              <div className={`absolute bottom-full mb-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${hoveredAct === act.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                <div className="bg-gradient-to-r from-dark-900 to-dark-800 text-white p-6 rounded-2xl shadow-mega max-w-xs border border-white/20 backdrop-blur-xl">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className={`p-2 rounded-full bg-gradient-to-r ${act.color}`}>
                                      {act.icon}
                                    </div>
                                    <Text weight="bold" color="white" size="base">
                                      {act.title}
                                    </Text>
                                  </div>
                                  <Text size="sm" color="white" className="leading-relaxed mb-4">
                                    {act.description}
                                  </Text>
                                  <div className="pt-3 border-t border-white/20">
                                    <Text size="sm" color="white" weight="semibold">
                                      ⚡ Matched Talents: {act.talents.length}
                                    </Text>
                                  </div>
                                  {/* Enhanced Arrow */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                    <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-dark-900"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Act Label */}
                              <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 text-center">
                                <Text size="sm" weight="bold" className="whitespace-nowrap text-dark-800">
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

                {/* Enhanced Call to Action */}
                <div className="text-center space-y-8">
                  <Card className="border-0 shadow-mega bg-gradient-to-br from-primary-500/10 to-secondary-500/10 backdrop-blur-xl">
                    <CardContent className="p-10">
                      <div className="flex items-center justify-center mb-6">
                        <Crown className="h-16 w-16 text-accent-yellow animate-float" />
                      </div>
                      <Heading level={2} variant="heading" className="mb-6 font-display bg-gradient-neon bg-clip-text text-transparent">
                        Ready to Create Magic?
                      </Heading>
                      <Text className="mb-8 max-w-3xl mx-auto text-dark-600 text-lg leading-relaxed">
                        Your story has been quantum-analyzed and the perfect talent constellation has been mapped. 
                        Take the next step to transform your vision into cinematic reality.
                      </Text>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/projects/new">
                          <Button 
                            size="lg" 
                            className="bg-gradient-primary hover:bg-gradient-secondary border-0 shadow-electric text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                          >
                            Create Full Project
                            <ArrowRight className="ml-3 h-6 w-6" />
                          </Button>
                        </Link>
                        <Link to="/talents">
                          <Button 
                            size="lg" 
                            className="bg-gradient-success hover:shadow-neon border-0 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                          >
                            <Users className="mr-3 h-6 w-6" />
                            Browse All Talents
                          </Button>
                        </Link>
                        <Button 
                          size="lg" 
                          onClick={() => {
                            setIsGenerated(false);
                            setStoryContent('');
                            setProjectType('');
                            setSimulationProgress(0);
                            setIsAutoDemo(false);
                          }}
                          className="bg-gradient-fire hover:shadow-pink border-0 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                        >
                          Try Another Story
                          <Sparkles className="ml-3 h-6 w-6 animate-pulse" />
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
