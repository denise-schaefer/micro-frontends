const path = require('path');
const express = require('express');
const app = express();

app.get('/product.js', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../dist/product.js'))
});

app.listen(3011, () => console.log('product app listening on port 3011'));
