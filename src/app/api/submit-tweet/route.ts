import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";
import { error } from "console";

export async function POST(req: NextRequest) {
  try {
    const { tweetId, username, text, hashtags } = await req.json();

    if (!tweetId || !username || !text || !Array.isArray(hashtags)) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    const [existing] = await db.query("SELECT id FROM tweets WHERE tweet_id = ?", [tweetId]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: "Tweet already submitted" }, { status: 409 });
    }

    await db.query(
      "INSERT INTO tweets (tweet_id, username, text, hashtags) VALUES (?, ?, ?, ?)",
      [tweetId, username, text, hashtags.join(",")]
    );

    await db.query(
      `INSERT INTO users (username, points)
       VALUES (?, 10)
       ON DUPLICATE KEY UPDATE points = points + 10`,
      [username]
    );

    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
