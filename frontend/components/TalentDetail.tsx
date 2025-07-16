import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, MapPin, Mail, Phone, DollarSign, CheckCircle, Star } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Container } from '@/components/ui/layout/Container';
import { Section } from '@/components/ui/layout/Section';
import { Heading } from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';

export function TalentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: talent, isLoading, error } = useQuery({
    queryKey: ['talent', id],
    queryFn: () => backend.talent.get({ id: parseInt(id!) })
  });

  const { data: media } = useQuery({
    queryKey: ['talent-media', id],
    queryFn: () => backend.media.listMedia({ talentId: parseInt(id!) }),
    enabled: Boolean(id)
  });

  const deleteMutation = useMutation({
    mutationFn: () => backend.talent.deleteTalent({ id: parseInt(id!) }),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Talent deleted successfully' });
      navigate('/');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: 'Failed to delete talent', variant: 'destructive' });
    }
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this talent? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-slate-300">Loading talent...</div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-400">Talent not found</div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-slate-800 hover:text-blue-400 text-slate-300 border border-slate-700">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Heading level={1} variant="heading" className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Talent Profile
                </Heading>
              </div>
              
              <div className="flex space-x-2">
                <Link to={`/talents/${id}/edit`}>
                  <Button variant="outline" size="sm" className="border-slate-600 hover:bg-blue-600 hover:text-white text-slate-300">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Profile */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-20 w-20 ring-4 ring-blue-500/30">
                        <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                        <AvatarFallback className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {talent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-2xl text-slate-200">{talent.name}</CardTitle>
                          {talent.isVerified && (
                            <CheckCircle className="h-6 w-6 text-blue-400" />
                          )}
                          <Badge 
                            variant={talent.subscriptionTier === 'premium' ? 'default' : talent.subscriptionTier === 'basic' ? 'secondary' : 'outline'} 
                            className={talent.subscriptionTier === 'premium' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-slate-700 text-slate-300'}
                          >
                            {talent.subscriptionTier}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          {talent.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {talent.location}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {talent.email}
                          </div>
                          {talent.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {talent.phone}
                            </div>
                          )}
                          {talent.hourlyRate && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ${talent.hourlyRate}/hr
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {talent.bio && (
                    <CardContent>
                      <h3 className="font-semibold mb-2 text-slate-200">About</h3>
                      <Text className="leading-relaxed text-slate-300">{talent.bio}</Text>
                    </CardContent>
                  )}
                </Card>

                {/* Skills */}
                <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio */}
                {media?.media && media.media.length > 0 && (
                  <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-slate-200">Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {media.media.map((item) => (
                          <div key={item.id} className="relative group">
                            {item.mediaType === 'image' ? (
                              <img
                                src={item.mediaUrl}
                                alt={item.title || 'Portfolio item'}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ) : (
                              <video
                                src={item.mediaUrl}
                                className="w-full h-32 object-cover rounded-lg"
                                controls
                              />
                            )}
                            {item.isFeatured && (
                              <div className="absolute top-2 right-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              </div>
                            )}
                            {item.title && (
                              <div className="mt-2">
                                <Text size="sm" weight="medium" className="text-slate-200">{item.title}</Text>
                                {item.description && (
                                  <Text size="xs" className="text-slate-400">{item.description}</Text>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {talent.experienceLevel && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Experience Level</label>
                        <Text className="capitalize text-slate-200">{talent.experienceLevel}</Text>
                      </div>
                    )}
                    
                    {talent.availability && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Availability</label>
                        <Badge 
                          variant={talent.availability === 'available' ? 'default' : 'secondary'}
                          className={talent.availability === 'available' ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' : 'bg-slate-700 text-slate-400'}
                        >
                          {talent.availability}
                        </Badge>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-slate-400">Member Since</label>
                      <Text className="text-slate-200">{new Date(talent.createdAt).toLocaleDateString()}</Text>
                    </div>
                    
                    {talent.subscriptionExpiresAt && (
                      <div>
                        <label className="text-sm font-medium text-slate-400">Subscription Expires</label>
                        <Text className="text-slate-200">{new Date(talent.subscriptionExpiresAt).toLocaleDateString()}</Text>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-200">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                      Contact Talent
                    </Button>
                    <Button className="w-full border-slate-600 hover:bg-slate-700 text-slate-300" variant="outline">
                      Add to Project
                    </Button>
                    <Link to="/subscriptions">
                      <Button className="w-full border-slate-600 hover:bg-slate-700 text-slate-300" variant="outline">
                        Upgrade Subscription
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
