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
      <div className="min-h-screen bg-white">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <Text size="lg" className="text-neutral-600">Loading talent profile...</Text>
              </div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen bg-white">
        <Section variant="default" padding="xl">
          <Container>
            <div className="flex items-center justify-center h-64">
              <Text size="lg" className="text-status-error">Talent not found</Text>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Section variant="default" padding="lg">
        <Container size="xl">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-neutral-100 text-neutral-700">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Heading level={1} variant="heading" className="text-neutral-900">
                  Talent Profile
                </Heading>
              </div>
              
              <div className="flex space-x-2">
                <Link to={`/talents/${id}/edit`}>
                  <Button variant="outline" size="sm" className="border-neutral-200 hover:bg-neutral-50 text-neutral-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="bg-status-error hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="border border-neutral-200 shadow-apple bg-white">
                  <CardHeader>
                    <div className="flex items-start space-x-6">
                      <Avatar className="h-24 w-24 ring-4 ring-neutral-100">
                        <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                        <AvatarFallback className="text-xl bg-neutral-600 text-white font-semibold">
                          {talent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <CardTitle className="text-3xl text-neutral-900">{talent.name}</CardTitle>
                          {talent.isVerified && (
                            <CheckCircle className="h-6 w-6 text-primary-600" />
                          )}
                          <Badge 
                            variant={talent.subscriptionTier === 'premium' ? 'default' : 'secondary'} 
                            className={talent.subscriptionTier === 'premium' ? 'bg-film-gold text-white border-0' : 'bg-neutral-100 text-neutral-600'}
                          >
                            {talent.subscriptionTier}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
                          {talent.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {talent.location}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {talent.email}
                          </div>
                          {talent.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {talent.phone}
                            </div>
                          )}
                          {talent.hourlyRate && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-2" />
                              ${talent.hourlyRate}/hr
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {talent.bio && (
                    <CardContent>
                      <h3 className="font-semibold mb-3 text-neutral-900">About</h3>
                      <Text className="leading-relaxed text-neutral-700">{talent.bio}</Text>
                    </CardContent>
                  )}
                </Card>

                {/* Skills */}
                <Card className="border border-neutral-200 shadow-apple bg-white">
                  <CardHeader>
                    <CardTitle className="text-neutral-900">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {talent.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-neutral-100 text-neutral-700 border border-neutral-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Portfolio */}
                {media?.media && media.media.length > 0 && (
                  <Card className="border border-neutral-200 shadow-apple bg-white">
                    <CardHeader>
                      <CardTitle className="text-neutral-900">Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {media.media.map((item) => (
                          <div key={item.id} className="relative group">
                            {item.mediaType === 'image' ? (
                              <img
                                src={item.mediaUrl}
                                alt={item.title || 'Portfolio item'}
                                className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                              />
                            ) : (
                              <video
                                src={item.mediaUrl}
                                className="w-full h-32 object-cover rounded-lg border border-neutral-200"
                                controls
                              />
                            )}
                            {item.isFeatured && (
                              <div className="absolute top-2 right-2">
                                <Star className="h-4 w-4 text-film-gold fill-current" />
                              </div>
                            )}
                            {item.title && (
                              <div className="mt-2">
                                <Text size="sm" weight="medium" className="text-neutral-900">{item.title}</Text>
                                {item.description && (
                                  <Text size="xs" className="text-neutral-600">{item.description}</Text>
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
                <Card className="border border-neutral-200 shadow-apple bg-white">
                  <CardHeader>
                    <CardTitle className="text-neutral-900">Quick Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {talent.experienceLevel && (
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Experience Level</label>
                        <Text className="capitalize text-neutral-900">{talent.experienceLevel}</Text>
                      </div>
                    )}
                    
                    {talent.availability && (
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Availability</label>
                        <Badge 
                          variant={talent.availability === 'available' ? 'default' : 'secondary'}
                          className={talent.availability === 'available' ? 'bg-status-success text-white' : 'bg-neutral-200 text-neutral-600'}
                        >
                          {talent.availability}
                        </Badge>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-neutral-600">Member Since</label>
                      <Text className="text-neutral-900">{new Date(talent.createdAt).toLocaleDateString()}</Text>
                    </div>
                    
                    {talent.subscriptionExpiresAt && (
                      <div>
                        <label className="text-sm font-medium text-neutral-600">Subscription Expires</label>
                        <Text className="text-neutral-900">{new Date(talent.subscriptionExpiresAt).toLocaleDateString()}</Text>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-neutral-200 shadow-apple bg-white">
                  <CardHeader>
                    <CardTitle className="text-neutral-900">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium">
                      Contact Talent
                    </Button>
                    <Button className="w-full border-neutral-200 hover:bg-neutral-50 text-neutral-700" variant="outline">
                      Add to Project
                    </Button>
                    <Link to="/subscriptions">
                      <Button className="w-full border-neutral-200 hover:bg-neutral-50 text-neutral-700" variant="outline">
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
