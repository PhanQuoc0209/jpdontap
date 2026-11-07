const fs = require('fs');

const content = fs.readFileSync('sample_v2_2_2.html', 'utf8');

// Look for self.__next_f.push
const pushes = [...content.matchAll(/self\.__next_f\.push\(\[1,\s*"([\s\S]*?)"\]\)/g)].map(m => m[1]);
console.log('Pushes count:', pushes.length);

fs.writeFileSync('sample_v2_2_2_extracted.txt', pushes.join('\n'));

// Search for Japanese words or meanings
console.log('File preview around first 2000 chars of extracted:');
console.log(pushes.join('\n').slice(0, 2000));
