const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルをサーブする
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
