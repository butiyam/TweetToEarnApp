import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

export async function POST(req: NextRequest) {
  try {
    const { wallet_address } = await req.json();

    if (!wallet_address) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

   // const coins = await db.query("SELECT points FROM users WHERE wallet_address = ?", [wallet_address]); 
     await db.query(
        "UPDATE users SET  points = points + ?, x_joined = ? WHERE wallet_address = ?",
        [100000, 1 ,wallet_address]
        );

    return NextResponse.json({ message: '100000' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
