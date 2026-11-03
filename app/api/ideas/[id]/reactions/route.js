import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const reactionSchema = z.object({
  reactionType: z.enum(["like", "love", "interesting", "inspired"]).nullable(),
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
        { message: "Please log in to react to an idea." },
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

    const result = reactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid reaction type." },
        { status: 400 },
      );
    }

    const { reactionType } = result.data;

    if (reactionType === null) {
      await pool.query(
        `DELETE FROM idea_reactions
         WHERE idea_id = $1 AND user_id = $2`,
        [id, user.id],
      );
    } else {
      await pool.query(
        `INSERT INTO idea_reactions
           (idea_id, user_id, reaction_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (idea_id, user_id)
         DO UPDATE SET
           reaction_type = EXCLUDED.reaction_type,
           updated_at = NOW()`,
        [id, user.id, reactionType],
      );
    }

    return NextResponse.json({
      message: "Reaction updated successfully.",
    });
  } catch (error) {
    console.error("Update reaction error:", error);

    return NextResponse.json(
      { message: "Unable to update your reaction." },
      { status: 500 },
    );
  }
}
