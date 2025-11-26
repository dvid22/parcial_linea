import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// 👇 Cloud Run = production
const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || 5432,
    dialect: "postgres",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {} // 👈 local SIN SSL
  }
);

export default sequelize;
