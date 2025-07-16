import { api, APIError } from "encore.dev/api";
import { talentDB } from "../talent/db";
import type { Project, ProjectType, ProjectStatus } from "../talent/types";

export interface GetProjectRequest {
  id: number;
}

// Retrieves a specific project by ID.
export const get = api<GetProjectRequest, Project>(
  { expose: true, method: "GET", path: "/projects/:id" },
  async (req) => {
    const row = await talentDB.queryRow<any>`
      SELECT * FROM projects WHERE id = ${req.id}
    `;
    
    if (!row) {
      throw APIError.notFound("project not found");
    }
    
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      storyContent: row.story_content,
      budgetMin: row.budget_min,
      budgetMax: row.budget_max,
      projectType: row.project_type as ProjectType,
      requiredSkills: row.required_skills || [],
      location: row.location,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status as ProjectStatus,
      createdByUserId: row.created_by_user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
);
