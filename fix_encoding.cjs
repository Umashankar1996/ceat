const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'seeders', 'seed.sql');
let content = fs.readFileSync(filePath);

// Check for UTF-16 LE BOM (FF FE)
if (content[0] === 0xFF && content[1] === 0xFE) {
  console.log("UTF-16 LE BOM detected.");
  let str = content.toString('utf16le');
  
  // Also remove the DUMMY_SAP block since we are here
  const regex = /IF NOT EXISTS \(SELECT 1 FROM API_Integration WHERE INTEGRATION = 'DUMMY_SAP'\)[\s\S]*?END/i;
  str = str.replace(regex, '');

  fs.writeFileSync(filePath, str, 'utf8');
  console.log("File saved as UTF-8 with DUMMY_SAP removed.");
} else {
  console.log("File is not UTF-16 LE.");
  let str = content.toString('utf8');
  const regex = /IF NOT EXISTS \(SELECT 1 FROM API_Integration WHERE INTEGRATION = 'DUMMY_SAP'\)[\s\S]*?END/i;
  str = str.replace(regex, '');
  fs.writeFileSync(filePath, str, 'utf8');
}
