'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { dataset, VocabWord, UnitMeta } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import {
  ArrowLeft,
  BarChart2,
  Zap,
  RotateCw,
  Volume2,
  ChevronRight,
  Play,
  Shuffle,
  BookOpen,
  Check,
  X,
  Sparkles,
  Keyboard,
  FileQuestion,
  Timer,
  Trophy,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Settings,
  Search,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

type StudyMode = 'dashboard' | 'flashcard' | 'typing' | 'exam';
type ActionFilter = 'all' | 'due' | 'typing' | 'exam';

interface ExamQuestion {
  id: string;
  word: VocabWord;
  type: 'kanji_to_kana' | 'kana_to_kanji' | 'audio_to_word';
  titleBadge: string;
  prompt: string;
  subPrompt?: string;
  options: { id: string; text: string; sub?: string }[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export default function FlashcardsPage() {
  const [currentMode, setCurrentMode] = useState<StudyMode>('dashboard');
  const [activeFilter, setActiveFilter] = useState<ActionFilter>('all');
  const [selectedLevel, setSelectedLevel] = useState<'jpd113' | 'jpd123' | 'jpd133'>('jpd113');
  const [selectedUnitId, setSelectedUnitId] = useState<string | 'all'>('all');
  const [isShuffled, setIsShuffled] = useState(false);
  const [selectedUnitForAction, setSelectedUnitForAction] = useState<UnitMeta | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // ===================== 1. FLASHCARD SRS STATE =====================
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // ===================== 2. TYPING PRACTICE STATE ===================
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingInput, setTypingInput] = useState('');
  const [typingFeedback, setTypingFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [typingShowHint, setTypingShowHint] = useState(false);
  const [typingCombo, setTypingCombo] = useState(0);
  const [typingCorrectCount, setTypingCorrectCount] = useState(0);
  const [typingWrongCount, setTypingWrongCount] = useState(0);
  const [typingFinished, setTypingFinished] = useState(false);
  const typingInputRef = useRef<HTMLInputElement>(null);

  // ===================== 3. EXAM & TEST STATE =======================
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState(0);
  const [examTimer, setExamTimer] = useState(20);
  const [examFinished, setExamFinished] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [examCorrectCount, setExamCorrectCount] = useState(0);
  const [selectedExamOption, setSelectedExamOption] = useState<string | null>(null);
  const [examShowHelp, setExamShowHelp] = useState(false);
  const [examWrongExplanation, setExamWrongExplanation] = useState<{
    meaningVi: string;
    correctChoice: string;
    wordText: string;
    kanaText: string;
    romajiText: string;
    unitTitle: string;
  } | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active deck calculation based on chosen level & unit
  const activeDeck = useMemo(() => {
    let list: VocabWord[] = [];
    if (selectedUnitId === 'all') {
      list = dataset.words.filter(w => w.course === selectedLevel);
    } else {
      list = dataset.words.filter(w => w.unitId === selectedUnitId);
    }

    if (list.length === 0) {
      list = dataset.words.filter(w => w.course === selectedLevel);
    }

    if (isShuffled) {
      return [...list].sort(() => 0.5 - Math.random());
    }
    return list;
  }, [selectedLevel, selectedUnitId, isShuffled]);

  const levelWords = dataset.words.filter(w => w.course === selectedLevel);
  const levelUnits = dataset.units.filter(u => u.course === selectedLevel);

  const currentUnitMeta = useMemo(() => {
    if (selectedUnitId === 'all') {
      return { title: `Toàn bộ ${selectedLevel.toUpperCase()}`, tag: 'ALL' };
    }
    return dataset.units.find(u => u.id === selectedUnitId) || { title: 'Bài học', tag: 'UNIT' };
  }, [selectedUnitId, selectedLevel]);

  const currentFlashcard = activeDeck[flashcardIndex] || activeDeck[0];
  const currentTypingWord = activeDeck[typingIndex] || activeDeck[0];
  const currentExamQuestion = examQuestions[examCurrentIndex];

  // Unit words for the action modal (with search filter)
  const modalUnitWords = useMemo(() => {
    if (!selectedUnitForAction) return [];
    const words = dataset.words.filter(w => w.unitId === selectedUnitForAction.id);
    if (!modalSearchQuery.trim()) return words;
    const q = modalSearchQuery.toLowerCase().trim();
    return words.filter(w =>
      w.word.toLowerCase().includes(q) ||
      w.kana.toLowerCase().includes(q) ||
      w.romaji.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q)
    );
  }, [selectedUnitForAction, modalSearchQuery]);

  // Auto-focus input in typing mode
  useEffect(() => {
    if (currentMode === 'typing' && !typingFinished) {
      setTimeout(() => {
        typingInputRef.current?.focus();
      }, 100);
    }
  }, [currentMode, typingIndex, typingFinished]);

  // Exam Countdown Timer
  useEffect(() => {
    if (currentMode === 'exam' && !examFinished && examQuestions.length > 0) {
      setExamTimer(20);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = setInterval(() => {
        setExamTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout);
            handleExamTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [currentMode, examCurrentIndex, examFinished, examQuestions.length]);

  // ===================== SESSION LAUNCHERS ==========================
  const handleStartFlashcard = (unitId: string | 'all' = 'all') => {
    sound.playTap();
    setSelectedUnitId(unitId);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setReviewCount(0);
    setCurrentMode('flashcard');
  };

  const handleStartTyping = (unitId: string | 'all' = 'all') => {
    sound.playTap();
    setSelectedUnitId(unitId);
    setTypingIndex(0);
    setTypingInput('');
    setTypingFeedback('none');
    setTypingShowHint(false);
    setTypingCombo(0);
    setTypingCorrectCount(0);
    setTypingWrongCount(0);
    setTypingFinished(false);
    setCurrentMode('typing');
  };

  const handleStartExam = (unitId: string | 'all' = 'all') => {
    sound.playTap();
    setSelectedUnitId(unitId);

    let pool = dataset.words.filter(w => w.course === selectedLevel);
    if (unitId !== 'all') {
      const unitWords = dataset.words.filter(w => w.unitId === unitId);
      if (unitWords.length >= 4) {
        pool = unitWords;
      }
    }

    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const count = Math.min(15, shuffledPool.length);
    const pickedWords = shuffledPool.slice(0, count);

    const questions: ExamQuestion[] = pickedWords.map((word, idx) => {
      const otherWords = pool.filter(w => w.id !== word.id);
      const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
      const distractors = shuffledOthers.slice(0, 3);

      const qTypes: ('kanji_to_kana' | 'kana_to_kanji' | 'audio_to_word')[] = [
        'kanji_to_kana',
        'kana_to_kanji',
        'audio_to_word'
      ];
      const qType = qTypes[idx % qTypes.length];

      if (qType === 'kanji_to_kana') {
        // Kanji -> Choose correct Hiragana reading (All Japanese!)
        const options = [
          { id: 'correct', text: word.kana, sub: word.romaji },
          ...distractors.map((d, i) => ({ id: `d_${i}`, text: d.kana, sub: d.romaji }))
        ].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          word,
          type: qType,
          titleBadge: '読み方 (CÁCH ĐỌC HIRAGANA)',
          prompt: word.word,
          subPrompt: `「${word.word}」の正しい読み方はどれですか？`,
          options,
          correctAnswer: word.kana
        };
      } else if (qType === 'kana_to_kanji') {
        // Hiragana -> Choose Kanji/Word (All Japanese!)
        const options = [
          { id: 'correct', text: word.word },
          ...distractors.map((d, i) => ({ id: `d_${i}`, text: d.word }))
        ].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          word,
          type: qType,
          titleBadge: '漢字表記 (CHỌN CHỮ KANJI/TỪ)',
          prompt: word.kana,
          subPrompt: `「${word.kana}」の正しい漢字表記はどれですか？`,
          options,
          correctAnswer: word.word
        };
      } else {
        // Audio listening -> Choose Word (All Japanese!)
        const options = [
          { id: 'correct', text: word.word, sub: word.kana },
          ...distractors.map((d, i) => ({ id: `d_${i}`, text: d.word, sub: d.kana }))
        ].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          word,
          type: qType,
          titleBadge: '聴解 (NGHE PHÁT ÂM CHỌN TỪ)',
          prompt: '🔊 音声を聞いてください',
          subPrompt: '発音を聞いて、正しい言葉を選んでください',
          options,
          correctAnswer: word.word
        };
      }
    });

    setExamQuestions(questions);
    setExamCurrentIndex(0);
    setExamTimer(20);
    setExamFinished(false);
    setExamScore(0);
    setExamCorrectCount(0);
    setSelectedExamOption(null);
    setExamShowHelp(false);
    setExamWrongExplanation(null);
    setCurrentMode('exam');
  };

  // Unit Card Click handler (Opens mode picker or starts active mode)
  const handleUnitClick = (unit: UnitMeta) => {
    sound.playTap();
    if (activeFilter === 'typing') {
      handleStartTyping(unit.id);
    } else if (activeFilter === 'exam') {
      handleStartExam(unit.id);
    } else {
      // By default open the quick mode selector modal for this unit!
      setSelectedUnitForAction(unit);
    }
  };

  // ===================== FLASHCARD ACTIONS ===========================
  const handleFlip = () => {
    sound.playTap();
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    sound.speakJapanese(text);
  };

  const handleRateFlashcard = (status: 'again' | 'good' | 'easy') => {
    if (status === 'easy' || status === 'good') {
      sound.playCorrect();
      setKnownCount(prev => prev + 1);
    } else {
      sound.playWrong();
      setReviewCount(prev => prev + 1);
    }

    if (flashcardIndex + 1 < activeDeck.length) {
      setIsFlipped(false);
      setTimeout(() => setFlashcardIndex(prev => prev + 1), 150);
    } else {
      sound.playVictory();
      confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
      setCurrentMode('dashboard');
    }
  };

  // ===================== TYPING PRACTICE ACTIONS ====================
  const normalizeText = (text: string) => {
    return text.toLowerCase().trim().replace(/[\s\-_]/g, '');
  };

  const handleCheckTyping = () => {
    if (!currentTypingWord || typingFeedback !== 'none') return;

    const inputClean = normalizeText(typingInput);
    if (!inputClean) return;

    const wordClean = normalizeText(currentTypingWord.word);
    const kanaClean = normalizeText(currentTypingWord.kana);
    const romajiClean = normalizeText(currentTypingWord.romaji);
    const meaningClean = normalizeText(currentTypingWord.meaning);

    const isMatch =
      inputClean === romajiClean ||
      inputClean === kanaClean ||
      inputClean === wordClean ||
      inputClean === meaningClean;

    if (isMatch) {
      sound.playCorrect();
      setTypingFeedback('correct');
      setTypingCombo(prev => prev + 1);
      setTypingCorrectCount(prev => prev + 1);

      setTimeout(() => {
        handleNextTypingWord();
      }, 800);
    } else {
      sound.playWrong();
      setTypingFeedback('wrong');
      setTypingCombo(0);
      setTypingWrongCount(prev => prev + 1);
    }
  };

  const handleNextTypingWord = () => {
    if (typingIndex + 1 < activeDeck.length) {
      setTypingIndex(prev => prev + 1);
      setTypingInput('');
      setTypingFeedback('none');
      setTypingShowHint(false);
    } else {
      sound.playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTypingFinished(true);
    }
  };

  const handleSkipTyping = () => {
    sound.playWrong();
    setTypingFeedback('wrong');
    setTypingCombo(0);
    setTypingWrongCount(prev => prev + 1);
  };

  // ===================== EXAM ACTIONS ================================
  const handleExamOptionClick = (optionText: string) => {
    if (selectedExamOption !== null || !currentExamQuestion || examWrongExplanation !== null) return;

    setSelectedExamOption(optionText);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const isCorrect = optionText === currentExamQuestion.correctAnswer;
    currentExamQuestion.userAnswer = optionText;
    currentExamQuestion.isCorrect = isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      setExamCorrectCount(prev => prev + 1);
      setTimeout(() => {
        handleAdvanceExamQuestion();
      }, 1000);
    } else {
      sound.playWrong();
      // SHOW EXPLANATION when wrong!
      setExamWrongExplanation({
        meaningVi: currentExamQuestion.word.meaning,
        correctChoice: currentExamQuestion.correctAnswer,
        wordText: currentExamQuestion.word.word,
        kanaText: currentExamQuestion.word.kana,
        romajiText: currentExamQuestion.word.romaji,
        unitTitle: currentExamQuestion.word.unitTitle,
      });
    }
  };

  const handleExamTimeout = () => {
    if (selectedExamOption !== null || !currentExamQuestion) return;

    sound.playWrong();
    currentExamQuestion.userAnswer = '(Hết giờ)';
    currentExamQuestion.isCorrect = false;
    setSelectedExamOption('(Hết giờ)');

    // SHOW EXPLANATION when timed out!
    setExamWrongExplanation({
      meaningVi: currentExamQuestion.word.meaning,
      correctChoice: currentExamQuestion.correctAnswer,
      wordText: currentExamQuestion.word.word,
      kanaText: currentExamQuestion.word.kana,
      romajiText: currentExamQuestion.word.romaji,
      unitTitle: currentExamQuestion.word.unitTitle,
    });
  };

  const handleAdvanceExamQuestion = () => {
    setExamWrongExplanation(null);
    setExamShowHelp(false);
    setSelectedExamOption(null);

    if (examCurrentIndex + 1 < examQuestions.length) {
      setExamCurrentIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const total = examQuestions.length;
    const correct = examQuestions.filter(q => q.isCorrect).length;
    const finalScore = Math.round((correct / total) * 100);

    setExamScore(finalScore);
    setExamFinished(true);

    if (finalScore >= 80) {
      sound.playVictory();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* 1. TOP HEADER (Exact Pandarin reproduction: Back button, Title, Right icons) */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base sm:text-lg font-black text-[#143521]">Học Flashcard</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/tien-do"
            className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-xs shadow-sm hover:scale-105 transition-transform"
            title="Tiến độ học tập"
          >
            <BarChart2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xs shadow-sm transition-all cursor-pointer ${
              isShuffled ? 'bg-[#22c55e] text-white border-[#22c55e]' : 'bg-white text-stone-700 border-stone-200'
            }`}
            title="Cài đặt & Xáo trộn"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =============================================================== */}
      {/* DASHBOARD VIEW: EXACT PANDARIN REPRODUCTION                     */}
      {/* =============================================================== */}
      {currentMode === 'dashboard' && (
        <>
          {/* Hero SRS Box (Exact Pandarin: HÔM NAY, Heading, 4 Stats Tiles, Green 3D Button) */}
          <div className="relative overflow-hidden rounded-[2rem] bg-white border border-[#e2ece0] p-4 sm:p-5 shadow-[0_8px_20px_rgba(20,53,33,0.04)] space-y-3">
            {/* Mascot Peeking at top right */}
            <div className="absolute top-2 right-4 select-none">
              <div className="w-14 h-14 relative">
                <WukongMascot mood="happy" size="sm" showCloud={false} />
              </div>
            </div>

            {/* HÔM NAY Badge */}
            <span className="inline-block px-3 py-1 rounded-full bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-wider shadow-2xs">
              HÔM NAY
            </span>

            {/* Heading & Streak */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#143521]">
                {activeFilter === 'due' ? 'Đang ôn 12 thẻ đến hạn' : 'Không còn thẻ đến hạn'}
              </h2>
              <p className="text-xs text-[#ea580c] font-bold mt-0.5 flex items-center gap-1">
                <span>🔥</span> Chuỗi học 7 ngày liên tiếp
              </p>
            </div>

            {/* 4 Stats Tiles in 1 Row */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="bg-[#fcfbf7] rounded-2xl border border-[#efe9dc] p-2.5 text-center shadow-2xs">
                <span className="text-xs sm:text-sm block">⏰</span>
                <span className="text-base sm:text-lg font-black text-[#143521] block leading-tight">12</span>
                <span className="text-[10px] text-[#718777] font-bold block">Đến hạn</span>
              </div>
              <div className="bg-[#fcfbf7] rounded-2xl border border-[#efe9dc] p-2.5 text-center shadow-2xs">
                <span className="text-xs sm:text-sm block">🆕</span>
                <span className="text-base sm:text-lg font-black text-[#143521] block leading-tight">{levelWords.length}</span>
                <span className="text-[10px] text-[#718777] font-bold block">Thẻ mới</span>
              </div>
              <div className="bg-[#fcfbf7] rounded-2xl border border-[#efe9dc] p-2.5 text-center shadow-2xs">
                <span className="text-xs sm:text-sm block">🔄</span>
                <span className="text-base sm:text-lg font-black text-[#143521] block leading-tight">35</span>
                <span className="text-[10px] text-[#718777] font-bold block">Đang học</span>
              </div>
              <div className="bg-[#fcfbf7] rounded-2xl border border-[#efe9dc] p-2.5 text-center shadow-2xs">
                <span className="text-xs sm:text-sm block">✅</span>
                <span className="text-base sm:text-lg font-black text-[#143521] block leading-tight">84</span>
                <span className="text-[10px] text-[#718777] font-bold block">Đã nhớ</span>
              </div>
            </div>

            {/* Big Green 3D Button */}
            <button
              onClick={() => {
                if (activeFilter === 'typing') {
                  handleStartTyping('all');
                } else if (activeFilter === 'exam') {
                  handleStartExam('all');
                } else {
                  handleStartFlashcard('all');
                }
              }}
              className="btn-3d-green w-full py-3.5 rounded-2xl text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-98 transition-transform cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {activeFilter === 'typing'
                  ? `⌨️ Luyện gõ toàn bộ ${selectedLevel.toUpperCase()} (${levelWords.length} từ)`
                  : activeFilter === 'exam'
                  ? `📝 Vào thi thử sát hạch ${selectedLevel.toUpperCase()} (15 câu)`
                  : `⚡ Học thẻ mới hôm nay (${levelWords.length} từ)`}
              </span>
            </button>
          </div>

          {/* Action / Mode Selector Pills (Học thẻ mới, Luyện gõ, Mục thi, Chỉ ôn đến hạn) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`py-2 px-3 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'bg-white text-[#597361] border border-[#d8e5d6] hover:border-[#22c55e]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Học thẻ mới</span>
            </button>

            <button
              onClick={() => setActiveFilter('typing')}
              className={`py-2 px-3 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeFilter === 'typing'
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'bg-white text-[#597361] border border-[#d8e5d6] hover:border-[#22c55e]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Luyện gõ</span>
            </button>

            <button
              onClick={() => setActiveFilter('exam')}
              className={`py-2 px-3 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeFilter === 'exam'
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'bg-white text-[#597361] border border-[#d8e5d6] hover:border-[#22c55e]'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Mục thi</span>
            </button>

            <button
              onClick={() => setActiveFilter('due')}
              className={`py-2 px-3 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeFilter === 'due'
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'bg-white text-[#597361] border border-[#d8e5d6] hover:border-[#22c55e]'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Chỉ ôn đến hạn</span>
            </button>
          </div>

          {/* Level Pills: JPD 1, JPD 2, JPD 3 (Matching Pandarin HSK 1, HSK 2, HSK 3) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'jpd113', label: 'JPD 1' },
              { key: 'jpd123', label: 'JPD 2' },
              { key: 'jpd133', label: 'JPD 3' }
            ].map((lvl) => (
              <button
                key={lvl.key}
                onClick={() => {
                  setSelectedLevel(lvl.key as any);
                  setSelectedUnitId('all');
                }}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                  selectedLevel === lvl.key
                    ? 'bg-[#22c55e] text-white shadow-md'
                    : 'bg-white text-[#718777] border border-[#d8e5d6] hover:border-[#22c55e]'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* Section Course Header (Matching Pandarin Panda icon + HSK 1 116 từ + Học cả HSK >) */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-2 font-bold text-[#143521]">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-sm shadow-2xs">
                🐒
              </div>
              <span className="font-black">
                {selectedLevel === 'jpd113' ? 'JPD 1' : selectedLevel === 'jpd123' ? 'JPD 2' : 'JPD 3'} • {levelWords.length} từ
              </span>
            </div>
            <button
              onClick={() => {
                if (activeFilter === 'typing') handleStartTyping('all');
                else if (activeFilter === 'exam') handleStartExam('all');
                else handleStartFlashcard('all');
              }}
              className="text-[#15803d] font-black hover:underline flex items-center gap-0.5 text-xs cursor-pointer"
            >
              Học cả {selectedLevel.toUpperCase()} &gt;
            </button>
          </div>

          {/* THE LESSON LIST (Exact Pandarin list to review/study like normal) */}
          <div className="space-y-3">
            {levelUnits.map((unit, index) => {
              const unitWordsCount = dataset.words.filter(w => w.unitId === unit.id).length;

              return (
                <div
                  key={unit.id}
                  onClick={() => handleUnitClick(unit)}
                  className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.03)] hover:border-[#22c55e] hover:shadow-sm transition-all cursor-pointer group"
                >
                  {/* Left: Rounded Square Icon + Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rounded Square Card Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-[#fff8ed] border border-[#fed7aa] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      <span className="text-xl">🎴</span>
                    </div>

                    {/* Unit Info & Progress */}
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-xs sm:text-sm font-black text-[#143521] truncate">
                        Phần 1 • {unit.title}
                      </h4>

                      {/* Badges: X thẻ | X mới */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#f4f7f2] text-[#597361] text-[10px] font-bold">
                          {unitWordsCount} thẻ
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#ecfdf5] text-[#15803d] text-[10px] font-bold">
                          {unitWordsCount} mới
                        </span>
                      </div>

                      {/* Progress Bar with 0% */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <div className="w-32 sm:w-48 h-1.5 rounded-full bg-[#e2ede0] overflow-hidden">
                          <div className="h-full bg-[#22c55e] rounded-full w-0" />
                        </div>
                        <span className="text-[10px] text-[#718777] font-mono font-bold">
                          0%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Clean Green 3D "▶ Học" Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnitClick(unit);
                    }}
                    className="btn-3d-green px-5 py-2.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Học</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Action & Vocabulary List Modal when clicking on any Unit Card */}
          {selectedUnitForAction && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                onClick={() => {
                  setSelectedUnitForAction(null);
                  setModalSearchQuery('');
                }}
              />

              {/* Modal Card */}
              <div className="relative w-full max-w-md sm:max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#e2ece0] z-10 animate-in fade-in zoom-in duration-200 flex flex-col overflow-hidden">
                {/* Modal Header (Sticky) */}
                <div className="p-4 sm:p-5 pb-3 border-b border-[#e2ece0] flex items-center justify-between bg-[#fbfdf9] shrink-0">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        Bài {selectedUnitForAction.tag}
                      </span>
                      <span className="text-[10px] font-bold text-[#718777]">
                        {dataset.words.filter(w => w.unitId === selectedUnitForAction.id).length} từ vựng
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#143521] mt-1 truncate">
                      {selectedUnitForAction.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedUnitForAction(null);
                      setModalSearchQuery('');
                    }}
                    className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
                    title="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                  {/* Section 1: 3 Study Modes */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-[#597361] block">
                      Chọn phương thức ôn tập cho bài học này:
                    </span>

                    <div className="space-y-2">
                      {/* Mode 1: Flashcard SRS */}
                      <button
                        onClick={() => {
                          const id = selectedUnitForAction.id;
                          setSelectedUnitForAction(null);
                          setModalSearchQuery('');
                          handleStartFlashcard(id);
                        }}
                        className="w-full p-3 rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-left flex items-center justify-between transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shrink-0">
                            🎴
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-black text-[#143521] block">
                              Thẻ Lật SRS
                            </span>
                            <span className="text-[10px] text-[#718777] block truncate">
                              Lật thẻ ghi nhớ Spaced Repetition
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>

                      {/* Mode 2: Typing Practice */}
                      <button
                        onClick={() => {
                          const id = selectedUnitForAction.id;
                          setSelectedUnitForAction(null);
                          setModalSearchQuery('');
                          handleStartTyping(id);
                        }}
                        className="w-full p-3 rounded-2xl border-2 border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-left flex items-center justify-between transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
                            ⌨️
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-black text-[#143521] block">
                              Luyện Gõ Từ Vựng
                            </span>
                            <span className="text-[10px] text-[#718777] block truncate">
                              Gõ Romaji &amp; Kana tăng tốc phản xạ
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>

                      {/* Mode 3: Exam Test */}
                      <button
                        onClick={() => {
                          const id = selectedUnitForAction.id;
                          setSelectedUnitForAction(null);
                          setModalSearchQuery('');
                          handleStartExam(id);
                        }}
                        className="w-full p-3 rounded-2xl border-2 border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 text-left flex items-center justify-between transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg shrink-0">
                            📝
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-black text-[#143521] block">
                              Mục Thi Sát Hạch
                            </span>
                            <span className="text-[10px] text-[#718777] block truncate">
                              15 câu trắc nghiệm &amp; nghe có tính giờ
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-rose-600 group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Vocabulary List of This Unit */}
                  <div className="space-y-2.5 pt-3 border-t border-[#e2ece0]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black text-[#143521]">
                          Danh sách từ vựng bài này ({modalUnitWords.length} từ)
                        </span>
                      </div>
                      <span className="text-[10px] text-[#718777] font-semibold">
                        Chạm loa 🔊 để nghe phát âm
                      </span>
                    </div>

                    {/* Search inside unit */}
                    <div className="relative">
                      <input
                        type="text"
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                        placeholder="Tìm từ trong bài (Kanji, Kana, Nghĩa)..."
                        className="w-full py-2 pl-8 pr-3 rounded-xl bg-[#f4f8f3] border border-[#d8e5d6] text-xs font-medium text-[#143521] placeholder-[#889e8f] outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      />
                      <Search className="w-3.5 h-3.5 text-[#718777] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Word Items */}
                    <div className="space-y-1.5 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
                      {modalUnitWords.length === 0 ? (
                        <p className="text-xs text-center py-4 text-[#718777]">
                          Không tìm thấy từ vựng nào phù hợp.
                        </p>
                      ) : (
                        modalUnitWords.map((w, idx) => (
                          <div
                            key={w.id}
                            className="p-2.5 rounded-2xl bg-[#f8faf6] border border-[#e4ede2] hover:border-emerald-400 hover:bg-emerald-50/40 transition-all flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-5 text-center text-[10px] font-mono font-bold text-[#889e8f] shrink-0">
                                {idx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                  <span className="text-sm font-black text-[#143521] jp-font">
                                    {w.word}
                                  </span>
                                  <span className="text-xs font-bold text-red-600 font-mono">
                                    {w.kana}
                                  </span>
                                  {w.romaji && (
                                    <span className="text-[10px] text-[#718777] font-mono">
                                      ({w.romaji})
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs font-bold text-[#b45309] block truncate">
                                  {w.meaning}
                                </span>
                              </div>
                            </div>

                            {/* Speaker button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.speakJapanese(w.word);
                              }}
                              className="w-8 h-8 rounded-xl bg-white border border-[#cbd5e1] hover:bg-emerald-50 hover:border-emerald-400 text-[#15803d] flex items-center justify-center shrink-0 shadow-2xs active:scale-90 transition-transform cursor-pointer"
                              title="Nghe phát âm chuẩn"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* =============================================================== */}
      {/* 2. FLASHCARD SRS ACTIVE STUDY MODE                              */}
      {/* =============================================================== */}
      {currentMode === 'flashcard' && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentMode('dashboard')}
              className="text-[#15803d] font-black flex items-center gap-1 hover:underline cursor-pointer"
            >
              ← Thoát phiên học
            </button>
            <span className="font-bold text-[#718777]">
              {currentUnitMeta.title}: Thẻ {flashcardIndex + 1} / {activeDeck.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#e2ede0] overflow-hidden">
            <div
              className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((flashcardIndex + 1) / activeDeck.length) * 100)}%` }}
            />
          </div>

          {/* Flashcard 3D Card */}
          {currentFlashcard && (
            <div
              onClick={handleFlip}
              className="cursor-pointer select-none rounded-[2.2rem] bg-gradient-to-br from-[#fcfaf5] via-[#f8f5eb] to-[#eee5d3] border-2 border-[#e4dac3] p-6 sm:p-8 min-h-[340px] flex flex-col justify-between items-center text-center shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              {/* Top Hint */}
              <div className="flex items-center justify-between w-full">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  {currentFlashcard.unitTag || 'JPD'}
                </span>
                <span className="text-[11px] font-black text-[#8c6753]">
                  {isFlipped ? 'Mặt sau (Nghĩa)' : 'Chạm để lật thẻ ↻'}
                </span>
              </div>

              {/* Card Face */}
              {!isFlipped ? (
                <div className="space-y-3 my-auto animate-fade-in flex flex-col items-center">
                  <h2 className="text-5xl sm:text-6xl font-black text-[#143521] jp-font tracking-tight drop-shadow-xs">
                    {currentFlashcard.word}
                  </h2>
                  <p className="text-base font-black text-red-600 font-mono">
                    {currentFlashcard.kana} {currentFlashcard.romaji ? `(${currentFlashcard.romaji})` : ''}
                  </p>
                  <button
                    onClick={(e) => handleSpeak(e, currentFlashcard.word)}
                    className="w-11 h-11 rounded-full bg-white border border-[#cbd5e1] text-[#15803d] hover:bg-emerald-50 flex items-center justify-center shadow-md active:scale-90 transition-all mt-2 cursor-pointer"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 my-auto animate-fade-in flex flex-col items-center">
                  <span className="text-3xl sm:text-4xl font-black text-[#143521] jp-font">
                    {currentFlashcard.word}
                  </span>
                  <div className="px-5 py-2.5 rounded-2xl bg-white border border-[#fed7aa] text-lg sm:text-xl font-black text-[#b45309] shadow-xs">
                    {currentFlashcard.meaning}
                  </div>
                  <p className="text-xs font-mono text-[#718777]">
                    Phiên âm: {currentFlashcard.kana} • {currentFlashcard.romaji}
                  </p>
                  <button
                    onClick={(e) => handleSpeak(e, currentFlashcard.word)}
                    className="w-10 h-10 rounded-full bg-white border border-[#cbd5e1] text-[#15803d] hover:bg-emerald-50 flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bottom Instructions */}
              <span className="text-[11px] text-[#718777] font-semibold">
                {isFlipped ? 'Đánh giá mức độ ghi nhớ để thuật toán xếp lịch' : 'Chạm vào thẻ để xem đáp án tiếng Việt'}
              </span>
            </div>
          )}

          {/* Rating Control Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => handleRateFlashcard('again')}
              className="py-3 px-2 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-black text-xs flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-rose-600" />
              <span>Chưa thuộc (1 ngày)</span>
            </button>

            <button
              onClick={() => handleRateFlashcard('good')}
              className="py-3 px-2 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-black text-xs flex flex-col items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-amber-600" />
              <span>Tạm nhớ (3 ngày)</span>
            </button>

            <button
              onClick={() => handleRateFlashcard('easy')}
              className="btn-3d-green py-3 px-2 rounded-2xl text-white font-black text-xs flex flex-col items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Đã thuộc (7 ngày)</span>
            </button>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 3. TYPING PRACTICE ACTIVE MODE (Luyện Gõ)                       */}
      {/* =============================================================== */}
      {currentMode === 'typing' && !typingFinished && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => setCurrentMode('dashboard')}
              className="text-[#15803d] font-black flex items-center gap-1 hover:underline cursor-pointer"
            >
              ← Thoát luyện gõ
            </button>
            <div className="flex items-center gap-2">
              {typingCombo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-300 text-[10px] font-black animate-pulse">
                  🔥 Combo x{typingCombo}
                </span>
              )}
              <span className="font-bold text-[#718777]">
                Từ {typingIndex + 1} / {activeDeck.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#e2ede0] overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((typingIndex + 1) / activeDeck.length) * 100)}%` }}
            />
          </div>

          {/* Typing Prompt Card */}
          {currentTypingWord && (
            <div className="rounded-[2.2rem] bg-gradient-to-br from-[#fcfaf5] via-[#f8f5eb] to-[#eee5d3] border-2 border-[#e4dac3] p-6 sm:p-8 min-h-[300px] flex flex-col justify-between items-center text-center shadow-xl space-y-4 relative">
              {/* Badge & Unit */}
              <div className="flex items-center justify-between w-full">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  ⌨️ Luyện Gõ • {currentTypingWord.unitTag}
                </span>
                <button
                  onClick={() => sound.speakJapanese(currentTypingWord.word)}
                  className="w-9 h-9 rounded-full bg-white border border-[#cbd5e1] text-[#15803d] hover:bg-emerald-50 flex items-center justify-center shadow-xs cursor-pointer"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Prompt Word (NO VIETNAMESE MEANING BY DEFAULT) */}
              <div className="space-y-2 my-auto">
                <span className="text-[11px] font-bold text-[#8c6753] uppercase tracking-wider block">
                  Gõ cách đọc Hiragana hoặc Romaji cho từ này:
                </span>
                <h2 className="text-4xl sm:text-5xl font-black text-[#143521] jp-font">
                  {currentTypingWord.word}
                </h2>
                <p className="text-xs text-[#718777]">
                  (Ví dụ gõ: <code className="bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-800 font-mono font-bold">{currentTypingWord.kana.slice(0, 1)}...</code> hoặc Romaji)
                </p>

                {/* Khi khó quá? Xem giải thích & Nghĩa */}
                {typingShowHint ? (
                  <div className="pt-2 animate-fade-in p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left space-y-1.5 max-w-sm mx-auto shadow-2xs">
                    <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Giải thích chi tiết (Trợ giúp):</span>
                    </div>
                    <p className="text-xs text-stone-700">
                      🇻🇳 <strong>Nghĩa tiếng Việt:</strong> <span className="text-amber-950 font-black">{currentTypingWord.meaning}</span>
                    </p>
                    <p className="text-xs text-stone-700">
                      📖 <strong>Cách gõ đúng:</strong> <span className="font-mono font-bold text-red-600">{currentTypingWord.kana}</span> ({currentTypingWord.romaji})
                    </p>
                    <p className="text-[11px] text-stone-600">
                      📚 <strong>Bài học:</strong> {currentTypingWord.unitTitle}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setTypingShowHint(true)}
                    className="text-[11px] text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Khó quá? Xem giải thích &amp; Nghĩa
                  </button>
                )}
              </div>

              {/* Input Form */}
              <div className="w-full max-w-md space-y-2">
                <div className="relative">
                  <input
                    ref={typingInputRef}
                    type="text"
                    value={typingInput}
                    onChange={(e) => setTypingInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (typingFeedback === 'none') {
                          handleCheckTyping();
                        } else if (typingFeedback === 'wrong') {
                          handleNextTypingWord();
                        }
                      }
                    }}
                    disabled={typingFeedback === 'correct'}
                    placeholder="Gõ Romaji (vd: watashi) hoặc Hiragana..."
                    className={`w-full py-3.5 px-4 pr-12 rounded-2xl text-center text-base sm:text-lg font-bold outline-none transition-all shadow-inner border-2 ${
                      typingFeedback === 'correct'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : typingFeedback === 'wrong'
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-[#cbd5e1] bg-white text-[#143521] focus:border-[#22c55e]'
                    }`}
                  />
                  <button
                    onClick={typingFeedback === 'wrong' ? handleNextTypingWord : handleCheckTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#22c55e] text-white flex items-center justify-center hover:bg-[#15803d] transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Feedback Message */}
                {typingFeedback === 'correct' && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-600 animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chính xác tuyệt đối! ({currentTypingWord.word} • {currentTypingWord.kana})</span>
                  </div>
                )}

                {typingFeedback === 'wrong' && (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-red-50 border-2 border-red-200 text-xs text-red-700 animate-shake text-left shadow-xs">
                    <div className="font-bold flex items-center gap-1.5 text-red-800">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Chưa chính xác! Xem giải thích chi tiết:</span>
                    </div>
                    <div className="space-y-1 bg-white/90 p-2.5 rounded-xl border border-red-200">
                      <p>
                        🇻🇳 <strong>Nghĩa tiếng Việt:</strong>{' '}
                        <span className="font-black text-red-800">{currentTypingWord.meaning}</span>
                      </p>
                      <p>
                        ✅ <strong>Cách gõ chuẩn:</strong>{' '}
                        <span className="font-black font-mono text-emerald-700">{currentTypingWord.kana}</span> ({currentTypingWord.romaji})
                      </p>
                      <p>
                        📚 <strong>Từ vựng:</strong> {currentTypingWord.word} • {currentTypingWord.unitTitle}
                      </p>
                    </div>
                    <button
                      onClick={handleNextTypingWord}
                      className="w-full mt-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                    >
                      <span>Đã hiểu, sang từ tiếp theo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Skip / Hint */}
              <div className="flex items-center justify-between w-full pt-2">
                <button
                  onClick={handleSkipTyping}
                  className="text-xs text-[#718777] hover:text-red-600 font-bold cursor-pointer"
                >
                  Bỏ qua từ này
                </button>
                <span className="text-[11px] text-[#718777]">
                  Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white border text-[10px] font-mono">Enter ⏎</kbd> để kiểm tra
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Typing Completed Screen */}
      {currentMode === 'typing' && typingFinished && (
        <div className="rounded-[2.2rem] bg-gradient-to-br from-[#f8f5ea] to-[#eee5d3] border-2 border-[#e4dac3] p-6 text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 text-3xl flex items-center justify-center mx-auto shadow-md">
            ⌨️
          </div>
          <h2 className="text-xl font-black text-[#143521]">Hoàn Thành Phiên Luyện Gõ!</h2>
          <p className="text-xs text-[#597361] max-w-xs mx-auto">
            Đại Thánh đã hoàn thành tất cả {activeDeck.length} từ vựng với tốc độ gõ xuất sắc.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="bg-white rounded-2xl p-3 border border-emerald-200">
              <span className="text-[10px] text-[#718777] block font-bold">Chính xác</span>
              <span className="text-xl font-black text-emerald-600">{typingCorrectCount}</span>
            </div>
            <div className="bg-white rounded-2xl p-3 border border-red-200">
              <span className="text-[10px] text-[#718777] block font-bold">Cần ôn lại</span>
              <span className="text-xl font-black text-red-600">{typingWrongCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleStartTyping(selectedUnitId)}
              className="btn-3d-green px-5 py-2.5 rounded-full text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" /> Luyện gõ lại
            </button>
            <button
              onClick={() => setCurrentMode('dashboard')}
              className="px-5 py-2.5 rounded-full bg-white border border-[#cbd5e1] text-[#143521] text-xs font-black hover:bg-stone-50 cursor-pointer"
            >
              Về danh sách
            </button>
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 4. EXAM ACTIVE MODE (Mục Thi Sát Hạch)                          */}
      {/* =============================================================== */}
      {currentMode === 'exam' && !examFinished && currentExamQuestion && (
        <div className="space-y-4 animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => {
                if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                setCurrentMode('dashboard');
              }}
              className="text-red-600 font-black flex items-center gap-1 hover:underline cursor-pointer"
            >
              ← Hủy thi
            </button>
            <div className="flex items-center gap-2">
              {/* Live Timer Pill */}
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border ${
                  examTimer <= 5
                    ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>{examTimer}s</span>
              </div>
              <span className="font-bold text-[#718777]">
                Câu {examCurrentIndex + 1} / {examQuestions.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#e2ede0] overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((examCurrentIndex + 1) / examQuestions.length) * 100)}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="rounded-[2.2rem] bg-gradient-to-br from-[#fffdfa] via-[#fbf7ee] to-[#f4ede0] border-2 border-[#e6dbc6] p-5 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider">
                📝 {currentExamQuestion.titleBadge}
              </span>
              <span className="text-[10px] font-mono text-[#718777]">
                {currentExamQuestion.word.unitTag}
              </span>
            </div>

            {/* Prompt */}
            <div className="text-center py-2 space-y-1">
              {currentExamQuestion.type === 'audio_to_word' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => sound.speakJapanese(currentExamQuestion.word.word)}
                    className="w-16 h-16 rounded-full bg-[#22c55e] hover:bg-[#15803d] text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform mx-auto cursor-pointer"
                  >
                    <Volume2 className="w-8 h-8" />
                  </button>
                  <p className="text-xs font-bold text-[#143521]">Bấm vào loa để nghe từ</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#143521] jp-font">
                    {currentExamQuestion.prompt}
                  </h2>
                  {currentExamQuestion.subPrompt && (
                    <p className="text-xs text-[#718777] font-medium">
                      {currentExamQuestion.subPrompt}
                    </p>
                  )}
                </>
              )}

              {/* Nút "Khó quá? Xem giải thích & Nghĩa tiếng Việt" */}
              <div className="pt-2">
                {examShowHelp ? (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-left space-y-1.5 animate-in fade-in duration-200 shadow-2xs max-w-md mx-auto">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Giải thích chi tiết (Trợ giúp):</span>
                    </div>
                    <div className="text-xs text-stone-700 space-y-1 pl-5">
                      <p>
                        🇻🇳 <strong>Nghĩa tiếng Việt:</strong>{' '}
                        <span className="text-amber-900 font-black">{currentExamQuestion.word.meaning}</span>
                      </p>
                      <p>
                        📖 <strong>Cách đọc:</strong> {currentExamQuestion.word.kana} ({currentExamQuestion.word.romaji})
                      </p>
                      <p>
                        📚 <strong>Bài học:</strong> {currentExamQuestion.word.unitTitle} ({currentExamQuestion.word.unitTag})
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setExamShowHelp(true)}
                    className="text-[11px] text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Khó quá? Xem giải thích &amp; Nghĩa
                  </button>
                )}
              </div>
            </div>

            {/* Multiple Choice Options (ALL JAPANESE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {currentExamQuestion.options.map((opt, idx) => {
                const label = ['A', 'B', 'C', 'D'][idx];
                const isSelected = selectedExamOption === opt.text;
                const isCorrect = opt.text === currentExamQuestion.correctAnswer;
                const showResult = selectedExamOption !== null;

                let btnStyle = 'bg-white border-[#d2ded0] text-[#143521] hover:border-[#22c55e]';
                if (showResult) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-100 border-red-500 text-red-900';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleExamOptionClick(opt.text)}
                    disabled={selectedExamOption !== null || examWrongExplanation !== null}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold transition-all shadow-xs flex items-center gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-stone-100 text-[#143521] flex items-center justify-center text-xs font-black shrink-0">
                      {label}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm block truncate jp-font">{opt.text}</span>
                      {opt.sub && (
                        <span className="text-[10px] text-[#718777] block font-mono">
                          {opt.sub}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* BẢNG GIẢI THÍCH SHOW LÊN KHI TRẢ LỜI SAI HOẶC HẾT GIỜ */}
            {examWrongExplanation && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-left space-y-2.5 animate-in fade-in duration-200 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-black text-red-700">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>Chưa chính xác! Xem giải thích bên dưới:</span>
                </div>
                <div className="text-xs text-stone-800 space-y-1.5 pl-3 sm:pl-5 bg-white/90 p-3 rounded-xl border border-red-200">
                  <p>
                    🇻🇳 <strong>Nghĩa tiếng Việt:</strong>{' '}
                    <span className="text-red-700 font-black text-sm">{examWrongExplanation.meaningVi}</span>
                  </p>
                  <p>
                    ✅ <strong>Đáp án đúng:</strong>{' '}
                    <span className="text-emerald-700 font-black text-sm">{examWrongExplanation.correctChoice}</span>
                  </p>
                  <p>
                    📖 <strong>Từ vựng:</strong> {examWrongExplanation.wordText} • {examWrongExplanation.kanaText} ({examWrongExplanation.romajiText})
                  </p>
                  <p>
                    📚 <strong>Bài học:</strong> {examWrongExplanation.unitTitle}
                  </p>
                </div>
                <button
                  onClick={handleAdvanceExamQuestion}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <span>Đã hiểu, sang câu tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exam Result Screen */}
      {currentMode === 'exam' && examFinished && (
        <div className="rounded-[2.2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f7f2e5] to-[#eee5d3] border-2 border-[#e4dac3] p-6 text-center space-y-4 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center mx-auto shadow-lg text-4xl">
            {examScore >= 80 ? '🏆' : '📜'}
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                examScore >= 80 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {examScore >= 80 ? 'ĐẠT CHUẨN (合格)' : 'CHƯA ĐẠT (不合格)'}
            </span>
            <h2 className="text-2xl font-black text-[#143521] mt-2">
              Điểm Thi: {examScore} / 100
            </h2>
            <p className="text-xs text-[#597361] mt-0.5">
              Đúng {examCorrectCount} / {examQuestions.length} câu • Chuẩn đậu: 80%
            </p>
          </div>

          {/* Detailed Question Review */}
          <div className="text-left bg-white rounded-2xl p-3 border border-[#d2ded0] max-h-60 overflow-y-auto space-y-2">
            <span className="text-[10px] font-black uppercase text-[#889e8f] tracking-wider block">
              Chi tiết câu trả lời
            </span>
            {examQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                  q.isCorrect ? 'bg-emerald-50/70 border-emerald-200' : 'bg-red-50/70 border-red-200'
                }`}
              >
                <div className="min-w-0">
                  <span className="font-bold text-[#143521] block truncate">
                    {idx + 1}. {q.prompt}
                  </span>
                  <span className="text-[10px] text-[#718777]">
                    Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong>
                  </span>
                </div>
                <span className={`text-xs font-black shrink-0 ml-2 ${q.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                  {q.isCorrect ? '✓ Đúng' : '✗ Sai'}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleStartExam(selectedUnitId)}
              className="btn-3d-green px-5 py-2.5 rounded-full text-white text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" /> Thi lại đề mới
            </button>
            <button
              onClick={() => setCurrentMode('dashboard')}
              className="px-5 py-2.5 rounded-full bg-white border border-[#cbd5e1] text-[#143521] text-xs font-black hover:bg-stone-50 cursor-pointer"
            >
              Về danh sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
