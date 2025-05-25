// frontend/src/pages/api/chatbot_feedback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.post('http://localhost:8000/chatbot_feedback', req.body);
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
