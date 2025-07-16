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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Section variant="default" padding="lg">
        <Container size="md">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)} 
                className="hover:bg-slate-800 hover:text-blue-400 text-slate-300 backdrop-blur-sm border border-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <Heading level={1} variant="heading" className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-display">
                  {isEditing ? 'Edit Talent Profile' : 'Add New Talent'}
                </Heading>
                <Text className="text-slate-300 text-lg">
                  {isEditing ? 'Update talent information and portfolio' : 'Create a new talent profile for the constellation'}
                </Text>
              </div>
            </div>

            {/* Form */}
            <Card className="border-0 shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <Heading level={3} variant="heading" className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Talent Information
                  </Heading>
                  <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-4 border-b-2 border-blue-500/30">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <Heading level={4} variant="heading" className="text-slate-200">
                        Basic Information
                      </Heading>
                    </div>
                    
                    <Grid cols={2} gap="md">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-slate-300">
                          ✨ Full Name *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          placeholder="Enter full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-bold text-slate-300">
                          📧 Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          placeholder="Enter email address"
                        />
                      </div>
                    </Grid>

                    <Grid cols={2} gap="md">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-bold text-slate-300">
                          📱 Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          placeholder="Enter phone number"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-bold text-slate-300">
                          📍 Location
                        </Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          placeholder="City, State/Country"
                        />
                      </div>
                    </Grid>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-bold text-slate-300">
                        📝 Professional Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                        placeholder="Tell us about this talent's experience, achievements, and specialties..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileImageUrl" className="text-sm font-bold text-slate-300">
                        🖼️ Profile Image URL
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id="profileImageUrl"
                          value={formData.profileImageUrl}
                          onChange={(e) => handleInputChange('profileImageUrl', e.target.value)}
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-2 border-slate-600 hover:bg-blue-600 hover:text-white text-slate-300"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Skills & Expertise */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-4 border-b-2 border-purple-500/30">
                      <Star className="h-5 w-5 text-purple-500" />
                      <Heading level={4} variant="heading" className="text-slate-200">
                        Skills & Expertise
                      </Heading>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-300">🎯 Skills</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill..."
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        />
                        <Button 
                          type="button" 
                          onClick={addSkill} 
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transition-all duration-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-red-300 transition-colors"
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
                    <div className="flex items-center space-x-2 pb-4 border-b-2 border-green-500/30">
                      <Zap className="h-5 w-5 text-green-500" />
                      <Heading level={4} variant="heading" className="text-slate-200">
                        Professional Details
                      </Heading>
                    </div>
                    
                    <Grid cols={3} gap="md">
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel" className="text-sm font-bold text-slate-300">
                          ⭐ Experience Level
                        </Label>
                        <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                          <SelectTrigger className="border-2 border-slate-600 focus:border-blue-500 bg-slate-700/50 backdrop-blur-sm text-slate-200">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="beginner">🌱 Beginner</SelectItem>
                            <SelectItem value="intermediate">🚀 Intermediate</SelectItem>
                            <SelectItem value="advanced">⚡ Advanced</SelectItem>
                            <SelectItem value="expert">👑 Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate" className="text-sm font-bold text-slate-300">
                          💰 Hourly Rate ($)
                        </Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          value={formData.hourlyRate}
                          onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                          className="border-2 border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-slate-700/50 backdrop-blur-sm text-slate-200 placeholder:text-slate-400"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="availability" className="text-sm font-bold text-slate-300">
                          🎯 Availability
                        </Label>
                        <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                          <SelectTrigger className="border-2 border-slate-600 focus:border-blue-500 bg-slate-700/50 backdrop-blur-sm text-slate-200">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="available">✅ Available</SelectItem>
                            <SelectItem value="busy">⏰ Busy</SelectItem>
                            <SelectItem value="unavailable">❌ Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </Grid>
                  </div>

                  {/* Form Actions */}
                  <div className="flex space-x-4 pt-8 border-t-2 border-blue-500/30">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending || isSubmitting}
                      className={`flex-1 font-bold text-lg py-4 transition-all duration-300 border-0 text-white ${
                        isSubmitting 
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 animate-pulse shadow-glow-green' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-glow-blue hover:scale-105'
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
                      className="border-2 border-slate-600 hover:bg-slate-700 text-slate-300 font-semibold px-8"
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
