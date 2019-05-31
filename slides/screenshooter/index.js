const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const util = require('util');
const puppeteer = require('puppeteer');
const { format } = require('date-fns');
const easyPdfMerge = require('easy-pdf-merge');

const mkdir = util.promisify(fs.mkdir);

async function start({ target }) {
  const tmpDir = path.resolve(__dirname, 'tmp');
  if (!fs.existsSync(tmpDir)) {
    await mkdir(tmpDir);
  }

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('http://localhost:8888', { waitUntil: 'domcontentloaded' });

  const files = await visit(page);

  await new Promise((resolve, reject) => {
    easyPdfMerge(files, target, error => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });

  browser.close();
  rimraf.sync(tmpDir);
}

async function visit(page) {
  const url = page.url();
  console.log('>>> shooting', await page.title(), url);

  const file = await shoot(page);

  const nextUrl = url.replace(/\/(\d+)?$/, (a, b) => `/${Number(b || 0) + 1}`);

  const nextPageResponse = await page.goto(nextUrl);
  if (nextPageResponse.status() !== 200) {
    return [];
  }

  await page.waitForSelector('#top');

  const moreFiles = await visit(page);
  return [file, ...moreFiles];
}

async function shoot(page) {
  const timestamp = format(new Date(), 'YYYY-MM-dd-HH.mm.ss');
  const filename = `${getSlideNumberFromPage(page)}_${timestamp}.pdf`;
  const filepath = path.resolve(__dirname, 'tmp', filename);

  // ensure loaded page before doing a screenshot
  await page.reload({
    waitUntil: 'networkidle0',
  });

  // click through to create a screenshot of the finished slide
  const elementsToAppear = await page.$$('[data-appear="next"]');
  for (let i = 0; i < elementsToAppear.length; i++) {
    await page.keyboard.press('ArrowRight');
  }

  await page.pdf({
    path: filepath,
    printBackground: true,
    width: '1920px',
    height: '1080px',
  });

  return filepath;
}

function getSlideNumberFromPage(page) {
  const slideNumberMatch = page.url().match(/\d+$/);
  return slideNumberMatch ? Number(slideNumberMatch[0]) : 0;
}

const targetPdf = path.resolve(__dirname, '../slides.pdf');

start({ target: targetPdf }).then(
  () => {
    console.log('\nsuccessfully generated %s\n', targetPdf);
    process.exit(0);
  },
  error => {
    console.error('\n🙀 failed to generate PDF\n');
    console.error(error.message || error);
    process.exit(1);
  }
);
