const express = require('express');
const cors = require('cors');
const { Redis } = require('@upstash/redis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Renderの環境変数からUpstashへ自動接続
const redis = Redis.fromEnv();

app.get('/count', async (req, res) => {
  try {
    // Redis内で 'visits' というキーの数字を 1 増やす（無ければ1で自動作成）
    const count = await redis.incr('visits');
    res.json({ visits: count });
  } catch (error) {
    console.error('Redis Error:', error);
    res.status(500).json({ error: 'カウントの更新に失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
