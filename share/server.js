// Expressの場合の例
app.get('/share', (req, res) => {
  // URLクエリ（?text=...）からテキストを取得
  const customText = req.query.text || 'これはペンです。This is a pen.';

  // XSS対策の簡易エスケープ
  const safeText = String(customText)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  // リダイレクト先のトップページURL（実際のGitHub PagesのURLに合わせて変更してください）
  const targetUrl = 'https://mc7uas.github.io/site/';

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>ううう</title>

  <!-- LINE等でカードに表示される動的OGPタグ -->
  <meta property="og:title" content="ううう">
  <meta property="og:description" content="${safeText}">
  <meta property="og:type" content="website">

  <!-- アクセスした人はトップページへリダイレクト -->
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
