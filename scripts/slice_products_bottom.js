const fs = require('fs');
const sharp = require('sharp');

let svg = fs.readFileSync('public/Transact INTL Products Page.svg', 'utf8');

// Clean base64 for fast rendering of footer
const cleaned = svg.replace(/xlink:href="data:image\/[^;]+;base64,[^"]+"/g, 'xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="');

sharp(Buffer.from(cleaned))
  .extract({ left: 0, top: 1800, width: 1952, height: 2200 })
  .resize(1200)
  .png()
  .toFile('public/images/products_slice_bottom.png')
  .then(() => console.log('Rendered products_slice_bottom.png'))
  .catch(e => console.error('Cleaned render error:', e.message));
