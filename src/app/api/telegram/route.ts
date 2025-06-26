import { Telegraf } from 'telegraf';
import  { db }  from "../../lib/db";


// ✅ Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start(async (ctx) => {
  
  const userId = ctx.from.id;
  const username = ctx.from.username || '';  
  const firstname = ctx.from.first_name || '';
  const member = await ctx.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID!, userId);

if (
    member.status === 'member' ||
    member.status === 'creator' ||
    member.status === 'administrator'
  ) {
   // ctx.reply('✅ You have already joined the group. Thanks!');
      try {
            await db.query(
            `INSERT INTO users (user_id, username)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE username = ?`,
            [userId, username, username]
            );

            ctx.reply(`👋 Hello ${firstname}! Please join our group to continue: https://t.me/dyfusion`);

        } catch (err) {
            console.error('DB Insert Error:', err);
            ctx.reply('⚠️ Failed to save your details. Please try again later.');
        }
        
  } else {
    ctx.reply('❌ Please join our Telegram group before proceeding: https://t.me/dyfusion');
  }

  
});

// Command to verify group membership
bot.command('verify', async (ctx) => {
  const userId = ctx.from?.id;

  try {
    const res = await ctx.telegram.getChatMember(process.env.TELEGRAM_GROUP_ID!, userId);

    if (['creator', 'administrator', 'member'].includes(res.status)) {
      ctx.reply('✅ You have joined the group!');

      await db.query(
        'UPDATE users SET telegram_joined = ? WHERE user_id = ?',
        [1, userId]
      );
    } else {
      ctx.reply('❌ You haven’t joined the group yet.');
    }

  } catch (err) {
    console.error(err);
    ctx.reply('⚠️ Could not verify. Maybe you haven’t joined or the bot is not admin.');
  }
});

bot.launch();