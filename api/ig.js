// /api/ig.js
export default async function handler(req, res) {
  const token = process.env.IG_ACCESS_TOKEN; // Token 保存在 Vercel 環境變數
  const { url } = req.query;

  // 決定請求網址：是第一頁還是下一頁
  const apiUrl = url ? decodeURIComponent(url) : `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption&limit=50&access_token=${token}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}