import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('email').notNullable().unique();
    table.string('phoneNumber').notNullable();
    table.string('password').notNullable();
    table.string('accountNumber').notNullable().unique();
    table.timestamp('createdAt')
    table.timestamp('updatedAt')
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}