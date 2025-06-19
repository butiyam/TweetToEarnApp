import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

export async function GET(req: NextRequest) {
  try {

     const { searchParams } = new URL(req.url);
     const username = searchParams.get("username");
 
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Get user info
    const [userRows] = await db.query(
      "SELECT id, points FROM users WHERE username = ?",
      [username]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (userRows as any[])[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's tweets
    const [tweetRows] = await db.query(
      "SELECT tweet_id, text, hashtags FROM tweets WHERE username = ? ORDER BY id DESC",
      [username]
    );

    return NextResponse.json({
      username,
      points: user.points,
      tweets: tweetRows,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("User API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

