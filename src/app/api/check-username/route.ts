import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

export async function POST(req: NextRequest) {

    
  const { username }: { username: string } = await req.json();

  if (!username) {
    return NextResponse.json({ error: "Username missing!" }, { status: 400 });
  }

  try {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const  [rows]: any = await db.query("SELECT user_id FROM telegram_ids WHERE username = ?", [username]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((rows as any[]).length > 0) {
        //console.log(existing);
        const user = rows[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const  [exist]: any = await db.query("SELECT id FROM users WHERE user_id = ?", [user.user_id]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if((exist as any[]).length > 0){
            return NextResponse.json({ error: "Username already submitted" }, { status: 409 });
        }

        return NextResponse.json( { user_id :user.user_id }, { status: 200 } );
    }else{
      return NextResponse.json({ error: "Username not found" }, { status: 409 });
    }

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: "Failed to fetch user id" }, { status: 500 });
  }
}
