import { Telegraf } from 'telegraf';
import  { db }  from "../../lib/db";


// ✅ Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start(async (ctx) => {
  
  const userId = ctx.from.id;
  const username = ctx.from.username || '';  
  const member = await ctx.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID!, userId);

if (
    member.status === 'member' ||
    member.status === 'creator' ||
    member.status === 'administrator'
  ) {
   // ctx.reply('✅ You have already joined the group. Thanks!');
      try {
            await db.query(
            `INSERT INTO users (user_id, username, telegram_joined)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE username = ?`,
            [userId, username, 1,username]
            );

            ctx.reply(`👋 Hello ${username}! You've been registered successfully.`);


        } catch (err) {
            console.error('DB Insert Error:', err);
            ctx.reply('⚠️ Failed to save your details. Please try again later.');
        }
        
  } else {
    ctx.reply('❌ Please join our Telegram group before proceeding: https://t.me/dyfusion');
  }

  
});

bot.launch();