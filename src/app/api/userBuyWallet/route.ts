import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

export async function GET(req: NextRequest) {
  try {

     const { searchParams } = new URL(req.url);
     const wallet_address = searchParams.get("wallet_address");
 
    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet Address is required" }, { status: 400 });
    }

    // Get user info
    const [userRows] = await db.query(
      "SELECT * FROM users WHERE wallet_address = ?",
      [wallet_address]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (userRows as any[])[0];

    if (!user) {
      
      await db.query(
        "INSERT INTO users (wallet_address) VALUES (?)",
        [wallet_address]
      );  
    }

    return NextResponse.json({
      
      username: user.username,
      points: user.points,
      x_joined: user.x_joined,
      has_shared: user.has_shared,
      telegram_joined: user.telegram_joined,
      is_quest_completed: user.is_quest_completed,
      quest_completed: user.quest_completed,

    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("User API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

