/* eslint-disable no-console */
const http = require('http');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const port = 3000;
const htmlFilePath = path.resolve(__dirname, 'index.html');
const currentSlideImageFilename = 'current-slide-preview.png';
const nextSlideImageFilename = 'next-slide-preview.png';

const server = http.createServer((request, response) => {
  if (request.method === 'GET') {
    try {
      if (request.url === '/') {
        console.log('serve index.html');
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(fs.readFileSync(htmlFilePath, 'utf8'));
      } else if (request.url === `/${currentSlideImageFilename}`) {
        response.writeHead(200, { 'Content-Type': 'image/png' });
        response.end(fs.readFileSync(path.resolve(__dirname, currentSlideImageFilename)), 'binary');
      } else if (request.url === `/${nextSlideImageFilename}`) {
        console.log('serve next-slide image');
        response.writeHead(200, { 'Content-Type': 'image/png' });
        response.end(fs.readFileSync(path.resolve(__dirname, nextSlideImageFilename)), 'binary');
      } else {
        response.writeHead(404);
        response.end();
      }
    } catch (error) {
      console.log('error:', error.message);
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Es gibt bisher keine Notizen.\nPräsentation schon gestartet?');
    }
  }
  if (request.method === 'POST') {
    console.log('got POST to update index.html from referer "%s"', request.headers.referer);
    let body = [];
    request
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', async () => {
        body = JSON.parse(Buffer.concat(body).toString());
        await writeHTML(body);
        console.log('👍   updated index.html');
        response.end();
      });
  }
});

server.listen(port, err => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});

async function writeHTML(content) {
  await Promise.all([
    doScreenshot(content.currentSlideUrl, currentSlideImageFilename),
    doScreenshot(content.nextSlideUrl, nextSlideImageFilename),
  ]);
  fs.writeFileSync(
    htmlFilePath,
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Slide Notes</title>
        <style>
          html,
          body {
            margin: 0;
            padding: 0;
            height: 100%;
          }
        </style>
      </head>
      <body style="display: flex; flex-direction: row; flex-wrap: wrap;">
        <div style="flex: 1; padding: 1em;">
          ${content.html}
        </div>
        <div
          style="flex: 1; border-left: 5px solid black; position: relative; padding: 1em; display: flex; flex-direction: column; background-color: rgba(0,0,0,0.2);"
        >
        <div style="display: flex; flex-direction: column">
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center">
          <h1 style="text-align: center">currrent slide</h1>
          <img src="/${currentSlideImageFilename}" style="width: auto; height: 40vh;" />
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center">
            <h1 style="text-align: center">next slide</h1>
            <img src="/${nextSlideImageFilename}" style="width: auto; height: 40vh;" />
          </div>
        </div>
        <script>
          // wait till everything is loaded, then start counter to reload
          window.addEventListener('load', () => {
            setTimeout(() => window.location.reload(), 200);
          })
        </script>
      </body>
    </html>

    `,
    'utf8'
  );
}

async function doScreenshot(url, filename) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.goto(url);
  await page.screenshot({ path: filename });
  await browser.close();
}
