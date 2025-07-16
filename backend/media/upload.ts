import { api } from "encore.dev/api";
import { talentMediaBucket } from "./storage";
import { talentDB } from "../talent/db";
import type { TalentMedia, MediaType } from "../talent/types";

export interface UploadMediaRequest {
  talentId: number;
  mediaType: MediaType;
  title?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface UploadMediaResponse {
  uploadUrl: string;
  mediaId: number;
}

// Generates a signed upload URL for talent media.
export const generateUploadUrl = api<UploadMediaRequest, UploadMediaResponse>(
  { expose: true, method: "POST", path: "/media/upload" },
  async (req) => {
    const fileName = `${req.talentId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const { url } = await talentMediaBucket.signedUploadUrl(fileName, { ttl: 3600 });
    
    const mediaUrl = talentMediaBucket.publicUrl(fileName);
    
    const media = await talentDB.queryRow<any>`
      INSERT INTO talent_media (talent_id, media_type, media_url, title, description, is_featured)
      VALUES (${req.talentId}, ${req.mediaType}, ${mediaUrl}, ${req.title}, ${req.description}, ${req.isFeatured || false})
      RETURNING *
    `;
    
    if (!media) {
      throw new Error("Failed to create media record");
    }
    
    return {
      uploadUrl: url,
      mediaId: media.id
    };
  }
);
