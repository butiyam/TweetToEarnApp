import type { NextApiRequest, NextApiResponse } from 'next';
import  { db }  from "../lib/db";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { user_id, username } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  await db.query(
      "INSERT INTO users (user_id, username ) VALUES (?, ?)",
      [user_id, username, ]
    );


  return res.status(200).json({
    ok: true,
    message: 'User saved successfully',
    user: user_id,
  });
}
