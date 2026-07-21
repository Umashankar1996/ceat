import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pagesDir = path.join(__dirname, 'src', 'pages');

const filesToUpdate = [
  'LoadingUnloadingPage.tsx',
  'SAPEntryPage.tsx',
  'SecurityAcknowledgementPage.tsx',
  'StoreAcknowledgementPage.tsx',
  'StoreApprovalPage.tsx',
  'WeighmentPage.tsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/\{\s*key:\s*"vehicleOperation"/);
  
  if (match) {
    const startIndex = match.index;
    let braceCount = 0;
    let endIndex = startIndex;
    let started = false;
    
    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '{') {
        braceCount++;
        started = true;
      } else if (content[i] === '}') {
        braceCount--;
      }
      
      if (started && braceCount === 0) {
        let j = i + 1;
        while (content[j] === ' ' || content[j] === '\r' || content[j] === '\n' || content[j] === ',') {
          j++;
        }
        endIndex = j;
        break;
      }
    }
    
    content = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`No 'vehicleOperation' column found in ${file}`);
  }
}
