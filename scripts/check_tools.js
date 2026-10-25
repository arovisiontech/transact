const fs = require('fs');

console.log('sharp exists:', fs.existsSync('node_modules/sharp'));
console.log('resvg exists:', fs.existsSync('node_modules/@resvg/resvg-js'));
