import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table.uuid("walletId").notNullable().references("id").inTable("wallets").onDelete("CASCADE");
    table.enu("type", ["FUNDING", "TRANSFER", "WITHDRAWAL"]).notNullable();
    table.decimal("amount", 14, 2).notNullable();
    table.enu("status", ["PENDING", "COMPLETED", "FAILED"]).notNullable();
    table.string("reference").notNullable().unique();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
}