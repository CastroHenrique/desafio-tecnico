import dotenv from "dotenv";
import Knex from "knex";
import "ts-node/register";

dotenv.config();

process.env.DB_NAME = `${process.env.DB_NAME}_test`;
process.env.DB_CONNECTION_STRING = `${process.env.DB_CONNECTION_STRING}_test`;
// Cria o banco de teste
async function createTestDatabase() {
  const knex = Knex({
    client: "mysql2",
    connection: {
      uri: process.env.DB_CONNECTION_STRING,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  });

  try {
    await knex.raw(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\``);
    await knex.raw(`CREATE DATABASE \`${process.env.DB_NAME}\``);

    console.log("Test database created");
  } finally {
    await knex.destroy();
  }
}

// Executa migrations e seeds
async function seedTestDatabase() {
   const knex = Knex({
    client: "mysql2",
    connection: {
      uri: process.env.DB_CONNECTION_STRING,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }
  });

  try {
    await knex.migrate.latest();
    await knex.seed.run();
    

    console.log("Test database migrated and seeded");
  } finally {
    await knex.destroy();
  }
}

export default async function globalSetup() {
  try {
    await createTestDatabase();
    await seedTestDatabase();
  } catch (error) {
    console.error("Test setup failed:", error);
    process.exit(1);
  }
}