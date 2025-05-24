// src/pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
}
