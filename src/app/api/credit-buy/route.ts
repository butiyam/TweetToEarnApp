import { NextRequest, NextResponse } from "next/server";
import  { db }  from "../../lib/db";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiKey = 'GBDNNIHACP5YDQ8DPZTZRMI1HFNSZZG2XH';

export async function POST(req: NextRequest) {
    
  try {
    const { users_id, coin_amount, txn_hash, wallet_address } = await req.json();

    if (!users_id || !wallet_address ||  !coin_amount || !txn_hash) {
      return NextResponse.json({ error: "Missing input" }, { status: 400 });
    }

  /*        const url : string = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txn_hash}&apikey=${apiKey}`;
            const request = await fetch(url);
            const res =  await request.json();
        return NextResponse.json({ message: res.result.from });
*/

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const  [exist]: any = await db.query("SELECT txn_hash FROM alpha_miners WHERE txn_hash = ?", [txn_hash]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if((exist as any[]).length === 0){
                await db.query(
                "INSERT INTO alpha_miners (users_id, txn_hash, coin_amount) VALUES (?, ?, ?)",
                [users_id, txn_hash, coin_amount, wallet_address]);
            }

    return NextResponse.json({ message: 'Coins credited successfully' });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
