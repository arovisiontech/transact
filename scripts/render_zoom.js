const fs = require('fs');
const sharp = require('sharp');

async function renderTimeline() {
  const svgStr = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');
  const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAA';
  const cleaned = svgStr.replace(/xlink:href="data:image\/[^"]+"/g, `xlink:href="${tinyPng}"`);

  await sharp(Buffer.from(cleaned), { density: 100 })
    .extract({ left: 100, top: 3200, width: 1750, height: 900 })
    .png()
    .toFile('public/temp_timeline_actual_view.png');

  console.log('Saved temp_timeline_actual_view.png');
}

renderTimeline();
