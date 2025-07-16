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
      className={`absolute rounded-full opacity-30 animate-float`}
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
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: ['#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4'][Math.floor(Math.random() * 5)],
        size: Math.random() * 6 + 3,
        speed: Math.random() * 2,
      });
    }
    setParticles(newParticles);
  }, []);

  // Enhanced simulation steps
  const simulationSteps: SimulationStep[] = [
    {
      id: 'analyzing',
      title: 'AI Brain Activation',
      description: 'Neural networks are analyzing your creative vision with quantum precision...',
      duration: 2500,
      icon: <Brain className="h-8 w-8 animate-pulse" />,
      color: 'text-blue-400'
    },
    {
      id: 'enhancing',
      title: 'Story DNA Reconstruction',
      description: 'Rebuilding narrative structure with Hollywood-grade storytelling algorithms...',
      duration: 3000,
      icon: <Wand2 className="h-8 w-8 animate-spin" />,
      color: 'text-purple-400'
    },
    {
      id: 'matching',
      title: 'Talent Constellation Mapping',
      description: 'Scanning the universe for perfect creative matches across dimensions...',
      duration: 3500,
      icon: <Target className="h-8 w-8 animate-bounce" />,
      color: 'text-green-400'
    },
    {
      id: 'optimizing',
      title: 'Reality Synthesis',
      description: 'Weaving magic into reality with precision-engineered creative alchemy...',
      duration: 2000,
      icon: <Rocket className="h-8 w-8 animate-pulse" />,
      color: 'text-pink-400'
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
        title: "Digital Genesis",
        description: "Opening sequence in the neon metropolis. Establishing the cyberpunk world and introducing our hacker protagonist.",
        position: 15,
        talents: availableTalentIds.slice(0, 2),
        color: "from-blue-500 to-cyan-500",
        icon: <Lightbulb className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Code Awakening",
        description: "The discovery of the ancient AI. High-intensity virtual reality sequences requiring specialized technical talent.",
        position: 45,
        talents: availableTalentIds.slice(1, 4),
        color: "from-purple-500 to-pink-500",
        icon: <Brain className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Reality Convergence",
        description: "The climactic battle between digital and physical worlds. Epic visual effects and emotional performances.",
        position: 75,
        talents: availableTalentIds.slice(0, 3),
        color: "from-green-500 to-blue-500",
        icon: <Rocket className="h-5 w-5" />
      }
    ];
    
    setStoryActs(acts);
    
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
    }, 30);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
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
            
            {/* Header */}
            <div className="text-center relative">
              <div className="inline-flex items-center space-x-3 bg-slate-800/80 backdrop-blur-xl rounded-full px-8 py-4 mb-8 shadow-xl border border-slate-700">
                <Sparkles className="h-6 w-6 text-blue-400 animate-spin-slow" />
                <Text size="base" weight="semibold" className="text-slate-200">
                  AI-Powered Quantum Story & Talent Fusion
                </Text>
                <Zap className="h-6 w-6 text-purple-400 animate-pulse" />
              </div>
              
              <Heading level={1} variant="display" className="mb-8 leading-tight font-display">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Transform Your Story Into
                </span>
                <br />
                <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cinematic Reality
                </span>
              </Heading>
              
              <Text size="xl" className="mb-8 max-w-4xl mx-auto leading-relaxed text-slate-300">
                Write your vision, watch AI magic unfold, and connect with the perfect talent constellation to bring your dreams to life.
              </Text>

              {/* Demo Button */}
              {!isGenerated && !isSimulating && (
                <div className="mb-8">
                  <Button 
                    onClick={startDemo}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 border-0 text-white font-semibold px-8 py-4 text-lg shadow-xl"
                  >
                    <Play className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                    <span>Experience AI Magic Demo</span>
                    <Rocket className="h-5 w-5 ml-3 group-hover:animate-pulse" />
                  </Button>
                </div>
              )}
            </div>

            {/* Story Input Section */}
            <div className={`transition-all duration-1000 ${isGenerated ? 'max-w-2xl' : 'max-w-5xl mx-auto'}`}>
              <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                          <Text weight="semibold" className="text-slate-200 text-lg">
                            Tell us your epic story
                          </Text>
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
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
                              className="cursor-pointer border-2 border-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 text-slate-300"
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
                        className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-base leading-relaxed bg-slate-700/50 backdrop-blur-sm transition-all duration-300 text-slate-200 placeholder:text-slate-400"
                        disabled={isSimulating}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={projectType} onValueChange={setProjectType} disabled={isSimulating}>
                        <SelectTrigger className="border-2 border-slate-600 focus:border-blue-500 bg-slate-700/50 backdrop-blur-sm h-12 text-slate-200">
                          <SelectValue placeholder="🎬 Project Type (Optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
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
                            ? 'bg-gradient-to-r from-green-500 to-blue-500 shadow-glow-green' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        } border-0 text-white shadow-xl`}
                      >
                        {isSimulating ? (
                          <>
                            <Zap className="h-5 w-5 mr-3 animate-spin" />
                            <span>Generating Magic...</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="h-5 w-5 mr-3" />
                            <span>Generate Magic</span>
                            <Sparkles className="h-5 w-5 ml-3 animate-pulse" />
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
              <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                <Card className="border-0 shadow-2xl bg-slate-800/90 backdrop-blur-xl text-white border border-slate-700">
                  <CardContent className="p-10">
                    <div className="text-center space-y-8">
                      <div className="flex items-center justify-center space-x-4">
                        <div className={`p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 ${simulationSteps[currentStep]?.color}`}>
                          {simulationSteps[currentStep]?.icon}
                        </div>
                        <Heading level={2} variant="heading" className="text-white font-display">
                          {simulationSteps[currentStep]?.title}
                        </Heading>
                      </div>
                      
                      <Text className="max-w-2xl mx-auto text-slate-300 text-lg">
                        {simulationSteps[currentStep]?.description}
                      </Text>
                      
                      <div className="space-y-4">
                        <Progress 
                          value={simulationProgress} 
                          className="w-full max-w-2xl mx-auto h-3 bg-slate-700"
                        />
                        <div className="flex items-center justify-center space-x-2">
                          <Text size="lg" weight="bold" className="text-white">
                            {Math.round(simulationProgress)}%
                          </Text>
                          <Text className="text-blue-400">Complete</Text>
                        </div>
                      </div>

                      {/* Steps Indicator */}
                      <div className="flex justify-center space-x-6">
                        {simulationSteps.map((step, index) => (
                          <div key={step.id} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full transition-all duration-500 ${
                              index < currentStep ? 'bg-green-500 shadow-glow-green' :
                              index === currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse shadow-glow-blue' :
                              'bg-slate-600'
                            }`} />
                            {index < simulationSteps.length - 1 && (
                              <div className={`w-12 h-1 transition-all duration-500 ${
                                index < currentStep ? 'bg-green-500' : 'bg-slate-600'
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
              <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
                
                {/* Enhanced Story Preview */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full px-6 py-3 mb-6 shadow-xl">
                      <CheckCircle className="h-6 w-6 text-white animate-bounce" />
                      <Text size="base" weight="bold" className="text-white">
                        Story Enhanced Successfully
                      </Text>
                      <Star className="h-6 w-6 text-yellow-400 animate-spin-slow" />
                    </div>
                    <Heading level={2} variant="heading" className="mb-4 font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Your Enhanced Cinematic Story
                    </Heading>
                    <Text className="text-slate-300 text-lg">
                      AI has transformed your narrative with Hollywood-grade storytelling magic
                    </Text>
                  </div>

                  <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                    <CardContent className="p-8">
                      <div className="prose prose-lg max-w-none">
                        <Text className="whitespace-pre-wrap leading-relaxed text-slate-200">
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
                      <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-6 py-3 mb-6 shadow-xl">
                        <Users className="h-6 w-6 text-white animate-pulse" />
                        <Text size="base" weight="bold" className="text-white">
                          Perfect Matches Found
                        </Text>
                        <Target className="h-6 w-6 text-yellow-400 animate-bounce" />
                      </div>
                      <Heading level={2} variant="heading" className="mb-4 font-display bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI-Selected Talent Constellation
                      </Heading>
                      <Text className="text-slate-300 text-lg">
                        Quantum-matched professionals who will bring your vision to life
                      </Text>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {talents.talents.slice(0, 8).map((talent, index) => (
                        <div
                          key={talent.id}
                          className={`transition-all duration-500 ${
                            highlightedTalents.includes(talent.id)
                              ? 'scale-110 z-10 shadow-glow-blue'
                              : highlightedTalents.length > 0
                              ? 'opacity-40 scale-95'
                              : 'hover:scale-105'
                          }`}
                        >
                          <Card className="border-0 shadow-xl bg-slate-800/80 backdrop-blur-xl hover:shadow-glow-blue transition-all duration-300 relative overflow-hidden group border border-slate-700">
                            {/* Match Score Badge */}
                            <div className="absolute top-3 right-3 z-10">
                              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 shadow-glow-green animate-pulse font-bold">
                                {95 - index * 3}% ⚡
                              </Badge>
                            </div>

                            <CardContent className="p-6 relative z-10">
                              <div className="flex items-center space-x-4 mb-4">
                                <Avatar className="h-16 w-16 ring-4 ring-blue-500/50 shadow-xl">
                                  <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg">
                                    {talent.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <Text weight="bold" className="truncate text-slate-200">
                                      {talent.name}
                                    </Text>
                                    {talent.isVerified && (
                                      <Star className="h-5 w-5 text-yellow-400 fill-current animate-pulse" />
                                    )}
                                  </div>
                                  <Text size="sm" className="truncate text-slate-400 capitalize font-medium">
                                    {talent.experienceLevel}
                                  </Text>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-4">
                                {talent.skills.slice(0, 2).map((skill) => (
                                  <Badge key={skill} className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    {skill}
                                  </Badge>
                                ))}
                                {talent.skills.length > 2 && (
                                  <Badge className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    +{talent.skills.length - 2}
                                  </Badge>
                                )}
                              </div>

                              {/* AI Reasoning */}
                              <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 p-3 rounded-xl mb-4 border border-slate-600">
                                <Text size="xs" className="text-slate-300 font-semibold">
                                  🎯 AI Match: {index === 0 ? 'Perfect for cyberpunk cinematography & neon aesthetics' : 
                                           index === 1 ? 'Ideal for character depth & emotional storytelling' :
                                           index === 2 ? 'Expert in VR sequences & digital world creation' :
                                           'Specialist in futuristic sound design & atmosphere'}
                                </Text>
                              </div>

                              <Link to={`/talents/${talent.id}`}>
                                <Button 
                                  size="sm" 
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white font-semibold transition-all duration-300 shadow-xl"
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

                {/* Story Timeline */}
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-full px-6 py-3 mb-6 shadow-xl">
                      <Clock className="h-6 w-6 text-white animate-spin-slow" />
                      <Text size="base" weight="bold" className="text-white">
                        Production Timeline Created
                      </Text>
                      <Rocket className="h-6 w-6 text-white animate-bounce" />
                    </div>
                    <Heading level={2} variant="heading" className="mb-4 font-display bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      Story Timeline & Talent Constellation
                    </Heading>
                    <Text className="text-slate-300 text-lg">
                      Hover over story acts to see which talents are perfect for each epic scene
                    </Text>
                  </div>

                  <Card className="border-0 shadow-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700">
                    <CardContent className="p-10">
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-y-1/2 shadow-glow-blue"></div>
                        
                        {/* Story Acts */}
                        <div className="relative flex justify-between items-center h-20">
                          {storyActs.map((act) => (
                            <div
                              key={act.id}
                              className="relative group cursor-pointer"
                              style={{ left: `${act.position}%` }}
                              onMouseEnter={() => handleActHover(act.id)}
                              onMouseLeave={() => handleActHover(null)}
                            >
                              {/* Act Marker */}
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${act.color} border-4 border-white shadow-xl transform transition-all duration-300 group-hover:scale-150 group-hover:shadow-glow-blue ${hoveredAct === act.id ? 'scale-150 shadow-glow-blue animate-pulse' : ''} flex items-center justify-center`}>
                                <div className="text-white">
                                  {act.icon}
                                </div>
                              </div>

                              {/* Tooltip */}
                              <div className={`absolute bottom-full mb-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${hoveredAct === act.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                                <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-2xl max-w-xs border border-slate-700 backdrop-blur-xl">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <div className={`p-2 rounded-full bg-gradient-to-r ${act.color}`}>
                                      {act.icon}
                                    </div>
                                    <Text weight="bold" className="text-white text-base">
                                      {act.title}
                                    </Text>
                                  </div>
                                  <Text size="sm" className="text-slate-300 leading-relaxed mb-4">
                                    {act.description}
                                  </Text>
                                  <div className="pt-3 border-t border-slate-600">
                                    <Text size="sm" className="text-white font-semibold">
                                      ⚡ Matched Talents: {act.talents.length}
                                    </Text>
                                  </div>
                                  {/* Arrow */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                    <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-slate-800"></div>
                                  </div>
                                </div>
                              </div>

                              {/* Act Label */}
                              <div className="absolute top-full mt-6 left-1/2 transform -translate-x-1/2 text-center">
                                <Text size="sm" weight="bold" className="whitespace-nowrap text-slate-200">
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
                  <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                    <CardContent className="p-10">
                      <div className="flex items-center justify-center mb-6">
                        <Crown className="h-16 w-16 text-yellow-400 animate-float" />
                      </div>
                      <Heading level={2} variant="heading" className="mb-6 font-display bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Ready to Create Magic?
                      </Heading>
                      <Text className="mb-8 max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed">
                        Your story has been quantum-analyzed and the perfect talent constellation has been mapped. 
                        Take the next step to transform your vision into cinematic reality.
                      </Text>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/projects/new">
                          <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-xl text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                          >
                            Create Full Project
                            <ArrowRight className="ml-3 h-6 w-6" />
                          </Button>
                        </Link>
                        <Link to="/talents">
                          <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-glow-green border-0 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
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
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-glow-pink border-0 text-white font-bold px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
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
