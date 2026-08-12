import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { scrapeProduct } from './scrape.js';

const browser = await chromium.launch({
  headless: true,
  channel: 'chrome',
});

try {
  const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36',
  viewport: {
    width: 1728,
    height: 1117,
  },
  locale: 'en-US',
});

const product = await scrapeProduct(page);

  await mkdir('./output', { recursive: true });

  await writeFile(
    './output/product.json',
    JSON.stringify(product, null, 2),
    'utf-8'
  );

console.log('Product saved to output/product.json');

await page.setExtraHTTPHeaders({
  'Accept-Language': 'en-US,en;q=0.9',})
} catch (error) {
  console.error('Scraping failed:', error);
  process.exitCode = 1;
} finally {
  await browser.close();
}