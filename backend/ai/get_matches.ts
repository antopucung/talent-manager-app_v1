import { api } from "encore.dev/api";
import { talentDB } from "../talent/db";
import type { TalentMatch } from "../talent/types";

export interface GetMatchesRequest {
  projectId: number;
}

export interface GetMatchesResponse {
  matches: TalentMatch[];
}

// Retrieves talent matches for a specific project.
export const getMatches = api<GetMatchesRequest, GetMatchesResponse>(
  { expose: true, method: "GET", path: "/ai/matches/:projectId" },
  async (req) => {
    const rows = await talentDB.queryAll<any>`
      SELECT * FROM talent_matches 
      WHERE project_id = ${req.projectId}
      ORDER BY match_score DESC
    `;
    
    const matches: TalentMatch[] = rows.map(row => ({
      id: row.id,
      projectId: row.project_id,
      talentId: row.talent_id,
      matchScore: row.match_score,
      aiReasoning: row.ai_reasoning,
      status: row.status,
      createdAt: row.created_at
    }));
    
    return { matches };
  }
);
