import { Telegraf } from 'telegraf';
import { NextApiRequest, NextApiResponse } from 'next';

// ✅ Initialize the bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// ✅ What happens when user taps /start
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || '';
  const firstName = ctx.from.first_name || 'there';

  const appUrl = 'https://tweet-to-earn-app.vercel.app'; // change this

  // Optional: Call your own API to store this user
  try {
    await fetch(`${appUrl}/api/save-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, username : username }),
    });
  } catch (err) {
    console.error('Failed to save user:', err);
  }

  // ✅ Reply with verification CTA and referral link
  const referralLink = `${appUrl}/?ref=${userId}`;
  await ctx.reply(`👋 Hi ${firstName} (@${username}), welcome!

🎯 To verify and earn coins:
1. Join our Telegram group
2. Tap the button below

🔗 Your referral link:
${referralLink}
Share this to earn bonus coins!`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Verify Telegram Join', url: `${appUrl}/verify?user_id=${userId}` }],
      ],
    },
  });
});

bot.launch();

export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Vercel-compatible webhook handler
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (err) {
      console.error('Bot error:', err);
      res.status(500).send('Bot failed');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default handler;
