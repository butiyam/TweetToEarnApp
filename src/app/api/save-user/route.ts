import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

export async function POST(req: NextRequest) {

  const { user_id, username } = await req.json();

  if (!user_id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  await db.query(
      "INSERT INTO users (user_id, username ) VALUES (?, ?)",
      [user_id, username, ]
    );


  return NextResponse.json({
    ok: true,
    message: 'User saved successfully',
    user: user_id,
  },
    {
        status: 200
    }
  );
}
