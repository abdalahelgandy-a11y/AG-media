const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (full.endsWith('.js') || full.endsWith('.jsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('fetch(') || line.includes('fetch (`') || line.includes("fetch('") || line.includes('fetch("')) {
          console.log(`${path.relative('D:\\AG-media system', full)}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

walk('D:\\AG-media system\\src');
