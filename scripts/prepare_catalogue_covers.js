const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const targetDir = path.join('public', 'images', 'catalogues');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  // Map the 3 extracted images:
  // In the SVG, the order in DOM is image3, image4, image5:
  // Card 1 = image3
  // Card 2 = image4
  // Card 3 = image5

  await sharp('public/extracted_catalogue/image3_4324_1262.jpeg')
    .resize(800)
    .webp({ quality: 90 })
    .toFile(path.join(targetDir, 'laryngoscope-cover.webp'));

  await sharp('public/extracted_catalogue/image4_4324_1262.jpeg')
    .resize(800)
    .webp({ quality: 90 })
    .toFile(path.join(targetDir, 'diagnostics-cover.webp'));

  await sharp('public/extracted_catalogue/image5_4324_1262.jpeg')
    .resize(800)
    .webp({ quality: 90 })
    .toFile(path.join(targetDir, 'company-profile-cover.webp'));

  console.log('Catalogue covers created successfully!');
}

run().catch(console.error);
