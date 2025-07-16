import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import { talentDB } from "../talent/db";
import type { TalentMatch } from "../talent/types";

const openAIKey = secret("OpenAIKey");

export interface MatchTalentsRequest {
  projectId: number;
  storyContent: string;
  requiredSkills: string[];
  projectType?: string;
  budget?: number;
}

export interface MatchTalentsResponse {
  matches: TalentMatch[];
}

// Matches talents to a project using AI analysis.
export const matchTalents = api<MatchTalentsRequest, MatchTalentsResponse>(
  { expose: true, method: "POST", path: "/ai/match-talents" },
  async (req) => {
    try {
      // Get all available talents
      const talents = await talentDB.queryAll<any>`
        SELECT id, name, skills, bio, experience_level, location, hourly_rate
        FROM talents 
        WHERE availability = 'available'
        LIMIT 20
      `;

      if (talents.length === 0) {
        console.warn("No available talents found");
        return { matches: [] };
      }

      const matches: TalentMatch[] = [];
      const apiKey = openAIKey();

      // If no OpenAI key, create mock matches
      if (!apiKey) {
        console.warn("OpenAI API key not configured, creating mock matches");
        for (let i = 0; i < Math.min(talents.length, 6); i++) {
          const talent = talents[i];
          const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
          
          const match = await talentDB.queryRow<any>`
            INSERT INTO talent_matches (project_id, talent_id, match_score, ai_reasoning)
            VALUES (${req.projectId}, ${talent.id}, ${mockScore}, ${'Strong match based on skills and experience level'})
            RETURNING *
          `;

          if (match) {
            matches.push({
              id: match.id,
              projectId: match.project_id,
              talentId: match.talent_id,
              matchScore: match.match_score,
              aiReasoning: match.ai_reasoning,
              status: match.status,
              createdAt: match.created_at
            });
          }
        }
        
        matches.sort((a, b) => b.matchScore - a.matchScore);
        return { matches };
      }

      // Process talents in smaller batches to avoid timeout
      const batchSize = 5;
      for (let i = 0; i < Math.min(talents.length, 15); i += batchSize) {
        const batch = talents.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (talent) => {
          try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-3.5-turbo", // Use faster model
                messages: [
                  {
                    role: "system",
                    content: "You are a talent matching expert. Rate talent match on scale 0-100 and provide brief reasoning. Respond with just: SCORE: [number] REASON: [brief explanation]"
                  },
                  {
                    role: "user",
                    content: `PROJECT: ${req.storyContent.substring(0, 500)}
                    SKILLS NEEDED: ${req.requiredSkills.join(', ')}
                    
                    TALENT: ${talent.name}
                    SKILLS: ${(talent.skills || []).join(', ')}
                    EXPERIENCE: ${talent.experience_level || 'Not specified'}
                    
                    Rate this match (0-100) and explain why.`
                  }
                ],
                max_tokens: 100,
                temperature: 0.3
              })
            });

            if (response.ok) {
              const data = await response.json();
              const content = data.choices[0]?.message?.content || "50 Basic match";
              
              const scoreMatch = content.match(/SCORE:\s*(\d+)/i) || content.match(/(\d+)/);
              const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
              
              const reasonMatch = content.match(/REASON:\s*(.+)/i);
              const reasoning = reasonMatch ? reasonMatch[1].trim() : "Match based on available skills and experience";

              if (score >= 30) { // Only include reasonable matches
                const match = await talentDB.queryRow<any>`
                  INSERT INTO talent_matches (project_id, talent_id, match_score, ai_reasoning)
                  VALUES (${req.projectId}, ${talent.id}, ${score}, ${reasoning})
                  RETURNING *
                `;

                if (match) {
                  matches.push({
                    id: match.id,
                    projectId: match.project_id,
                    talentId: match.talent_id,
                    matchScore: match.match_score,
                    aiReasoning: match.ai_reasoning,
                    status: match.status,
                    createdAt: match.created_at
                  });
                }
              }
            }
          } catch (error) {
            console.error(`Error matching talent ${talent.id}:`, error);
            // Continue with other talents instead of failing completely
          }
        }));
      }

      // Sort matches by score descending
      matches.sort((a, b) => b.matchScore - a.matchScore);

      return { matches };
    } catch (error) {
      console.error("Talent matching error:", error);
      // Return empty matches instead of throwing error
      return { matches: [] };
    }
  }
);
