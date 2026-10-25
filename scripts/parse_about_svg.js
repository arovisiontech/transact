const fs = require('fs');

const content = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

// Find all tags
const tags = {};
const tagRegex = /<([a-zA-Z0-9]+)/g;
let tm;
while ((tm = tagRegex.exec(content)) !== null) {
  tags[tm[1]] = (tags[tm[1]] || 0) + 1;
}
console.log('Tags:', tags);

// Find all image patterns or image ids
const imageRegex = /<image\s+id="([^"]+)"[^>]+width="([^"]+)"[^>]+height="([^"]+)"/g;
let im;
console.log('--- Images ---');
while ((im = imageRegex.exec(content)) !== null) {
  console.log(`Image id: ${im[1]}, width: ${im[2]}, height: ${im[3]}`);
}

// Find all rects and their y coordinates / dimensions
const rectRegex = /<rect[^>]+y="([^"]+)"[^>]+width="([^"]+)"[^>]+height="([^"]+)"[^>]+fill="url\(#([^)]+)\)"/g;
let rm;
console.log('--- Rects with pattern fills ---');
let count = 0;
while ((rm = rectRegex.exec(content)) !== null && count < 30) {
  console.log(`Rect y: ${rm[1]}, width: ${rm[2]}, height: ${rm[3]}, fill: ${rm[4]}`);
  count++;
}
