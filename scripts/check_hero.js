const fs = require('fs');

const svgStr = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

// Find all paths between y=0 and y=700
// We can slice from y=50 to 650 with sharp
const sharp = require('sharp');

async function checkHero() {
  const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAA';
  const cleaned = svgStr.replace(/xlink:href="data:image\/[^"]+"/g, `xlink:href="${tinyPng}"`);
  
  await sharp(Buffer.from(cleaned), { density: 72 })
    .extract({ left: 0, top: 70, width: 1952, height: 600 })
    .png()
    .toFile('public/temp_about_hero_text.png');
    
  console.log('Saved temp_about_hero_text.png');
}

checkHero();
