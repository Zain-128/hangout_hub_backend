import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client.js";
import { applicationConfig } from "../constant.js";


function requireEnv(name: string, value: string | undefined): string {
    if (value == null || value === "") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }

// const adapter = new PrismaMariaDb({
//   host: requireEnv("DATABASE_HOST", applicationConfig.DATABASE_HOST),
//   user: requireEnv("DATABASE_USER", applicationConfig.DATABASE_USER),
//   password: requireEnv("DATABASE_PASSWORD", applicationConfig.DATABASE_PASSWORD),
//   database: requireEnv("DATABASE_NAME", applicationConfig.DATABASE_NAME),
//   connectionLimit: 5,
// });
const adapter = new PrismaMariaDb(requireEnv("DATABASE_URL" , applicationConfig.DATABASE_URL));
const prisma = new PrismaClient({ adapter });

export { prisma };