const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let count = 0;

app.get('/count', (req, res) => {
  count++;
  res.json({ visits: count });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});