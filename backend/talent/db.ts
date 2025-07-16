import { SQLDatabase } from "encore.dev/storage/sqldb";

export const talentDB = new SQLDatabase("talent", {
  migrations: "./migrations",
});
