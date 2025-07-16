import { api, APIError } from "encore.dev/api";
import { talentDB } from "./db";

export interface DeleteTalentRequest {
  id: number;
}

// Deletes a talent profile.
export const deleteTalent = api<DeleteTalentRequest, void>(
  { expose: true, method: "DELETE", path: "/talents/:id" },
  async (req) => {
    const result = await talentDB.exec`
      DELETE FROM talents WHERE id = ${req.id}
    `;
    
    // Note: PostgreSQL doesn't return affected rows count in this context
    // We could do a separate check if needed
  }
);
