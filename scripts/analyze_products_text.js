const fs = require('fs');
const svg = fs.readFileSync('public/Transact INTL Products Page.svg', 'utf8');

// Find all text between y=0 and y=500
// Since texts might be paths, let's search for any <text> tags in the whole file first
const textMatches = svg.match(/<text[\s\S]*?<\/text>/g);
console.log('Text tags count:', textMatches ? textMatches.length : 0);

// Let's also check if there are any readable strings or comments
const words = ['Products', 'Laryngoscope', 'Category', 'Home', 'Search', 'Filter', 'Showing', 'Sort', 'Add to Quote', 'Catalog', 'Medical', 'Instruments'];
words.forEach(w => {
  const count = (svg.match(new RegExp(w, 'gi')) || []).length;
  console.log(w, ':', count);
});
