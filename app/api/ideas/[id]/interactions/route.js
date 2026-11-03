import { NextResponse } from "next/server";
import { z } from "zod";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const idSchema = z.string().uuid();

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    if (!idSchema.safeParse(id).success) {
      return NextResponse.json(
        { message: "Invalid idea ID." },
        { status: 400 },
      );
    }

    const user = await getCurrentUser();

    const [reactionResult, commentResult, myReactionResult] = await Promise.all(
      [
        pool.query(
          `SELECT reaction_type, COUNT(*)::int AS count
           FROM idea_reactions
           WHERE idea_id = $1
           GROUP BY reaction_type`,
          [id],
        ),

        pool.query(
          `SELECT
             c.id,
             c.content,
             c.created_at,
             u.id AS author_id,
             u.name AS author_name
           FROM idea_comments c
           JOIN users u ON u.id = c.author_id
           WHERE c.idea_id = $1
           ORDER BY c.created_at DESC, c.id DESC
           LIMIT 50`,
          [id],
        ),

        user
          ? pool.query(
              `SELECT reaction_type
               FROM idea_reactions
               WHERE idea_id = $1 AND user_id = $2
               LIMIT 1`,
              [id, user.id],
            )
          : Promise.resolve({ rows: [] }),
      ],
    );

    const reactionCounts = {
      like: 0,
      love: 0,
      interesting: 0,
      inspired: 0,
    };

    for (const row of reactionResult.rows) {
      reactionCounts[row.reaction_type] = row.count;
    }

    return NextResponse.json({
      reactionCounts,
      myReaction: myReactionResult.rows[0]?.reaction_type ?? null,
      comments: commentResult.rows.reverse(),
      isLoggedIn: Boolean(user),
    });
  } catch (error) {
    console.error("Load idea interactions error:", error);

    return NextResponse.json(
      { message: "Unable to load reactions and comments." },
      { status: 500 },
    );
  }
}
