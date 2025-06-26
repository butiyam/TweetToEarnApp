import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const { user_id } = req.body;

  if (!user_id || !TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: TELEGRAM_GROUP_ID,
          user_id: user_id,
        },
      }
    );

    const status = response.data?.result?.status;

    return res.status(200).json({
      ok: true,
      isMember: status === 'member' || status === 'administrator' || status === 'creator',
      status,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error.response?.data || error.message,
    });
  }
}
