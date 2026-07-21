const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

const filesToUpdate = [
  'SAPEntryPage.tsx',
  'StoreApprovalPage.tsx',
  'StoreAcknowledgementPage.tsx',
  'SecurityAcknowledgementPage.tsx',
  'VehicleCheckInPage.tsx',
  'VehicleCheckOutPage.tsx',
  'WeighmentPage.tsx'
];

for (const file of filesToUpdate) {
  const filePath = path.join(pagesDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Add import if missing
  if (!content.includes('useVehicleTypeStore')) {
    content = content.replace(/(import .*;\n)(?=\n|import)/, "$1import { useVehicleTypeStore } from \"@/store/vehicleTypeStore\";\n");
  }
  
  // 2. Add hasPassConfig variable inside the component
  const componentName = file.replace('.tsx', '');
  const componentRegex = new RegExp(`(export function ${componentName}\\(\\) {\\s*)`);
  if (!content.includes('const hasPassConfig')) {
    content = content.replace(componentRegex, "$1  const hasPassConfig = useVehicleTypeStore((state) => state.sequences.length > 0);\n");
  }

  // 3. Update the column header label
  content = content.replace(/label:\s*"Pass No"/g, 'label: hasPassConfig ? "Pass No" : "Truck ID"');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}

// Handle AllTrucksPage.tsx separately
const allTrucksPath = path.join(pagesDir, 'AllTrucksPage.tsx');
let allTrucksContent = fs.readFileSync(allTrucksPath, 'utf8');

if (!allTrucksContent.includes('const hasPassConfig')) {
  allTrucksContent = allTrucksContent.replace(/(export function AllTrucksPage\(\) {\s*)/, "$1  const hasPassConfig = useVehicleTypeStore((state) => state.sequences.length > 0);\n");
}
allTrucksContent = allTrucksContent.replace(/<th className="px-4 py-3 text-left">Pass No<\/th>/g, '<th className="px-4 py-3 text-left">{hasPassConfig ? "Pass No" : "Truck ID"}</th>');

fs.writeFileSync(allTrucksPath, allTrucksContent, 'utf8');
console.log(`Updated AllTrucksPage.tsx`);
