import { Telegraf } from 'telegraf';

// ✅ Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start((ctx) => ctx.reply("Hello from Telegraf!"));

bot.launch();