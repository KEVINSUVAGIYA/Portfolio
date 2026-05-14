import fs from 'fs';
const content = fs.readFileSync('/Users/kevin/Desktop/Development/Portfolio/src/app/tools/file-share/page.tsx', 'utf8');
let depth = 0;
const lines = content.split('\n');
lines.forEach((line, i) => {
  for (let char of line) {
    if (char === '{') depth++;
    if (char === '}') depth--;
  }
  console.log(`${i + 1}: ${depth}`);
});
