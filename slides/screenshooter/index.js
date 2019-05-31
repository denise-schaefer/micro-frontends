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

  // navigation has two links. the first one is for "previous page" the second for "next page"
  // (note that we cannot use the keyboard "ArrowRight" as the integrated terminal on some slides is taking the keyboard focus)
  const navLinks = Array.from(await page.$$('#nav a'));
  const nextLink = navLinks[1];

  if (!nextLink) {
    return file;
  }

  const elementsToAppear = (await page.$$('[data-appear]')) || [];
  const timesToClickForward = elementsToAppear.length;

  // skip elements that should appear next on the same page
  for (let i = 0; i < timesToClickForward; i++) {
    await nextLink.click();
  }

  // navigate to next slide
  await nextLink.click();
  await page.waitForSelector('#top');

  if (url === page.url()) {
    // last link links to the same page
    // so when the url didn't change after click we're finished ٩( ᐛ )و
    return [];
  }

  const moreFiles = await visit(page);
  return [file, ...moreFiles];
}

async function shoot(page) {
  const timestamp = format(new Date(), 'YYYY-MM-dd-HH.mm.ss');
  const filename = `${getSlideNumberFromPage(page)}_${timestamp}.pdf`;
  const filepath = path.resolve(__dirname, 'tmp', filename);

  await page.reload({
    waitUntil: 'networkidle0',
  });

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
