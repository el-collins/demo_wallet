import type { Knex } from "knex";
import dotenv from 'dotenv';
import logger from "./src/utils/logger";



dotenv.config();


const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000, // 10 seconds
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

export default config;
