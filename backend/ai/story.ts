import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openAIKey = secret("OpenAIKey");

export interface EnhanceStoryRequest {
  storyContent: string;
  projectType?: string;
  targetAudience?: string;
}

export interface EnhanceStoryResponse {
  enhancedStory: string;
  suggestions: string[];
  keyElements: string[];
}

// Enhances and perfects user story content using AI.
export const enhanceStory = api<EnhanceStoryRequest, EnhanceStoryResponse>(
  { expose: true, method: "POST", path: "/ai/enhance-story" },
  async (req) => {
    try {
      // Check if OpenAI key is available
      const apiKey = openAIKey();
      if (!apiKey) {
        console.warn("OpenAI API key not configured, returning mock response");
        return {
          enhancedStory: req.storyContent + "\n\n[Enhanced with professional storytelling techniques and visual narrative structure]",
          suggestions: [
            "Consider adding more visual elements to enhance cinematography",
            "Develop character backstories for deeper emotional connection",
            "Include specific lighting and mood requirements for each scene"
          ],
          keyElements: ["Visual Storytelling", "Character Development", "Cinematography", "Lighting Design"]
        };
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a professional story consultant for the film and commercial industry. 
              Help enhance and perfect story content for ${req.projectType || 'film'} projects.
              Provide detailed improvements, suggestions, and identify key story elements.
              
              Respond in this exact JSON format:
              {
                "enhancedStory": "enhanced version here",
                "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
                "keyElements": ["element1", "element2", "element3"]
              }`
            },
            {
              role: "user",
              content: `Please enhance this story content and provide suggestions:
              
              Story: ${req.storyContent}
              Project Type: ${req.projectType || 'Not specified'}
              Target Audience: ${req.targetAudience || 'Not specified'}
              
              Please provide:
              1. An enhanced version of the story
              2. 3-5 specific suggestions for improvement
              3. Key story elements that would help in talent matching`
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(content);
        return {
          enhancedStory: parsed.enhancedStory || req.storyContent,
          suggestions: parsed.suggestions || ["Unable to generate suggestions at this time"],
          keyElements: parsed.keyElements || ["Unable to extract key elements at this time"]
        };
      } catch (parseError) {
        // Fallback to text parsing if JSON parsing fails
        const sections = content.split('\n\n');
        const enhancedStory = sections[0] || req.storyContent;
        const suggestions = sections.slice(1, 4).map((s: string) => s.replace(/^\d+\.\s*/, ''));
        const keyElements = sections.slice(4).map((s: string) => s.replace(/^-\s*/, ''));
        
        return {
          enhancedStory,
          suggestions: suggestions.length > 0 ? suggestions : ["Consider adding more visual elements", "Develop character depth", "Include specific technical requirements"],
          keyElements: keyElements.length > 0 ? keyElements : ["Visual Storytelling", "Character Development", "Technical Skills"]
        };
      }
    } catch (error) {
      console.error("AI enhancement error:", error);
      // Return a fallback response instead of throwing
      return {
        enhancedStory: req.storyContent + "\n\n[Story enhancement temporarily unavailable]",
        suggestions: ["Story enhancement service is temporarily unavailable"],
        keyElements: ["General Production", "Creative Direction", "Technical Support"]
      };
    }
  }
);
