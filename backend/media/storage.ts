import { Bucket } from "encore.dev/storage/objects";

export const talentMediaBucket = new Bucket("talent-media", {
  public: true
});
