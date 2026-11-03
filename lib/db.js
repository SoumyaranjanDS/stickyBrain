import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10,
  ssl: { rejectUnauthorized: true },
});

export default pool;
