import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT NOW() AS server_time, current_database() AS database_name",
    );

    return NextResponse.json({
      success: true,
      message: "Connected to PostgreSQL!",
      database: result.rows[0].database_name,
      serverTime: result.rows[0].server_time,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    return NextResponse.json(
      { success: false, message: "Database connection failed" },
      { status: 500 },
    );
  }
}
