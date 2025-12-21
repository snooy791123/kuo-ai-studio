// /api/ig.js
export default async function handler(req, res) {
  // 1. 處理 Meta Webhook 驗證 (僅在設定 Webhook 時需要)
  if (req.method === 'GET' && req.query['hub.verify_token']) {
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
      return res.status(200).send(req.query['hub.challenge']);
    }
    return res.status(403).send('Verification failed');
  }

  // 2. 抓取 Instagram 資料
  const token = process.env.IG_ACCESS_TOKEN;
  const { url } = req.query;

  // 如果有帶入分頁網址，直接使用分頁網址；否則抓取第一頁
  const apiUrl = url ? decodeURIComponent(url) : `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption&limit=50&access_token=${token}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // 設定快取控制，減少 API 呼叫次數 (選做)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
