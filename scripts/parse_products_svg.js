const fs = require("fs");
const path = require("path");

const svgPath = path.join(__dirname, "../public/Transact INTL Products Page.svg");
const svg = fs.readFileSync(svgPath, "utf8");

// Extract embedded images
const outDir = path.join(__dirname, "../public/extracted_products");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const imgMatches = [...svg.matchAll(/<image[^>]+id="([^"]+)"[^>]+xlink:href="data:image\/([a-zA-Z]+);base64,([^"]+)"/g)];
console.log("Found images:", imgMatches.length);

imgMatches.forEach((m, idx) => {
  const id = m[1];
  const ext = m[2] === "jpeg" ? "jpg" : m[2];
  const b64 = m[3];
  const buf = Buffer.from(b64, "base64");
  const filePath = path.join(outDir, `${id}.${ext}`);
  fs.writeFileSync(filePath, buf);
  console.log(`Saved ${id}.${ext} (${buf.length} bytes)`);
});
