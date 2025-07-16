import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
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
      toast({ title: 'Success', description: 'Talent created successfully' });
      navigate('/talents');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({ title: 'Error', description: 'Failed to create talent', variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => backend.talent.update({ id: parseInt(id!), ...data }),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Talent updated successfully' });
      navigate(`/talents/${id}`);
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({ title: 'Error', description: 'Failed to update talent', variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <Section variant="elegant" padding="lg">
      <Container size="md">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-neutral-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <Heading level={1} variant="heading" className="text-neutral-900">
                {isEditing ? 'Edit Talent Profile' : 'Add New Talent'}
              </Heading>
              <Text color="muted">
                {isEditing ? 'Update talent information and portfolio' : 'Create a new talent profile for the platform'}
              </Text>
            </div>
          </div>

          {/* Form */}
          <Card className="border-neutral-200 shadow-lg">
            <CardHeader>
              <Heading level={3} variant="heading">Talent Information</Heading>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <Heading level={4} variant="heading" className="text-neutral-800 border-b border-neutral-200 pb-2">
                    Basic Information
                  </Heading>
                  
                  <Grid cols={2} gap="md">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-neutral-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Enter full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Enter email address"
                      />
                    </div>
                  </Grid>

                  <Grid cols={2} gap="md">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-neutral-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium text-neutral-700">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="City, State/Country"
                      />
                    </div>
                  </Grid>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium text-neutral-700">
                      Professional Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Tell us about this talent's experience, achievements, and specialties..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileImageUrl" className="text-sm font-medium text-neutral-700">
                      Profile Image URL
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="profileImageUrl"
                        value={formData.profileImageUrl}
                        onChange={(e) => handleInputChange('profileImageUrl', e.target.value)}
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button type="button" variant="outline" className="border-neutral-300">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Skills & Expertise */}
                <div className="space-y-6">
                  <Heading level={4} variant="heading" className="text-neutral-800 border-b border-neutral-200 pb-2">
                    Skills & Expertise
                  </Heading>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-neutral-700">Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill..."
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button 
                        type="button" 
                        onClick={addSkill} 
                        size="sm"
                        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center space-x-1 bg-primary-100 text-primary-800 border-primary-200">
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-status-error transition-colors"
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
                  <Heading level={4} variant="heading" className="text-neutral-800 border-b border-neutral-200 pb-2">
                    Professional Details
                  </Heading>
                  
                  <Grid cols={3} gap="md">
                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel" className="text-sm font-medium text-neutral-700">
                        Experience Level
                      </Label>
                      <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                        <SelectTrigger className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-sm font-medium text-neutral-700">
                        Hourly Rate ($)
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        step="0.01"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availability" className="text-sm font-medium text-neutral-700">
                        Availability
                      </Label>
                      <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                        <SelectTrigger className="border-neutral-300 focus:border-primary-500 focus:ring-primary-500">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Grid>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6 border-t border-neutral-200">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white border-0 shadow-lg"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? 'Saving...' 
                      : isEditing ? 'Update Talent' : 'Create Talent'
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(-1)}
                    className="border-neutral-300 hover:bg-neutral-50"
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
  );
}
