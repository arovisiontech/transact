const fs = require('fs');
const readline = require('readline');

async function parseSvg() {
  const fileStream = fs.createReadStream('public/Transact INTL HOMEPAGE.svg', { encoding: 'utf8' });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const sections = [];
  let lineNumber = 0;

  for await (const line of rl) {
    lineNumber++;
    // Check for comments or layer names
    const commentMatch = line.match(/<!--(.*?)-->/);
    if (commentMatch) {
      sections.push({ line: lineNumber, type: 'comment', text: commentMatch[1] });
    }

    // Check for rects with full width
    const rectMatch = line.match(/<rect\s+[^>]*?width="19[456]\d"[^>]*?>/);
    if (rectMatch) {
      sections.push({ line: lineNumber, type: 'full-width-rect', text: rectMatch[0].slice(0, 150) });
    }

    // Check for patterns or images
    const imgMatch = line.match(/<image\s+id="([^"]+)"\s+width="(\d+)"\s+height="(\d+)"/);
    if (imgMatch) {
      sections.push({ line: lineNumber, type: 'image-def', id: imgMatch[1], w: imgMatch[2], h: imgMatch[3] });
    }
  }

  console.log('Sections and major elements found:');
  sections.forEach(s => console.log(JSON.stringify(s)));
}

parseSvg();
