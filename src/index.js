import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { scrapeProduct } from './scrape.js';

const browser = await chromium.launch({
  headless: true,
});

try {
  const page = await browser.newPage();

  const product = await scrapeProduct(page);

  await mkdir('./output', { recursive: true });

  await writeFile(
    './output/product.json',
    JSON.stringify(product, null, 2),
    'utf-8'
  );

  console.log('Product saved to output/product.json');

  await page.waitForTimeout(10000);
} catch (error) {
  console.error('Scraping failed:', error);
  process.exitCode = 1;
} finally {
  await browser.close();
}