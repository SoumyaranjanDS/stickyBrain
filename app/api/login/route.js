import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import pool from "@/lib/db";
import { hashSessionToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { z } from "zod";

export const runtime = "nodejs";

const loginSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().min(1).max(100),
});

export async function POST(request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Please enter a valid email and password." },
        { status: 400 },
      );
    }

    const { password } = result.data;
    const email = result.data.email.toLowerCase();

    const query = `SELECT id, name, email, password_hash
                FROM users 
                WHERE email = $1 `;

    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashSessionToken(token);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt],
    );

    const response = NextResponse.json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("auth_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON request." },
        { status: 400 },
      );
    }

    console.error("Login failed:", error.message);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
