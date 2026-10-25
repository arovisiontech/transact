const fs = require('fs');

function extract(svgPath, outPng) {
  const s = fs.readFileSync(svgPath, 'utf8');
  const m = s.match(/data:image\/[^;]+;base64,([^"]+)/);
  if (m) {
    const buf = Buffer.from(m[1], 'base64');
    fs.writeFileSync(outPng, buf);
    console.log(`Saved ${outPng}, size: ${buf.length}`);
  }
}

extract('public/Rectangle 1098.svg', 'public/temp_1098.png');
extract('public/image 421.svg', 'public/temp_421.png');
extract('public/image 424.svg', 'public/temp_424.png');
