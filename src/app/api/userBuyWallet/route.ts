import { NextRequest, NextResponse } from "next/server";
import { db } from "../../lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet_address = searchParams.get("wallet_address");
    const referral = searchParams.get("referral");

    if (!wallet_address) {
      return NextResponse.json({ error: "Wallet Address is required" }, { status: 400 });
    }

    // Try fetching existing user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [existingRows]: any = await db.query(
      "SELECT users.*, COALESCE(SUM(alpha_miners.coin_amount), 0) AS total_coins FROM users LEFT JOIN alpha_miners ON users.id = alpha_miners.users_id WHERE users.wallet_address = ?",
      [wallet_address]
    );
    const user = existingRows[0];

    if (!user) {
      // New user, insert depending on referral logic
      if (referral && referral !== '0x0000000000000000000000000000000000000000') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [refRows]: any = await db.query("SELECT is_quest_completed FROM users WHERE wallet_address = ?", [referral]);
        if (refRows.length > 0 && refRows[0].is_quest_completed === 1) {
          await db.query(
            "INSERT IGNORE INTO users (wallet_address, referred_by) VALUES (?, ?)",
            [wallet_address, referral]
          );
        } else {
          await db.query("INSERT IGNORE INTO users (wallet_address) VALUES (?)", [wallet_address]);
        }
      } else {
        await db.query("INSERT IGNORE INTO users (wallet_address) VALUES (?)", [wallet_address]);
      }

      // Fetch the newly inserted user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [newUserRows]: any = await db.query(
        "SELECT users.*, COALESCE(SUM(alpha_miners.coin_amount), 0) AS total_coins FROM users LEFT JOIN alpha_miners ON users.id = alpha_miners.users_id WHERE users.wallet_address = ?",
        [wallet_address]
      );
      const newUser = newUserRows[0];

      return NextResponse.json({
        users_id: newUser.id!,
        username: newUser.username!,
        points: newUser.points!,
        x_joined: newUser.x_joined!,
        has_shared: newUser.has_shared!,
        telegram_joined: newUser.telegram_joined!,
        is_quest_completed: newUser.is_quest_completed!,
        quest_completed: newUser.quest_completed!,
        referrals: newUser.referrals_count!,
        alpha_coins: newUser.total_coins!,
      });
    } else {
      // User already exists
      return NextResponse.json({
        users_id: user.id!,
        username: user.username!,
        points: user.points!,
        x_joined: user.x_joined!,
        has_shared: user.has_shared!,
        telegram_joined: user.telegram_joined!,
        is_quest_completed: user.is_quest_completed!,
        quest_completed: user.quest_completed!,
        referrals: user.referrals_count!,
        alpha_coins: user.total_coins!,
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("User API error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
