const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function run() {
  const svgPath = path.join(__dirname, "../public/Transact INTL Products Page.svg");
  const svg = fs.readFileSync(svgPath, "utf8");

  // Total height: 5985, width: 1952.
  // Let's render 4 vertical sections:
  // section 1: y = 0 to 1500 (Hero, Breadcrumbs, Category title, Top filters, Product grid top)
  // section 2: y = 1400 to 2900 (Filters, Products list, Trusted worldwide promo card)
  // section 3: y = 2800 to 4400 (Pagination / next section if any)
  // section 4: y = 4300 to 5985 (Footer / bottom sections)

  const sections = [
    { name: "products_slice_1_hero_catalog.png", y: 0, h: 1500 },
    { name: "products_slice_2_mid.png", y: 1400, h: 1500 },
    { name: "products_slice_3_lower.png", y: 2800, h: 1500 },
    { name: "products_slice_4_footer.png", y: 4300, h: 1685 }
  ];

  for (const sec of sections) {
    const slicedSvg = svg.replace(/viewBox="[^"]+"/, `viewBox="0 ${sec.y} 1952 ${sec.h}"`)
      .replace(/width="[^"]+"/, `width="1952"`)
      .replace(/height="[^"]+"/, `height="${sec.h}"`);
    
    const outPath = path.join(__dirname, `../public/extracted_products/${sec.name}`);
    console.log(`Rendering ${sec.name}...`);
    try {
      await sharp(Buffer.from(slicedSvg), { limitInputPixels: false })
        .resize(1400) // comfortable size for viewing
        .png()
        .toFile(outPath);
      console.log(`Saved ${sec.name}`);
    } catch (e) {
      console.error(`Error rendering ${sec.name}:`, e.message);
    }
  }
}

run();
