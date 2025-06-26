// /pages/api/telegram.ts

import { Telegraf } from 'telegraf';
import type { NextApiRequest, NextApiResponse } from 'next';

// Your bot token (store in .env.local as BOT_TOKEN)
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Handle /start command
bot.start(async (ctx) => {
  await ctx.reply("👋 Welcome! You're now connected to the Dyfusion Bot.");
});


// This disables Vercel's default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Webhook handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Bot error:', error);
      res.status(500).send('Error processing update');
    }
  } else {
    res.status(200).send('This is the Telegram bot endpoint.');
  }
}
