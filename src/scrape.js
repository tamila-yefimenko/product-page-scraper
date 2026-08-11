const URL =
  'https://us-store.msi.com/Motherboards/Intel-Platform-Motherboard/INTEL-Z890/MAG-Z890-TOMAHAWK-WIFI';

export async function scrapeProduct(page) {
  await page.goto(URL, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });

  const scripts = await page.locator('script').allTextContents();

  let itemId = null;

  for (const script of scripts) { 
    const match = script.match( /product\/product\/calculatePrice&product_id=(\d+)/ ); 
    if (match) { 
        itemId = match[1]; 
        break; 
    } 
}

  const title =
  (await page.locator('h2.title').first().textContent())?.trim() ?? null;

  const brand = await page.locator(
    'img[alt="MSI-US Official Store"]'
  ).count() > 0 ? 'MSI' : null;

  const breadcrumbs = await page.locator(
    'ol.breadcrumb .breadcrumb-item'
    ).evaluateAll(items =>
      items.slice(1, -1).map(item => ({
        name: item.textContent.trim(),
        url: item.querySelector('a')?.href ?? null,
   }))
  );

  const productCategory = breadcrumbs
    .map(item => item.name)
    .join(' > ');

  const description =
  (
    await page
      .locator('h2.title')
      .first()
      .locator('xpath=following-sibling::div[1]//p')
      .textContent()
  )?.trim() ?? null;

  const priceText = await page.locator('#prices-new').textContent();
  const oldPriceLocator = page.locator('#prices-old');
  const hasOldPrice = await oldPriceLocator.count() > 0;

  const price = hasOldPrice
  ? parseFloat((await oldPriceLocator.textContent()).replace(/[$,]/g, ''))
  : parseFloat(priceText.replace(/[$,]/g, ''));

  const sale_price = hasOldPrice
  ? parseFloat(priceText.replace(/[$,]/g, ''))
  : null;

  const priceBlockText = await page
  .locator('#prices-wrapper')
  .innerText();

  let availability = null;

  if (priceBlockText.includes('In Stock')) {
    availability = 'in_stock';
  } else if (priceBlockText.includes('Out of Stock')) {
    availability = 'out_of_stock';
  } else if (priceBlockText.includes('Pre-Order')) {
    availability = 'pre_order';
  }

  const imageUrl = await page
    .locator('#imagePopup')
    .getAttribute('src');

  const additionalImageUrls = await page
    .locator('img.product-detail-thumb-bto')
    .evaluateAll(images =>
      [...new Set(
        images
          .map(img => img.getAttribute('popup_img'))
          .filter(Boolean)
      )]
    );
    
  const specs = await page
    .locator('table.table.table-borderless tr')
    .evaluateAll(rows =>
      rows.map(row => ({
        name: row.querySelector('th')?.textContent.trim() ?? '',
        value: row.querySelector('td')?.innerText.trim() ?? null,
    }))
    );

  const ratingText = await page
  .locator('#average-rating-info')
  .first()
  .textContent();

  const match = ratingText?.match(/([\d.]+)\s*\((\d+)\)/);

  const starRating = match ? parseFloat(match[1]) : null;
  const reviewCount = match ? parseInt(match[2], 10) : null;


  return {
    url: page.url(),
    item_id: itemId,
    title,
    brand,
    product_category: productCategory,
    category_tree: breadcrumbs,
    description,
    price,
    sale_price,
    availability,
    image_url: imageUrl,
    additional_image_urls: additionalImageUrls,
    specs,
    star_rating: starRating,
    review_count: reviewCount,
    gtin: null,
    mpn: null,
    scraped_at: new Date().toISOString(),
  };
}