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
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAIKey()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a professional story consultant for the film and commercial industry. 
              Help enhance and perfect story content for ${req.projectType || 'film'} projects.
              Provide detailed improvements, suggestions, and identify key story elements.`
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
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      
      // Parse the AI response (this is a simplified version)
      const sections = content.split('\n\n');
      const enhancedStory = sections[0] || req.storyContent;
      const suggestions = sections.slice(1, 4).map((s: string) => s.replace(/^\d+\.\s*/, ''));
      const keyElements = sections.slice(4).map((s: string) => s.replace(/^-\s*/, ''));
      
      return {
        enhancedStory,
        suggestions,
        keyElements
      };
    } catch (error) {
      console.error("AI enhancement error:", error);
      return {
        enhancedStory: req.storyContent,
        suggestions: ["Unable to generate suggestions at this time"],
        keyElements: ["Unable to extract key elements at this time"]
      };
    }
  }
);
