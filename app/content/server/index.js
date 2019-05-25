const path = require('path');
const express = require('express');
const app = express();

app.get('/content.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/content.js'));
});

app.get('/assets/:image', (req, res) => {
  var image = req.params.image;
  res.sendFile(path.resolve(__dirname, 'assets/' + image));
});

app.listen(3012, () => console.log('content app listening on port 3012'));
