import { Telegraf } from 'telegraf';
import  { db }  from "../../lib/db";


// ✅ Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start(async (ctx) => {
  
  const userId = ctx.from.id;
  const username = ctx.from.username || '';

   try {
    await db.query(
      `INSERT INTO users (user_id, username)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE username = ?`,
      [userId, username, username]
    );

    ctx.reply(`👋 Hello ${username}! You've been registered successfully.`);
  } catch (err) {
    console.error('DB Insert Error:', err);
    ctx.reply('⚠️ Failed to save your details. Please try again later.');
  }
});

bot.launch();