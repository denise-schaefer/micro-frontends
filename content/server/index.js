const path = require('path');
const express = require('express');
const app = express();

app.get('/content.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/content.js'));
});

app.listen(3012, () => console.log('product app listening on port 3012'));
