const express = require('express');
const cors = require('cors');
const { Redis } = require('@upstash/redis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Renderの環境変数からUpstashへ自動接続
const redis = Redis.fromEnv();

// --- 1. アクセスカウンター API ---
app.get('/count', async (req, res) => {
  try {
    const count = await redis.incr('visits');
    res.json({ visits: count });
  } catch (error) {
    console.error('Redis Error:', error);
    res.status(500).json({ error: 'カウントの更新に失敗しました' });
  }
});

// --- 2. カスタムOGP共有用 API (タイトル・説明文の動的化) ---
app.get('/share', (req, res) => {
  const customTitle = req.query.title || 'ううう';
  const customText = req.query.text || 'これはペンです。This is a pen.';

  // XSS対策のエスケープ処理
  const escapeHtml = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const safeTitle = escapeHtml(customTitle);
  const safeText = escapeHtml(customText);

  // リダイレクト先トップページ
  const targetUrl = 'https://mc7uas.github.io/site/';
  
  // OGP用の自分自身のURL
  const currentUrl = `https://site-vjjv.onrender.com/share?title=${encodeURIComponent(customTitle)}&text=${encodeURIComponent(customText)}`;

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>

  <!-- LINE等でカード表示させるための動的OGP設定 -->
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeText}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${currentUrl}">

  <!-- アクセスしてきた人は即座にトップページへ転送 -->
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
</head>
<body>
  <p>リダイレクト中...</p>
  <script>
    window.location.href = "${targetUrl}";
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
