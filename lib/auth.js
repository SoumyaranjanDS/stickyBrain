import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import pool from "./db";

export function hashSessionToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_session")?.value;

  if (!token) {
    return null;
  }

  const tokenHash = hashSessionToken(token);

  const { rows } = await pool.query(
    `
    SELECT u.id, u.name, u.email
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = $1
        AND expires_at > NOW()
    LIMIT 1;
    `,
    [tokenHash],
  );

  return rows[0] ?? null;
}
