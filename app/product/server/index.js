const path = require('path');
const express = require('express');
const app = express();

app.get('/product.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/product.js'));
});

app.get('/assets/:image', (req, res) => {
  var image = req.params.image;
  res.sendFile(path.resolve(__dirname, 'assets/' + image));
});

app.listen(3011, () => console.log('product app listening on port 3011'));
