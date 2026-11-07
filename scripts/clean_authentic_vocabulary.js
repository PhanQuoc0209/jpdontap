const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '../data/vocabulary.json');
const v = JSON.parse(fs.readFileSync(vocabFile, 'utf8'));

// 1. Keep original 335 authentic Manabiman words
const originalWords = v.words.filter(w => !w.id.includes('-extra-') && !w.id.includes('-exp-') && !w.id.includes('-exp2-'));

const examQ = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/exam_questions.json'), 'utf8'));
const wordMap = new Map();

originalWords.forEach(w => {
  wordMap.set(w.word, w);
});

// 2. Add authentic words from user's on-thi-noijpd.vercel.app exam questions
let newFromExam = 0;
examQ.forEach(q => {
  if (q.vocabHint) {
    const parts = q.vocabHint.split(/[；;]/);
    parts.forEach(p => {
      const match = p.trim().match(/^([^:：]+)[:：]\s*(.+)$/);
      if (match) {
        const rawWord = match[1].trim();
        const meaning = match[2].trim();
        if (!wordMap.has(rawWord) && rawWord.length > 0 && !rawWord.includes('~') && !rawWord.includes('...')) {
          const unitMatch = v.units.find(u => u.course === q.course && (u.tag.startsWith(q.bai + '-') || u.tag === q.bai));
          const unit = unitMatch || v.units.find(u => u.course === q.course) || v.units[0];
          wordMap.set(rawWord, {
            id: 'exam-' + q.course + '-b' + q.bai + '-' + (++newFromExam),
            word: rawWord,
            kana: rawWord,
            romaji: '',
            meaning: meaning,
            course: q.course,
            unitId: unit.id,
            unitTitle: unit.title,
            unitTag: unit.tag
          });
        }
      }
    });
  }
});

const verifiedWords = Array.from(wordMap.values());
v.words = verifiedWords;

fs.writeFileSync(vocabFile, JSON.stringify(v, null, 2), 'utf8');
console.log('Saved data/vocabulary.json with', verifiedWords.length, 'verified authentic words!');
