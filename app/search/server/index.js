const path = require('path');
const express = require('express');
const app = express();

app.get('/search.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/search.js'));
});

app.listen(3010, () => console.log('search app listening on port 3010'));
