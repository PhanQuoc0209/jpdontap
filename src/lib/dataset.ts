import alphabetData from '../../data/alphabet.json';
import vocabularyData from '../../data/vocabulary.json';
import kanjiData from '../../data/kanji.json';
import grammarData from '../../data/grammar.json';
import bossesData from '../../data/bosses.json';
import sentencesData from '../../data/sentences.json';
import examQuestionsData from '../../data/exam_questions.json';

export interface KanaItem {
  id: number;
  glyph: string;
  hira: string;
  kata: string | null;
  romaji: string;
  sound: string;
  kind: string;
  row: string;
  sort: number;
  mnemonic?: {
    keywordVi?: string;
    emoji?: string;
    hint?: string;
    note?: string | null;
  };
}

export interface UnitMeta {
  id: string;
  course: string;
  tag: string;
  title: string;
  desc: string;
}

export interface VocabWord {
  id: string;
  word: string;
  kana: string;
  romaji: string;
  meaning: string;
  course: string;
  unitId: string;
  unitTitle: string;
  unitTag: string;
}

export interface KanjiItem {
  kanji: string;
  hanViet: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  level: string;
  course?: string;
  example: string;
}

export interface GrammarItem {
  id: string;
  pattern: string;
  meaning: string;
  explanation: string;
  examples: { jp: string; vi: string }[];
}

export interface SentenceItem {
  id: string;
  course: string;
  tier: 'sơ cấp' | 'trung cấp' | 'cao cấp';
  title: string;
  vi: string;
  jp: string;
  kana: string;
  romaji: string;
  tokens: string[];
  scrambled: string[];
  hint: string;
}

export interface ExamQuestionItem {
  id: string;
  course: string;
  tier: 'sơ cấp' | 'trung cấp' | 'cao cấp';
  bai: string;
  kind: 'image' | 'listening_oral';
  picId?: string;
  type: string;
  questionJp: string;
  displayJp?: string;
  meaningVi: string;
  hint?: string;
  earGuide?: string;
  correctAnswer: string;
  correctMeaning?: string;
  acceptList?: string[];
  trap?: string;
  pron?: string;
  structure?: string;
  vocabHint?: string;
  ladder?: { a: string; s: number; why: string; hint: string }[];
}

export interface BossItem {
  id: string;
  tier: 'sơ cấp' | 'trung cấp' | 'cao cấp';
  course: string;
  unitId?: string;
  stageNumber?: number;
  level: number;
  name: string;
  japaneseName: string;
  title: string;
  location: string;
  avatar: string;
  color: string;
  bgGradient: string;
  maxHp: number;
  requiredCorrect: number;
  totalQuestions: number;
  rewardXp: number;
  rewardPeaches: number;
  description: string;
  specialSkill: string;
  courseUnlock?: string;
  questionType: 'vocab' | 'kanji' | 'vocab_advanced' | 'sentence_scramble';
  isFinalBoss: boolean;
}

// Flat list of kana
export const getAllKana = (): KanaItem[] => {
  const items: KanaItem[] = [];
  if (alphabetData && (alphabetData as any).groups) {
    (alphabetData as any).groups.forEach((g: any) => {
      g.rows?.forEach((r: any) => {
        if (r.items) {
          items.push(...r.items);
        }
      });
    });
  }
  return items;
};

export const dataset = {
  alphabet: alphabetData,
  kanaList: getAllKana(),
  units: vocabularyData.units as UnitMeta[],
  words: vocabularyData.words as VocabWord[],
  kanji: kanjiData as KanjiItem[],
  grammar: grammarData as GrammarItem[],
  bosses: bossesData as unknown as BossItem[],
  sentences: sentencesData as SentenceItem[],
  examQuestions: examQuestionsData as unknown as ExamQuestionItem[]
};
