import { Pool } from 'pg';

// BUG FIX: 'ssl: true' is too permissive and can fail with Neon's pooled connections.
// Using ssl: { rejectUnauthorized: false } for compatibility.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
