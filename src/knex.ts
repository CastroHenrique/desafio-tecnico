import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const connection = {
  uri: process.env.DB_CONNECTION_STRING,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  decimalNumbers: true,
  typeCast: (field: any, next: any) => {
    if (field.type === "DECIMAL" || field.type === "NEWDECIMAL") {
      const value = field.string();
      return value === null ? null : parseFloat(value);
    }
    return next();
  },
};

export default knex({
  client: "mysql2",
  connection,
  migrations: {
    disableMigrationsListValidation: true,
  },
});