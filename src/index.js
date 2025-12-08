import 'dotenv/config';
import express from 'express';
import puppeteer, { executablePath } from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const app = express();
const PORT = process.env.PORT || 3000;

chromium.setGraphicsMode = false;

app.get('/pdf', async(req, res) => {
  let browser = null;

  try {
    const isProduction = process.env.NODE_ENV === 'production';

    const browserOptions = {
      args: chromium.args,
      executablePath: isProduction
      ? await chromium.executablePath()
      : process.platform === 'linux'
        ? '/usr/bin/google-chrome'
        : undefined,
      headless: chromium.headless
    };

    if (!isProduction) {
      browserOptions.args = [
        ...browserOptions.args,
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ];
    }

    browser = await puppeteer.launch(browserOptions);

    const page = await browser.newPage();

    await page.setContent(`<h1>hello, world</h1>`);

    const pdfBuffer = await page.pdf();

    res.set({ 'Content-Type': 'application/pdf' });
    res.send(pdfBuffer);

  } catch (err) {
    console.error('Failed to generate PDF', err);
    res.status(500).json({
      success: false,
      msg: 'Failed to generate PDF'
    })
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, 
  () => console.log(`app is listening on port: ${PORT}`)
);