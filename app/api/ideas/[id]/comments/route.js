import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const commentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});

export async function POST(request, context) {
  try {
    const { id } = await context.params;

    if (!z.string().uuid().safeParse(id).success) {
      return NextResponse.json(
        { message: "Invalid idea ID." },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please log in to comment." },
        { status: 401 },
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 },
      );
    }

    const result = commentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Comments must contain 1–1000 characters." },
        { status: 400 },
      );
    }

    const { rows: ideaRows } = await pool.query(
      "SELECT id FROM ideas WHERE id = $1 LIMIT 1",
      [id],
    );

    if (ideaRows.length === 0) {
      return NextResponse.json({ message: "Idea not found." }, { status: 404 });
    }

    const { rows } = await pool.query(
      `INSERT INTO idea_comments (idea_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [id, user.id, result.data.content],
    );

    return NextResponse.json(
      {
        message: "Comment added successfully.",
        comment: {
          ...rows[0],
          author_id: user.id,
          author_name: user.name,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create comment error:", error);

    return NextResponse.json(
      { message: "Unable to add your comment." },
      { status: 500 },
    );
  }
}
