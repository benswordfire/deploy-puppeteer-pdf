import 'dotenv/config';
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

let browser;
let page;

(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  page = await browser.newPage();
})();

app.get('/pdf', async(req, res) => {
  try {
    await page.setContent(`<h1>hello, world</h1>`);

    const pdfBuffer = await page.pdf();

    res.set({ 
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="hello.pdf"'
    });
    res.send(pdfBuffer);

    await page.evaluate(() => document.body.innerHTML = '');

  } catch (err) {
    console.error('Failed to generate PDF', err);
    res.status(500).json({
      success: false,
      msg: 'Failed to generate PDF'
    })
  }
});

app.listen(PORT, 
  () => console.log(`app is listening on port: ${PORT}`)
);