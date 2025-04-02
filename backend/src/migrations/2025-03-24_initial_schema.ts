import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("todo")
    .addColumn("id", "serial", (column) => column.primaryKey())
    .addColumn("name", "varchar(255)", (column) => column.notNull())
    .addColumn("description", "varchar(255)", (column) => column.notNull())
    .addColumn("isComplete", "boolean", (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("todo").execute();
}
