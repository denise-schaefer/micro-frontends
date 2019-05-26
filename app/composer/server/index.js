const path = require('path');
const favicon = require('serve-favicon');
const express = require('express');

const app = express();

app.get('/', (_, res) => {
  const html = render();
  res.send(html);
});

app.get('/composer.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/composer.js'));
});

app.get('/css/:file', (req, res) => {
  var { file } = req.params;
  res.sendFile(path.resolve(__dirname, 'css/' + file));
});

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.listen(8080, () => console.log('app listening on http://localhost:8080'));

function render() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ui composing</title>
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
    <link rel="stylesheet" href="/css/bootstrap.min.css" />
</head>
<body>

<div id="root"></div>

<script src="/composer.js"></script>
<script src="http://localhost:3010/search.js"></script>
<script src="http://localhost:3011/product.js"></script>
<script src="http://localhost:3012/content.js"></script>

<script>
    window.SearchLibrary.SearchContainer.render('#root', {});
</script>

</body>
</html>`;
}
