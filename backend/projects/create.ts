import { api } from "encore.dev/api";
import { talentDB } from "../talent/db";
import type { Project, ProjectType, ProjectStatus } from "../talent/types";

export interface CreateProjectRequest {
  title: string;
  description?: string;
  storyContent?: string;
  budgetMin?: number;
  budgetMax?: number;
  projectType?: ProjectType;
  requiredSkills: string[];
  location?: string;
  startDate?: Date;
  endDate?: Date;
  createdByUserId?: number;
}

// Creates a new project.
export const create = api<CreateProjectRequest, Project>(
  { expose: true, method: "POST", path: "/projects" },
  async (req) => {
    const project = await talentDB.queryRow<any>`
      INSERT INTO projects (
        title, description, story_content, budget_min, budget_max,
        project_type, required_skills, location, start_date, end_date, created_by_user_id
      ) VALUES (
        ${req.title}, ${req.description}, ${req.storyContent}, ${req.budgetMin}, ${req.budgetMax},
        ${req.projectType}, ${req.requiredSkills}, ${req.location}, ${req.startDate}, ${req.endDate}, ${req.createdByUserId}
      ) RETURNING *
    `;
    
    if (!project) {
      throw new Error("Failed to create project");
    }
    
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      storyContent: project.story_content,
      budgetMin: project.budget_min,
      budgetMax: project.budget_max,
      projectType: project.project_type as ProjectType,
      requiredSkills: project.required_skills || [],
      location: project.location,
      startDate: project.start_date,
      endDate: project.end_date,
      status: project.status as ProjectStatus,
      createdByUserId: project.created_by_user_id,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
  }
);
