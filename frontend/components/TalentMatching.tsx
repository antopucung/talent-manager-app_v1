import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Users, Star, CheckCircle, MapPin, DollarSign } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

export function TalentMatching() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => backend.projects.get({ id: parseInt(id!) }),
    enabled: Boolean(id)
  });

  const matchMutation = useMutation({
    mutationFn: backend.ai.matchTalents,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Talent matching completed!' });
    },
    onError: (error) => {
      console.error('Matching error:', error);
      toast({ title: 'Error', description: 'Failed to match talents', variant: 'destructive' });
    }
  });

  const { data: matches, refetch } = useQuery({
    queryKey: ['talent-matches', id],
    queryFn: () => backend.ai.getMatches({ projectId: parseInt(id!) }),
    enabled: Boolean(id)
  });

  const { data: talents } = useQuery({
    queryKey: ['matched-talents', matches?.matches],
    queryFn: async () => {
      if (!matches?.matches) return [];
      const talentPromises = matches.matches.map(match => 
        backend.talent.get({ id: match.talentId })
      );
      return Promise.all(talentPromises);
    },
    enabled: Boolean(matches?.matches?.length)
  });

  useEffect(() => {
    if (project && !matches) {
      // Auto-trigger matching when component loads
      matchMutation.mutate({
        projectId: project.id,
        storyContent: project.storyContent || '',
        requiredSkills: project.requiredSkills,
        projectType: project.projectType,
        budget: project.budgetMax
      });
    }
  }, [project, matches]);

  const runMatching = () => {
    if (project) {
      matchMutation.mutate({
        projectId: project.id,
        storyContent: project.storyContent || '',
        requiredSkills: project.requiredSkills,
        projectType: project.projectType,
        budget: project.budgetMax
      });
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Talent Matching</h1>
            <p className="text-gray-600">{project.title}</p>
          </div>
        </div>
        
        <Button 
          onClick={runMatching}
          disabled={matchMutation.isPending}
        >
          {matchMutation.isPending ? 'Matching...' : 'Run AI Matching'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Title</h3>
              <p className="text-sm text-gray-600">{project.title}</p>
            </div>
            
            {project.description && (
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            )}
            
            {project.projectType && (
              <div>
                <h3 className="font-semibold">Type</h3>
                <Badge variant="outline" className="capitalize">
                  {project.projectType.replace('_', ' ')}
                </Badge>
              </div>
            )}
            
            {project.requiredSkills.length > 0 && (
              <div>
                <h3 className="font-semibold">Required Skills</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {(project.budgetMin || project.budgetMax) && (
              <div>
                <h3 className="font-semibold">Budget</h3>
                <p className="text-sm text-gray-600">
                  {project.budgetMin && project.budgetMax 
                    ? `$${project.budgetMin} - $${project.budgetMax}`
                    : project.budgetMin 
                    ? `From $${project.budgetMin}`
                    : `Up to $${project.budgetMax}`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matching Results */}
        <div className="lg:col-span-2 space-y-6">
          {matchMutation.isPending && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <Users className="h-12 w-12 mx-auto text-purple-600 animate-pulse" />
                  <div>
                    <h3 className="text-lg font-semibold">AI is analyzing talents...</h3>
                    <p className="text-gray-600">This may take a few moments</p>
                  </div>
                  <Progress value={undefined} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {matches && talents && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Matched Talents ({matches.matches.length})
                </h2>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>

              {matches.matches.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600">No matches found</h3>
                    <p className="text-gray-500">Try adjusting your project requirements or add more talents to the database.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {matches.matches.map((match, index) => {
                    const talent = talents[index];
                    if (!talent) return null;

                    return (
                      <Card key={match.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                              <AvatarFallback>
                                {talent.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold">{talent.name}</h3>
                                    {talent.isVerified && (
                                      <CheckCircle className="h-5 w-5 text-blue-500" />
                                    )}
                                    <Badge variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'}>
                                      {talent.subscriptionTier}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    {talent.location && (
                                      <div className="flex items-center">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {talent.location}
                                      </div>
                                    )}
                                    {talent.hourlyRate && (
                                      <div className="flex items-center">
                                        <DollarSign className="h-3 w-3 mr-1" />
                                        ${talent.hourlyRate}/hr
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="font-semibold">{match.matchScore}%</span>
                                  </div>
                                  <p className="text-xs text-gray-500">Match Score</p>
                                </div>
                              </div>
                              
                              {talent.bio && (
                                <p className="text-sm text-gray-600 line-clamp-2">{talent.bio}</p>
                              )}
                              
                              <div className="flex flex-wrap gap-1">
                                {talent.skills.slice(0, 5).map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {talent.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{talent.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                              
                              {match.aiReasoning && (
                                <div className="bg-purple-50 p-3 rounded-lg">
                                  <h4 className="text-sm font-semibold text-purple-800 mb-1">
                                    AI Analysis
                                  </h4>
                                  <p className="text-sm text-purple-700">{match.aiReasoning}</p>
                                </div>
                              )}
                              
                              <div className="flex space-x-2">
                                <Link to={`/talents/${talent.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Profile
                                  </Button>
                                </Link>
                                <Button size="sm">
                                  Contact Talent
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
