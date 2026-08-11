# Product Page Scraper

A simple product page scraper built with **JavaScript** and **Playwright**.

The scraper extracts product information from the MSI product page and saves it as a JSON file.

## Requirements

* Playwright
* JavaScript
* npm

## Installation

Install the project dependencies:

```bash
npm install
```

Install Playwright Chromium:

```bash
npx playwright install chromium
```

## Run

Run the scraper:

```bash
npm run scrape
```

After running the scraper, the result will be saved to:

```text
output/product.json
```

The file is created automatically and overwritten on each run.

## Extracted Data

The scraper extracts:

* URL
* Product ID
* Title
* Brand
* Product category
* Category tree
* Description
* Price
* Sale price
* Availability
* Main image
* Additional images
* Product specifications
* Star rating
* Review count
* GTIN
* MPN
* Scraping timestamp

## Project Structure

```text
product-page-scraper/
├── src/
│   ├── index.js
│   └── scrape.js
├── output/
│   └── product.json
├── package.json
├── package-lock.json
└── README.md
```

## Technologies

* JavaScript
* Node.js
* Playwright
