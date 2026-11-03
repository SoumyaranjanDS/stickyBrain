import { initDB } from "@/lib/init-db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    await initDB();

    return NextResponse.json({
      success: true,
      message: "Users table created successfully",
    });
  } catch (error) {
    console.error("Failed to create user table:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create user table",
      },
      { status: 500 },
    );
  }
}
