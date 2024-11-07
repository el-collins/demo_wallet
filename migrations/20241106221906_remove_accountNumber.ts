import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.dropColumn("accountNumber");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("users", (table) => {
    table.string("accountNumber").notNullable();
  });
}