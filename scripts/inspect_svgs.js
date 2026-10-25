const fs = require('fs');

const cat = fs.readFileSync('public/Transact Catalogue.svg', 'utf8');
const faq = fs.readFileSync('public/Transact F.A.Q.svg', 'utf8');

const catVb = cat.match(/viewBox="([^"]+)"/);
const faqVb = faq.match(/viewBox="([^"]+)"/);

console.log('Cat viewBox:', catVb ? catVb[1] : null);
console.log('FAQ viewBox:', faqVb ? faqVb[1] : null);

const catIds = [...cat.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
console.log('Cat ids:', catIds.length, catIds.slice(0, 30));

const faqIds = [...faq.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
console.log('FAQ ids:', faqIds.length, faqIds.slice(0, 30));

// Check embedded images
const catImages = [...cat.matchAll(/<image[^>]+xlink:href="([^"]+)"/g)].map(m => m[1]);
console.log('Cat images count:', catImages.length);

const faqImages = [...faq.matchAll(/<image[^>]+xlink:href="([^"]+)"/g)].map(m => m[1]);
console.log('FAQ images count:', faqImages.length);
