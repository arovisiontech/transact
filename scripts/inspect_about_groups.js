const fs = require('fs');

const content = fs.readFileSync('public/Transact INTL About us.svg', 'utf8');

console.log(content.substring(0, 3000));
