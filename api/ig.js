// /api/ig.js
export default async function handler(req, res) {
  // --- 新增：處理 Meta Webhook 驗證邏輯 ---
  if (req.method === 'GET' && req.query['hub.verify_token']) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // 檢查這裡的 token 是否等於你在 Vercel 設定的 VERIFY_TOKEN
    if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).json({ error: 'Verification failed' });
    }
  }

  // --- 原有的抓取 IG 資料邏輯 ---
  const token = process.env.IG_ACCESS_TOKEN;
  const { url } = req.query;
  const apiUrl = url ? decodeURIComponent(url) : `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption&limit=50&access_token=${token}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
