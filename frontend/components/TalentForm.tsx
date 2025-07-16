import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, X, Upload, Sparkles, Star, Zap } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Container } from '@/components/ui/layout/Container';
import { Section } from '@/components/ui/layout/Section';
import { Grid } from '@/components/ui/layout/Grid';
import { Heading } from '@/components/ui/typography/Heading';
import { Text } from '@/components/ui/typography/Text';

export function TalentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    skills: [] as string[],
    experienceLevel: '',
    hourlyRate: '',
    availability: '',
    profileImageUrl: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingTalent } = useQuery({
    queryKey: ['talent', id],
    queryFn: () => backend.talent.get({ id: parseInt(id!) }),
    enabled: isEditing
  });

  useEffect(() => {
    if (existingTalent) {
      setFormData({
        name: existingTalent.name,
        email: existingTalent.email,
        phone: existingTalent.phone || '',
        bio: existingTalent.bio || '',
        location: existingTalent.location || '',
        skills: existingTalent.skills,
        experienceLevel: existingTalent.experienceLevel || '',
        hourlyRate: existingTalent.hourlyRate?.toString() || '',
        availability: existingTalent.availability || '',
        profileImageUrl: existingTalent.profileImageUrl || ''
      });
    }
  }, [existingTalent]);

  const createMutation = useMutation({
    mutationFn: backend.talent.create,
    onSuccess: () => {
      toast({ 
        title: '🎉 Success!', 
        description: 'Talent created successfully and added to the constellation!' 
      });
      navigate('/talents');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({ 
        title: '❌ Error', 
        description: 'Failed to create talent', 
        variant: 'destructive' 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => backend.talent.update({ id: parseInt(id!), ...data }),
    onSuccess: () => {
      toast({ 
        title: '✨ Updated!', 
        description: 'Talent profile updated successfully!' 
      });
      navigate(`/talents/${id}`);
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({ 
        title: '❌ Error', 
        description: 'Failed to update talent', 
        variant: 'destructive' 
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submitData = {
      ...formData,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      experienceLevel: formData.experienceLevel || undefined,
      availability: formData.availability || undefined
    };

    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
    
    setTimeout(() => setIsSubmitting(false), 300);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <Section variant="default" padding="lg">
        <Container size="md">
          <div className="space-y-8">
            {/* Enhanced Header */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)} 
                className="hover:bg-white/20 backdrop-blur-sm border border-white/20 text-dark-700 hover:text-primary-600"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <Heading level={1} variant="heading" className="bg-gradient-primary bg-clip-text text-transparent font-display">
                  {isEditing ? 'Edit Talent Profile' : 'Add New Talent'}
                </Heading>
                <Text className="text-dark-600 text-lg">
                  {isEditing ? 'Update talent information and portfolio' : 'Create a new talent profile for the constellation'}
                </Text>
              </div>
            </div>

            {/* Enhanced Form */}
            <Card className="border-0 shadow-mega bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <Heading level={3} variant="heading" className="bg-gradient-primary bg-clip-text text-transparent">
                    Talent Information
                  </Heading>
                  <Sparkles className="h-5 w-5 text-secondary-500 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-4 border-b-2 border-gradient-primary">
                      <Zap className="h-5 w-5 text-primary-500" />
                      <Heading level={4} variant="heading" className="text-dark-800">
                        Basic Information
                      </Heading>
                    </div>
                    
                    <Grid cols={2} gap="md">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-dark-700">
                          ✨ Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold text-dark-700">
                          📧 Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          placeholder="Enter email address"
                        />
                      </div>
                    </Grid>

                    <Grid cols={2} gap="md">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-bold text-dark-700">
                          📱 Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          placeholder="Enter phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-bold text-dark-700">
                          📍 Location
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          placeholder="City, State/Country"
                        />
                      </div>
                    </Grid>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-bold text-dark-700">
                        📝 Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                        placeholder="Tell us about this talent's experience, achievements, and specialties..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileImageUrl" className="text-sm font-bold text-dark-700">
                        🖼️ Profile Image URL
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="profileImageUrl"
                          value={formData.profileImageUrl}
                          onChange={(e) => handleInputChange('profileImageUrl', e.target.value)}
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-2 border-primary-300 hover:bg-gradient-primary hover:text-white"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Expertise */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-4 border-b-2 border-gradient-secondary">
                      <Star className="h-5 w-5 text-secondary-500" />
                      <Heading level={4} variant="heading" className="text-dark-800">
                        Skills & Expertise
                      </Heading>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-dark-700">🎯 Skills</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill..."
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button 
                          type="button" 
                          onClick={addSkill} 
                          size="sm"
                          className="bg-gradient-secondary hover:bg-gradient-primary text-white border-0 transition-all duration-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            className="flex items-center space-x-1 bg-gradient-primary text-white border-0 shadow-electric"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-accent-red transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-4 border-b-2 border-gradient-success">
                      <Zap className="h-5 w-5 text-accent-neon" />
                      <Heading level={4} variant="heading" className="text-dark-800">
                        Professional Details
                      </Heading>
                    </div>
                    
                    <Grid cols={3} gap="md">
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel" className="text-sm font-bold text-dark-700">
                          ⭐ Experience Level
                        </Label>
                        <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                          <SelectTrigger className="border-2 border-primary-200 focus:border-primary-500 bg-white/80 backdrop-blur-sm">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">🌱 Beginner</SelectItem>
                            <SelectItem value="intermediate">🚀 Intermediate</SelectItem>
                            <SelectItem value="advanced">⚡ Advanced</SelectItem>
                            <SelectItem value="expert">👑 Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate" className="text-sm font-bold text-dark-700">
                          💰 Hourly Rate ($)
                        </Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          value={formData.hourlyRate}
                          onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                          className="border-2 border-primary-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-200 bg-white/80 backdrop-blur-sm"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="availability" className="text-sm font-bold text-dark-700">
                          🎯 Availability
                        </Label>
                        <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                          <SelectTrigger className="border-2 border-primary-200 focus:border-primary-500 bg-white/80 backdrop-blur-sm">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">✅ Available</SelectItem>
                            <SelectItem value="busy">⏰ Busy</SelectItem>
                            <SelectItem value="unavailable">❌ Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </Grid>
                  </div>

                  {/* Enhanced Form Actions */}
                  <div className="flex space-x-4 pt-8 border-t-2 border-gradient-primary">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending || isSubmitting}
                      className={`flex-1 font-bold text-lg py-4 transition-all duration-300 border-0 text-white ${
                        isSubmitting 
                          ? 'bg-gradient-success animate-pulse shadow-neon' 
                          : 'bg-gradient-primary hover:bg-gradient-secondary shadow-electric hover:shadow-glow hover:scale-105'
                      }`}
                    >
                      {createMutation.isPending || updateMutation.isPending || isSubmitting ? (
                        <>
                          <Sparkles className="h-5 w-5 mr-3 animate-spin" />
                          {isEditing ? 'Updating Magic...' : 'Creating Magic...'}
                        </>
                      ) : (
                        <>
                          <Star className="h-5 w-5 mr-3" />
                          {isEditing ? 'Update Talent' : 'Create Talent'}
                          <Zap className="h-5 w-5 ml-3 animate-pulse" />
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(-1)}
                      className="border-2 border-dark-300 hover:bg-dark-100 text-dark-700 font-semibold px-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  );
}
