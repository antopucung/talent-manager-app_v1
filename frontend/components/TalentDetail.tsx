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
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading talent...</div>
      </div>
    );
  }

  if (error || !talent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Talent not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Talent Profile</h1>
        </div>
        
        <div className="flex space-x-2">
          <Link to={`/talents/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={talent.profileImageUrl} alt={talent.name} />
                  <AvatarFallback className="text-lg">
                    {talent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CardTitle className="text-2xl">{talent.name}</CardTitle>
                    {talent.isVerified && (
                      <CheckCircle className="h-6 w-6 text-blue-500" />
                    )}
                    <Badge variant={talent.subscriptionTier === 'premium' ? 'default' : talent.subscriptionTier === 'basic' ? 'secondary' : 'outline'}>
                      {talent.subscriptionTier}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">{talent.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {talent.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          {media?.media && media.media.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
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
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                      )}
                      {item.title && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-gray-600">{item.description}</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {talent.experienceLevel && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Experience Level</label>
                  <p className="capitalize">{talent.experienceLevel}</p>
                </div>
              )}
              
              {talent.availability && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Availability</label>
                  <Badge 
                    variant={talent.availability === 'available' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {talent.availability}
                  </Badge>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Member Since</label>
                <p>{new Date(talent.createdAt).toLocaleDateString()}</p>
              </div>
              
              {talent.subscriptionExpiresAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Subscription Expires</label>
                  <p>{new Date(talent.subscriptionExpiresAt).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                Contact Talent
              </Button>
              <Button className="w-full" variant="outline">
                Add to Project
              </Button>
              <Link to="/subscriptions">
                <Button className="w-full" variant="outline">
                  Upgrade Subscription
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
