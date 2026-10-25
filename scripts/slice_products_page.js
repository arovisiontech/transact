const fs = require('fs');
const sharp = require('sharp');

let svg = fs.readFileSync('public/Transact INTL Products Page.svg', 'utf8');

// Replace large base64 with placeholder if needed, or try rendering directly
sharp(Buffer.from(svg))
  .extract({ left: 0, top: 0, width: 1952, height: 1800 })
  .resize(1200)
  .png()
  .toFile('public/images/products_slice_top.png')
  .then(() => console.log('Rendered products_slice_top.png'))
  .catch(err => {
    console.error('Direct render error:', err.message);
    // Replace base64 href with tiny 1x1 png if huge
    const cleaned = svg.replace(/xlink:href="data:image\/[^;]+;base64,[^"]+"/g, 'xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="');
    sharp(Buffer.from(cleaned))
      .extract({ left: 0, top: 0, width: 1952, height: 1800 })
      .resize(1200)
      .png()
      .toFile('public/images/products_slice_top.png')
      .then(() => console.log('Rendered cleaned products_slice_top.png'))
      .catch(e => console.error('Cleaned render error:', e.message));
  });
