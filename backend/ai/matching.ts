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
      `;

      const matches: TalentMatch[] = [];

      for (const talent of talents) {
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
                  content: "You are a talent matching expert for the film and commercial industry. Analyze how well a talent matches a project based on story content, required skills, and talent profile."
                },
                {
                  role: "user",
                  content: `Rate this talent match on a scale of 0-100 and provide reasoning:

                  PROJECT:
                  Story: ${req.storyContent}
                  Required Skills: ${req.requiredSkills.join(', ')}
                  Type: ${req.projectType || 'Not specified'}
                  Budget: ${req.budget || 'Not specified'}

                  TALENT:
                  Name: ${talent.name}
                  Skills: ${(talent.skills || []).join(', ')}
                  Bio: ${talent.bio || 'No bio provided'}
                  Experience: ${talent.experience_level || 'Not specified'}
                  Location: ${talent.location || 'Not specified'}
                  Rate: ${talent.hourly_rate || 'Not specified'}

                  Respond with just a number (0-100) followed by a brief explanation.`
                }
              ],
              max_tokens: 200,
              temperature: 0.3
            })
          });

          if (response.ok) {
            const data = await response.json();
            const content = data.choices[0]?.message?.content || "0 No analysis available";
            const scoreMatch = content.match(/(\d+)/);
            const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
            const reasoning = content.replace(/^\d+\s*/, '');

            if (score >= 30) { // Only include matches with score >= 30
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
        }
      }

      // Sort matches by score descending
      matches.sort((a, b) => b.matchScore - a.matchScore);

      return { matches };
    } catch (error) {
      console.error("Talent matching error:", error);
      return { matches: [] };
    }
  }
);
