const fs = require('fs');

const svg = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

for (let i = 0; i <= 10; i++) {
  const id = `image${i}_4343_334`;
  // find pattern referencing this image
  const patRegex = new RegExp(`<pattern[^>]*?id="([^"]+)"[^>]*?>[\\s\\S]*?xlink:href="#${id}"[\\s\\S]*?<\\/pattern>`, 'g');
  let patMatch;
  while ((patMatch = patRegex.exec(svg)) !== null) {
    const patId = patMatch[1];
    // find rects/paths referencing patId
    const fillRegex = new RegExp(`fill="url\\(#${patId}\\)"`, 'g');
    let fillMatch;
    let count = 0;
    while ((fillMatch = fillRegex.exec(svg)) !== null && count < 3) {
      // get surrounding 150 chars
      const start = Math.max(0, fillMatch.index - 50);
      const end = Math.min(svg.length, fillMatch.index + 100);
      console.log(`id: ${id} -> pattern: ${patId} used at:`, svg.substring(start, end).replace(/\n/g, ' '));
      count++;
    }
  }
}
