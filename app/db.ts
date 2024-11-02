import { drizzle } from "drizzle-orm/postgres-js";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

// Database connection
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(email: string) {
  const users = await ensureTableExists();
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(
  email: string,
  name: string,
  password: string
) {
  const users = await ensureTableExists();
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return await db.insert(users).values({ email, name, password: hash });
}

async function ensureTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(64),
        name VARCHAR(32),
        password VARCHAR(64)
      );`;
  }

  const table = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 64 }),
    name: varchar("name", { length: 32 }),
    password: varchar("password", { length: 64 }),
  });

  return table;
}
