const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function run() {
  const svgPath = path.join(__dirname, "../public/Transact INTL Products Page.svg");
  const svg = fs.readFileSync(svgPath, "utf8");

  const slicedSvg = svg.replace(/viewBox="[^"]+"/, `viewBox="0 2800 1952 400"`)
    .replace(/width="[^"]+"/, `width="1952"`)
    .replace(/height="[^"]+"/, `height="400"`);
  
  const outPath = path.join(__dirname, `../public/extracted_products/footer_copyright.png`);
  await sharp(Buffer.from(slicedSvg), { limitInputPixels: false })
    .resize(1400)
    .png()
    .toFile(outPath);
  console.log("Saved footer_copyright.png");
}

run();
