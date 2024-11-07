import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.string("role").notNullable().defaultTo("user"); // Add role column with default value "user"
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.dropColumn("role");
  });
}