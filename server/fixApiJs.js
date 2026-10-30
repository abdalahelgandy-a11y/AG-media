const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '..', 'src', 'api.js');
let content = fs.readFileSync(apiPath, 'utf8');

// Replace all occurrences of ${BASE_URL} with ${getBaseUrl()}
content = content.split('${BASE_URL}').join('${getBaseUrl()}');

// Also make sure let BASE_URL is defined as fallback
if (!content.includes('let BASE_URL =')) {
  content = content.replace(
    'export const api = {',
    'let BASE_URL = getBaseUrl();\n\nexport const api = {'
  );
}

fs.writeFileSync(apiPath, content, 'utf8');
console.log('Fixed api.js! Remaining BASE_URL occurrences:', (content.match(/BASE_URL/g) || []).length);
