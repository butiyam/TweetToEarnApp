import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

const X = process.env.X_FOLLOW_COINS;
const TG = process.env.TG_FOLLOW_COINS;
const SHARED = process.env.POST_SHARED_COINS ;

export async function POST(req: NextRequest) {
  try {
    const { type, wallet_address } = await req.json();

    if (!wallet_address ||  !type) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

    if(type === 1)
     await db.query(
        "UPDATE users SET  points = points + ?, x_joined = ? WHERE wallet_address = ?",
        [X, 1 ,wallet_address]
        );

    if(type === 2)
     await db.query(
        "UPDATE users SET  points = points + ?, has_shared = ? WHERE wallet_address = ?",
        [SHARED, 1 ,wallet_address]
        );

    if(type === 3)
     await db.query(
        "UPDATE users SET  points = points + ?, telegram_joined = ? WHERE wallet_address = ?",
        [TG, 1 ,wallet_address]
        );

    return NextResponse.json({ message: 'Coins credited successfully' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
