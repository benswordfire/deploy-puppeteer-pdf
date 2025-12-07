import 'dotenv/config';
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/pdf', async(req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(`<h1>hello, world</h1>`);

    const pdfBuffer = await page.pdf();

    await browser.close();

    res.set({ 'Content-Type': 'application/pdf' });

    res.send(pdfBuffer);

  } catch (err) {
    console.error('Failed to generate PDF', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to generate PDF'
    })
  }
});

app.listen(PORT, 
  () => console.log(`app is listening on port: ${PORT}`)
);