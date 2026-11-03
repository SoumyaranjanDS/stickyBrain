import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const ideaSchema = z.object({
  title: z.string().trim().min(3).max(160),
  content: z.string().trim().min(10).max(5000),
  category: z.enum(["thought", "feature", "question", "project", "other"]),
});

export async function POST(request) {
  try {
    // 1. Authenticate the user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please log in to create an idea." },
        { status: 401 },
      );
    }

    // 2. Read the request body
    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 },
      );
    }

    // 3. Validate the input
    const result = ideaSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Please check your input.",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, content, category } = result.data;

    // 4. Insert the idea into PostgreSQL
    const { rows } = await pool.query(
      `INSERT INTO ideas (author_id, title, content, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, content, category, created_at`,
      [user.id, title, content, category],
    );

    // 5. Return the created idea
    return NextResponse.json(
      {
        message: "Idea created successfully.",
        idea: rows[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create idea error:", error);

    return NextResponse.json(
      { message: "Something went wrong while creating your idea." },
      { status: 500 },
    );
  }
}
