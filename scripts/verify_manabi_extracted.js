const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../data/manabiman_extracted_words.json');
const words = JSON.parse(fs.readFileSync(file, 'utf8'));

console.log('Total extracted words:', words.length);

// Sample from jpd113-v2-2-2 (which was 0 before)
const sample222 = words.filter(w => w.unitId === 'jpd113-v2-2-2');
console.log('\n--- jpd113-v2-2-2 (Giá cả và số lớn) Count:', sample222.length);
console.log(sample222.slice(0, 5));

// Sample from jpd113-v3-2 (which was 0 before)
const sample32 = words.filter(w => w.unitId === 'jpd113-v3-2');
console.log('\n--- jpd113-v3-2 (Hoạt động và 4 mùa) Count:', sample32.length);
console.log(sample32.slice(0, 5));

// Sample from jpd113-v3-3 (which was 0 before)
const sample33 = words.filter(w => w.unitId === 'jpd113-v3-3');
console.log('\n--- jpd113-v3-3 (Sinh hoạt hằng ngày) Count:', sample33.length);
console.log(sample33.slice(0, 5));

// Sample from jpd123-v4-2
const sample42 = words.filter(w => w.unitId === 'jpd123-v4-2');
console.log('\n--- jpd123-v4-2 Count:', sample42.length);
console.log(sample42.slice(0, 5));
