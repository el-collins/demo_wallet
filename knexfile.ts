import type { Knex } from "knex";
import dotenv from 'dotenv';


// Update with your config settings.

dotenv.config();


const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 0,
    max: 7,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: './migrations',
  },
};

module.exports = config;
