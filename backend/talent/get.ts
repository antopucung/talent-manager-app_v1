import { api, APIError } from "encore.dev/api";
import { talentDB } from "./db";
import type { Talent, ExperienceLevel, Availability, SubscriptionTier } from "./types";

export interface GetTalentRequest {
  id: number;
}

// Retrieves a specific talent by ID.
export const get = api<GetTalentRequest, Talent>(
  { expose: true, method: "GET", path: "/talents/:id" },
  async (req) => {
    const row = await talentDB.queryRow<any>`
      SELECT * FROM talents WHERE id = ${req.id}
    `;
    
    if (!row) {
      throw APIError.notFound("talent not found");
    }
    
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      bio: row.bio,
      location: row.location,
      skills: row.skills || [],
      experienceLevel: row.experience_level as ExperienceLevel,
      hourlyRate: row.hourly_rate,
      availability: row.availability as Availability,
      profileImageUrl: row.profile_image_url,
      isVerified: row.is_verified,
      subscriptionTier: row.subscription_tier as SubscriptionTier,
      subscriptionExpiresAt: row.subscription_expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
);
