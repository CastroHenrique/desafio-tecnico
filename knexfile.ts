import type { Knex } from "knex";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: "utf8",
      timezone: '-03:00',
    },
    migrations: {
      tableName: "migrations",
      disableMigrationsListValidation: true,
    }
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.PROJ_223_DB_HOST,
      port: parseInt(process.env.PROJ_223_DB_PORT || "3306", 10),
      user: process.env.PROJ_223_DB_USER,
      password: process.env.PROJ_223_DB_PASSWORD,
      database: process.env.PROJ_223_DB_NAME,
      charset: "utf8",
      timezone: '-03:00',
    },
    migrations: {
      tableName: "migrations",
      disableMigrationsListValidation: true,
    }
  }

};

module.exports = config;
