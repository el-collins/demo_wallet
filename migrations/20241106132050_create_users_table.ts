import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("email").notNullable().unique();
    table.string("firstName").notNullable();
    table.string("lastName").notNullable();
    table.string("phoneNumber").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());  
    table.timestamp("updatedAt")
      .defaultTo(knex.fn.now())
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
