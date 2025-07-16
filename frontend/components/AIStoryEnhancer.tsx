import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Sparkles, ArrowLeft, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export function AIStoryEnhancer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    storyContent: '',
    projectType: '',
    targetAudience: ''
  });
  
  const [result, setResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const enhanceMutation = useMutation({
    mutationFn: backend.ai.enhanceStory,
    onSuccess: (data) => {
      setResult(data);
      toast({ title: 'Success', description: 'Story enhanced successfully!' });
    },
    onError: (error) => {
      console.error('Enhancement error:', error);
      toast({ title: 'Error', description: 'Failed to enhance story', variant: 'destructive' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storyContent.trim()) {
      toast({ title: 'Error', description: 'Please enter story content', variant: 'destructive' });
      return;
    }
    enhanceMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast({ title: 'Copied!', description: 'Text copied to clipboard' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to copy text', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Story Enhancer</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storyContent">Story Content *</Label>
                <Textarea
                  id="storyContent"
                  value={formData.storyContent}
                  onChange={(e) => handleInputChange('storyContent', e.target.value)}
                  rows={8}
                  placeholder="Enter your story content here..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="film">Film</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="tv_show">TV Show</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="music_video">Music Video</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="e.g., Young adults, families, professionals..."
                />
              </div>

              <Button 
                type="submit" 
                disabled={enhanceMutation.isPending}
                className="w-full"
              >
                {enhanceMutation.isPending ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Enhancing Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enhance with AI
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Enhanced Story */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Enhanced Story</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.enhancedStory, 0)}
                >
                  {copiedIndex === 0 ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{result.enhancedStory}</p>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm flex-1">{suggestion}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(suggestion, index + 1)}
                      >
                        {copiedIndex === index + 1 ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Elements */}
            <Card>
              <CardHeader>
                <CardTitle>Key Story Elements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {result.keyElements.map((element: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {element}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/projects/new')}
                >
                  Create Project with Enhanced Story
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => copyToClipboard(result.enhancedStory, -1)}
                >
                  Copy Enhanced Story
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
