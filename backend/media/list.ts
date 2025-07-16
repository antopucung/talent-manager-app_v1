import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { talentDB } from "../talent/db";
import type { TalentMedia, MediaType } from "../talent/types";

export interface ListMediaRequest {
  talentId: Query<number>;
  mediaType?: Query<MediaType>;
  featured?: Query<boolean>;
}

export interface ListMediaResponse {
  media: TalentMedia[];
}

// Retrieves media for a specific talent.
export const listMedia = api<ListMediaRequest, ListMediaResponse>(
  { expose: true, method: "GET", path: "/media" },
  async (req) => {
    let whereConditions = ["talent_id = $1"];
    let params: any[] = [req.talentId];
    let paramIndex = 2;
    
    if (req.mediaType) {
      whereConditions.push(`media_type = $${paramIndex}`);
      params.push(req.mediaType);
      paramIndex++;
    }
    
    if (req.featured !== undefined) {
      whereConditions.push(`is_featured = $${paramIndex}`);
      params.push(req.featured);
      paramIndex++;
    }
    
    const query = `
      SELECT * FROM talent_media 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY is_featured DESC, created_at DESC
    `;
    
    const rows = await talentDB.rawQueryAll<any>(query, ...params);
    
    const media: TalentMedia[] = rows.map(row => ({
      id: row.id,
      talentId: row.talent_id,
      mediaType: row.media_type as MediaType,
      mediaUrl: row.media_url,
      title: row.title,
      description: row.description,
      isFeatured: row.is_featured,
      createdAt: row.created_at
    }));
    
    return { media };
  }
);
