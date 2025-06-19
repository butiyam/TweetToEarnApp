import { db } from "../../lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT username, points FROM users ORDER BY points DESC LIMIT 100");
    return NextResponse.json(rows);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Leaderboard error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
