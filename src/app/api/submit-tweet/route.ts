import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

const COINS = process.env.POST_COINS;

export async function POST(req: NextRequest) {
  try {
    const { tweetId, username, text, hashtags, wallet_address } = await req.json();

    if (!tweetId || !username || !text || !Array.isArray(hashtags)) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    const [existing] = await db.query("SELECT id FROM tweets WHERE tweet_id = ?", [tweetId]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((existing as any[]).length > 0) {
      return NextResponse.json({ error: "Tweet already submitted" }, { status: 409 });
    }

    const [existingText] = await db.query("SELECT id FROM tweets WHERE text = ?", [text]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((existingText as any[]).length > 0) {
      return NextResponse.json({ error: "Tweet with same text content already submitted" }, { status: 409 });
    }


    await db.query(
      "INSERT INTO tweets (tweet_id, username, text, hashtags) VALUES (?, ?, ?, ?)",
      [tweetId, username, text, hashtags.join(",")]
    );

    const [existingUser] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((existingUser as any[]).length > 0) {
              await db.query(
                "UPDATE users SET points = points + ? WHERE wallet_address = ?",
                [COINS, wallet_address]
                );

    //  return NextResponse.json({ error: "Username already exist" }, { status: 409 });
    }else{

          await db.query(
                  "UPDATE users SET username = ?, points = points + ? WHERE wallet_address = ?",
                  [username, COINS, wallet_address]
                  );
    }
    return NextResponse.json({ message: "Tweet validated successfully" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
