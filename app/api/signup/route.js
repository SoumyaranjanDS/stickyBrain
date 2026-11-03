import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export const runtime = "nodejs";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(100),
  password: z.string().min(6).max(12),
});

export async function POST(request) {
  try {
    const body = await request.json();

    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Please enter valid signup details." },
        { status: 400 },
      );
    }

    const { name, password } = result.data;
    const email = result.data.email.toLowerCase();

    const hashPassword = await bcrypt.hash(password, 12);

    const query = `INSERT INTO users(name, email, password_hash)
      VALUES ($1, $2, $3) 
      RETURNING id, name, email,created_at`;

    const { rows } = await pool.query(query, [name, email, hashPassword]);

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON request." },
        { status: 400 },
      );
    }

    console.error("Signup failed:", error.message);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
