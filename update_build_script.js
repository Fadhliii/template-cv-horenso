const fs = require('fs');
const path = require('path');

let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Find and replace the base64 string
indexHtml = indexHtml.replace(/const TEMPLATE_BASE64 = ".*?";/, 'const TEMPLATE_BASE64 = "__BASE64_PLACEHOLDER__";');

const escapedHtml = indexHtml.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const buildJsContent = `const fs = require('fs');
const path = require('path');

const base64Str = fs.readFileSync(path.join(__dirname, 'template_base64.txt'), 'utf8');

const htmlContent = \`${escapedHtml}\`;

const finalHtml = htmlContent.replace('__BASE64_PLACEHOLDER__', base64Str);
fs.writeFileSync(path.join(__dirname, 'index.html'), finalHtml);
console.log('index.html successfully created!');
`;

fs.writeFileSync(path.join(__dirname, 'build.js'), buildJsContent);
console.log('build.js updated');
