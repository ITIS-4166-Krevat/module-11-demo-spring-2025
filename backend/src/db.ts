import * as path from "path";
import pg, { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
  Generated,
} from "kysely";

type Database = {
  todo: TodoTable;
};

type TodoTable = {
  id: Generated<number>;
  name: string;
  description: string;
  isComplete: boolean;
};

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    database: "todosdemo",
    host: "localhost",
    user: "postgres",
    password: "postgres",
    port: 5432,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    // This needs to be an absolute path.
    migrationFolder: path.join(import.meta.dirname, "migrations"),
  }),
});

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest();

  let migrationErrored = false;
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
      migrationErrored = true;
    }
  });

  if (error || migrationErrored) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }
}
