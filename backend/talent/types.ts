export type ExperienceLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type Availability = "available" | "busy" | "unavailable";
export type SubscriptionTier = "free" | "basic" | "premium";
export type MediaType = "image" | "video";
export type ProjectType = "film" | "commercial" | "tv_show" | "documentary" | "music_video" | "other";
export type ProjectStatus = "open" | "in_progress" | "completed" | "cancelled";
export type MatchStatus = "suggested" | "contacted" | "hired" | "rejected";

export interface Talent {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experienceLevel?: ExperienceLevel;
  hourlyRate?: number;
  availability?: Availability;
  profileImageUrl?: string;
  isVerified: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TalentMedia {
  id: number;
  talentId: number;
  mediaType: MediaType;
  mediaUrl: string;
  title?: string;
  description?: string;
  isFeatured: boolean;
  createdAt: Date;
}

export interface Project {
  id: number;
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
  status: ProjectStatus;
  createdByUserId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TalentMatch {
  id: number;
  projectId: number;
  talentId: number;
  matchScore: number;
  aiReasoning?: string;
  status: MatchStatus;
  createdAt: Date;
}
