import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url' });
  }

  try {
    // إرسال الطلب عبر بروكسي عام مباشر يتجاوز حظر المطور
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: req.method,
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
