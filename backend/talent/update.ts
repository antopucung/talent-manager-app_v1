import { api, APIError } from "encore.dev/api";
import { talentDB } from "./db";
import type { Talent, ExperienceLevel, Availability, SubscriptionTier } from "./types";

export interface UpdateTalentRequest {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experienceLevel?: ExperienceLevel;
  hourlyRate?: number;
  availability?: Availability;
  profileImageUrl?: string;
}

// Updates an existing talent profile.
export const update = api<UpdateTalentRequest, Talent>(
  { expose: true, method: "PUT", path: "/talents/:id" },
  async (req) => {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    
    if (req.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(req.name);
      paramIndex++;
    }
    
    if (req.email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      params.push(req.email);
      paramIndex++;
    }
    
    if (req.phone !== undefined) {
      updates.push(`phone = $${paramIndex}`);
      params.push(req.phone);
      paramIndex++;
    }
    
    if (req.bio !== undefined) {
      updates.push(`bio = $${paramIndex}`);
      params.push(req.bio);
      paramIndex++;
    }
    
    if (req.location !== undefined) {
      updates.push(`location = $${paramIndex}`);
      params.push(req.location);
      paramIndex++;
    }
    
    if (req.skills !== undefined) {
      updates.push(`skills = $${paramIndex}`);
      params.push(req.skills);
      paramIndex++;
    }
    
    if (req.experienceLevel !== undefined) {
      updates.push(`experience_level = $${paramIndex}`);
      params.push(req.experienceLevel);
      paramIndex++;
    }
    
    if (req.hourlyRate !== undefined) {
      updates.push(`hourly_rate = $${paramIndex}`);
      params.push(req.hourlyRate);
      paramIndex++;
    }
    
    if (req.availability !== undefined) {
      updates.push(`availability = $${paramIndex}`);
      params.push(req.availability);
      paramIndex++;
    }
    
    if (req.profileImageUrl !== undefined) {
      updates.push(`profile_image_url = $${paramIndex}`);
      params.push(req.profileImageUrl);
      paramIndex++;
    }
    
    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }
    
    updates.push(`updated_at = NOW()`);
    params.push(req.id);
    
    const query = `
      UPDATE talents 
      SET ${updates.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;
    
    const row = await talentDB.rawQueryRow<any>(query, ...params);
    
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
