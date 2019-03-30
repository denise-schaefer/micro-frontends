const path = require('path');
const express = require('express');
const app = express();

app.get('/', (_, res) => {
  const html = render();
  res.send(html);
});

app.get('/composer.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/composer.js'));
});

app.listen(8080, () => console.log('app listening on http://localhost:8080'));

function render() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ui composing</title>
</head>
<body>

<div id="root"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.8.5/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.5/umd/react-dom.production.min.js"></script>

<script src="http://localhost:3010/search.js"></script>
<script src="http://localhost:3011/product.js"></script>

<script>
    window.myNamespace.search.default.render('#root', {});
</script>

</body>
</html>`;
}
