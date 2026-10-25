const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function run() {
  const svgPath = path.join(__dirname, "../public/Transact INTL Products Page.svg");
  const svg = fs.readFileSync(svgPath, "utf8");

  const slicedSvg = svg.replace(/viewBox="[^"]+"/, `viewBox="0 2200 1952 700"`)
    .replace(/width="[^"]+"/, `width="1952"`)
    .replace(/height="[^"]+"/, `height="700"`);
  
  const outPath = path.join(__dirname, `../public/extracted_products/footer_exact.png`);
  await sharp(Buffer.from(slicedSvg), { limitInputPixels: false })
    .resize(1400)
    .png()
    .toFile(outPath);
  console.log("Saved footer_exact.png");
}

run();
