import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashSessionToken } from "@/lib/auth";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;

    // Revoke only the current session.
    if (token) {
      const tokenHash = hashSessionToken(token);

      await pool.query(
        `DELETE FROM sessions
         WHERE token_hash = $1`,
        [tokenHash],
      );
    }

    // Clear the browser cookie.
    const response = NextResponse.json({
      message: "Logged out successfully.",
    });

    response.cookies.set("auth_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout failed:", error.message);

    return NextResponse.json(
      { message: "Unable to log out. Please try again." },
      { status: 500 },
    );
  }
}
