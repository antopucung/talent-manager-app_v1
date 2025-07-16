import { api } from "encore.dev/api";
import { talentDB } from "./db";
import type { Talent, ExperienceLevel, Availability, SubscriptionTier } from "./types";

export interface CreateTalentRequest {
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
}

// Creates a new talent profile.
export const create = api<CreateTalentRequest, Talent>(
  { expose: true, method: "POST", path: "/talents" },
  async (req) => {
    const talent = await talentDB.queryRow<Talent>`
      INSERT INTO talents (
        name, email, phone, bio, location, skills, 
        experience_level, hourly_rate, availability, profile_image_url
      ) VALUES (
        ${req.name}, ${req.email}, ${req.phone}, ${req.bio}, ${req.location}, 
        ${req.skills}, ${req.experienceLevel}, ${req.hourlyRate}, 
        ${req.availability}, ${req.profileImageUrl}
      ) RETURNING *
    `;
    
    if (!talent) {
      throw new Error("Failed to create talent");
    }
    
    return {
      ...talent,
      skills: talent.skills || [],
      subscriptionTier: talent.subscription_tier as SubscriptionTier,
      experienceLevel: talent.experience_level as ExperienceLevel,
      availability: talent.availability as Availability,
      isVerified: talent.is_verified,
      profileImageUrl: talent.profile_image_url,
      subscriptionExpiresAt: talent.subscription_expires_at,
      createdAt: talent.created_at,
      updatedAt: talent.updated_at,
      hourlyRate: talent.hourly_rate
    };
  }
);
