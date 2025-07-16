import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { talentDB } from "./db";
import type { Talent, ExperienceLevel, Availability, SubscriptionTier } from "./types";

export interface ListTalentsRequest {
  limit?: Query<number>;
  offset?: Query<number>;
  skills?: Query<string>;
  location?: Query<string>;
  experienceLevel?: Query<ExperienceLevel>;
  availability?: Query<Availability>;
  verified?: Query<boolean>;
}

export interface ListTalentsResponse {
  talents: Talent[];
  total: number;
}

// Retrieves all talents with optional filtering.
export const list = api<ListTalentsRequest, ListTalentsResponse>(
  { expose: true, method: "GET", path: "/talents" },
  async (req) => {
    const limit = req.limit || 20;
    const offset = req.offset || 0;
    
    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;
    
    if (req.skills) {
      whereConditions.push(`skills && $${paramIndex}`);
      params.push([req.skills]);
      paramIndex++;
    }
    
    if (req.location) {
      whereConditions.push(`location ILIKE $${paramIndex}`);
      params.push(`%${req.location}%`);
      paramIndex++;
    }
    
    if (req.experienceLevel) {
      whereConditions.push(`experience_level = $${paramIndex}`);
      params.push(req.experienceLevel);
      paramIndex++;
    }
    
    if (req.availability) {
      whereConditions.push(`availability = $${paramIndex}`);
      params.push(req.availability);
      paramIndex++;
    }
    
    if (req.verified !== undefined) {
      whereConditions.push(`is_verified = $${paramIndex}`);
      params.push(req.verified);
      paramIndex++;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    const countQuery = `SELECT COUNT(*) as total FROM talents ${whereClause}`;
    const totalResult = await talentDB.rawQueryRow<{ total: number }>(countQuery, ...params);
    const total = totalResult?.total || 0;
    
    const query = `
      SELECT * FROM talents 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);
    
    const rows = await talentDB.rawQueryAll<any>(query, ...params);
    
    const talents: Talent[] = rows.map(row => ({
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
    }));
    
    return { talents, total };
  }
);
