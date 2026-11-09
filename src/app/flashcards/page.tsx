'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { dataset, VocabWord } from '@/lib/dataset';
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
  Award,
  HelpCircle,
  Send,
  RefreshCw,
  Flame,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

type StudyMode = 'dashboard' | 'flashcard' | 'typing' | 'exam';
type MainTab = 'flashcard' | 'typing' | 'exam';

interface ExamQuestion {
  id: string;
  word: VocabWord;
  type: 'meaning_to_word' | 'word_to_meaning' | 'audio_to_meaning';
  titleBadge: string;
  prompt: string;
  subPrompt?: string;
  options: { id: string; text: string; sub?: string }[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export default function FlashcardsPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('flashcard');
  const [currentMode, setCurrentMode] = useState<StudyMode>('dashboard');
  const [selectedLevel, setSelectedLevel] = useState<'jpd113' | 'jpd123' | 'jpd133'>('jpd113');
  const [selectedUnitId, setSelectedUnitId] = useState<string | 'all'>('all');
  const [isShuffled, setIsShuffled] = useState(false);

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
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active deck calculation
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

  // Current cards for active modes
  const currentFlashcard = activeDeck[flashcardIndex] || activeDeck[0];
  const currentTypingWord = activeDeck[typingIndex] || activeDeck[0];
  const currentExamQuestion = examQuestions[examCurrentIndex];

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

  // ===================== HANDLERS: START SESSIONS ====================

  // 1. Start Flashcard Study
  const handleStartFlashcard = (unitId: string | 'all' = 'all') => {
    sound.playTap();
    setSelectedUnitId(unitId);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
    setReviewCount(0);
    setCurrentMode('flashcard');
  };

  // 2. Start Typing Practice
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

  // 3. Start Exam & Test Mode
  const handleStartExam = (unitId: string | 'all' = 'all') => {
    sound.playTap();
    setSelectedUnitId(unitId);

    // Build question pool
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

      const qTypes: ('meaning_to_word' | 'word_to_meaning' | 'audio_to_meaning')[] = [
        'meaning_to_word',
        'word_to_meaning',
        'audio_to_meaning'
      ];
      const qType = qTypes[idx % qTypes.length];

      if (qType === 'meaning_to_word') {
        const options = [
          { id: 'correct', text: word.word, sub: word.kana },
          ...distractors.map((d, i) => ({ id: `d_${i}`, text: d.word, sub: d.kana }))
        ].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          word,
          type: qType,
          titleBadge: 'CHỌN TỪ TIẾNG NHẬT',
          prompt: word.meaning,
          subPrompt: 'Chọn chữ Kanji / cách viết tiếng Nhật tương ứng',
          options,
          correctAnswer: word.word
        };
      } else if (qType === 'word_to_meaning') {
        const options = [
          { id: 'correct', text: word.meaning },
          ...distractors.map((d, i) => ({ id: `d_${i}`, text: d.meaning }))
        ].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          word,
          type: qType,
          titleBadge: 'DỊCH NGHĨA TỪ VỰNG',
          prompt: word.word,
          subPrompt: `${word.kana} ${word.romaji ? `(${word.romaji})` : ''}`,
          options,
          correctAnswer: word.meaning
        };
      } else {
        const options = [
          { id: 'correct', text: word.meaning },
          ...distractors.map((d, i) => ({ id: `d_${i}`, text: d.meaning }))
        ].sort(() => 0.5 - Math.random());

        return {
          id: `q-${idx}`,
          word,
          type: qType,
          titleBadge: 'NGHE PHÁT ÂM & CHỌN NGHĨA',
          prompt: '🔊 Bấm nghe phát âm',
          subPrompt: 'Lắng nghe phát âm và chọn nghĩa tiếng Việt chính xác',
          options,
          correctAnswer: word.meaning
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
    setCurrentMode('exam');
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

      // Auto advance next after 800ms
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

  // ===================== EXAM & TEST ACTIONS =========================
  const handleExamOptionClick = (optionText: string) => {
    if (selectedExamOption !== null || !currentExamQuestion) return;

    setSelectedExamOption(optionText);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const isCorrect = optionText === currentExamQuestion.correctAnswer;
    currentExamQuestion.userAnswer = optionText;
    currentExamQuestion.isCorrect = isCorrect;

    if (isCorrect) {
      sound.playCorrect();
      setExamCorrectCount(prev => prev + 1);
    } else {
      sound.playWrong();
    }

    // Auto next after 1.2s
    setTimeout(() => {
      if (examCurrentIndex + 1 < examQuestions.length) {
        setExamCurrentIndex(prev => prev + 1);
        setSelectedExamOption(null);
      } else {
        finishExam();
      }
    }, 1200);
  };

  const handleExamTimeout = () => {
    if (selectedExamOption !== null || !currentExamQuestion) return;

    sound.playWrong();
    currentExamQuestion.userAnswer = '(Hết giờ)';
    currentExamQuestion.isCorrect = false;
    setSelectedExamOption('(Hết giờ)');

    setTimeout(() => {
      if (examCurrentIndex + 1 < examQuestions.length) {
        setExamCurrentIndex(prev => prev + 1);
        setSelectedExamOption(null);
      } else {
        finishExam();
      }
    }, 1000);
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
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521]">Luyện Từ Vựng JPD</h1>
        <div className="flex items-center gap-1.5">
          <Link
            href="/tien-do"
            className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs shadow-sm hover:scale-105 transition-transform"
            title="Xem bảng tiến độ"
          >
            <BarChart2 className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs shadow-sm transition-all ${
              isShuffled ? 'bg-[#22c55e] text-white border-[#22c55e]' : 'bg-white text-stone-700 border-stone-300'
            }`}
            title="Xáo trộn ngẫu nhiên thẻ"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 1. DASHBOARD VIEW (When not in any active study session)         */}
      {/* =============================================================== */}
      {currentMode === 'dashboard' && (
        <>
          {/* Main 3-Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#e4ede1] rounded-2xl border border-[#d2ded0]">
            <button
              onClick={() => setActiveTab('flashcard')}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'flashcard'
                  ? 'bg-white text-[#15803d] shadow-sm'
                  : 'text-[#597361] hover:text-[#143521]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Thẻ Lật SRS</span>
            </button>

            <button
              onClick={() => setActiveTab('typing')}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'typing'
                  ? 'bg-white text-[#15803d] shadow-sm'
                  : 'text-[#597361] hover:text-[#143521]'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Luyện Gõ</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'exam'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-[#597361] hover:text-[#143521]'
              }`}
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Thi Thử JPD</span>
            </button>
          </div>

          {/* Hero Banner based on Active Tab */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f5efe2] to-[#ecdfc8] border border-[#e4dac3] p-4 sm:p-5 shadow-[0_8px_20px_rgba(20,53,33,0.06)] space-y-3">
            {/* Mascot Peeking */}
            <div className="absolute top-2 right-4 select-none">
              <div className="w-14 h-14 relative">
                <WukongMascot mood="happy" size="sm" showCloud={false} />
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-wider">
              {activeTab === 'flashcard' && 'CHẾ ĐỘ THẺ LẬT SRS'}
              {activeTab === 'typing' && 'CHẾ ĐỘ LUYỆN GÕ TỪ VỰNG'}
              {activeTab === 'exam' && 'KỲ THI SÁT HẠCH TỪ VỰNG'}
            </span>

            <div>
              <h2 className="text-lg font-black text-[#2e1d0f]">
                {activeTab === 'flashcard' && `${levelWords.length} Thẻ Từ Vựng ${selectedLevel.toUpperCase()}`}
                {activeTab === 'typing' && `Luyện Gõ Siêu Tốc ${selectedLevel.toUpperCase()}`}
                {activeTab === 'exam' && `Thi Sát Hạch ${selectedLevel.toUpperCase()} Chuẩn JPD`}
              </h2>
              <p className="text-xs text-[#ea580c] font-bold mt-0.5 flex items-center gap-1">
                {activeTab === 'flashcard' && '🔥 Chuỗi học 7 ngày liên tiếp • Lật thẻ ghi nhớ SRS'}
                {activeTab === 'typing' && '⌨️ Gõ Romaji hoặc Kana để tăng tốc độ phản xạ và chính tả'}
                {activeTab === 'exam' && '📝 15 câu hỏi trắc nghiệm & nghe chuẩn format thi JPD'}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">⏰ Đến hạn</span>
                <span className="text-base font-black text-[#143521]">12</span>
              </div>
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">🆕 Thẻ mới</span>
                <span className="text-base font-black text-[#143521]">{levelWords.length}</span>
              </div>
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">🔄 Đang học</span>
                <span className="text-base font-black text-[#143521]">35</span>
              </div>
              <div className="bg-white rounded-2xl p-2.5 text-center shadow-xs">
                <span className="text-[10px] text-[#718777] block font-bold">✅ Đã nhớ</span>
                <span className="text-base font-black text-[#143521]">84</span>
              </div>
            </div>

            {/* Big Action Button for Selected Mode */}
            {activeTab === 'flashcard' && (
              <button
                onClick={() => handleStartFlashcard('all')}
                className="btn-3d-green w-full py-3.5 rounded-2xl text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                Học Toàn Bộ Thẻ {selectedLevel.toUpperCase()} ({levelWords.length} từ)
              </button>
            )}

            {activeTab === 'typing' && (
              <button
                onClick={() => handleStartTyping('all')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 active:scale-98 transition-all cursor-pointer"
              >
                <Keyboard className="w-4 h-4" />
                Bắt Đầu Luyện Gõ {selectedLevel.toUpperCase()} ({levelWords.length} từ)
              </button>
            )}

            {activeTab === 'exam' && (
              <button
                onClick={() => handleStartExam('all')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-98 transition-all cursor-pointer"
              >
                <FileQuestion className="w-4 h-4" />
                Vào Thi Thử Sát Hạch {selectedLevel.toUpperCase()} (15 Câu)
              </button>
            )}
          </div>

          {/* Course Level Pills (JPD113, JPD123, JPD133) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { key: 'jpd113', label: 'JPD113 (Nhật 1 - Sơ Cấp)', count: dataset.words.filter(w => w.course === 'jpd113').length },
              { key: 'jpd123', label: 'JPD123 (Nhật 2 - Trung Cấp)', count: dataset.words.filter(w => w.course === 'jpd123').length },
              { key: 'jpd133', label: 'JPD133 (Nhật 3 - Cao Cấp)', count: dataset.words.filter(w => w.course === 'jpd133').length }
            ].map(lvl => (
              <button
                key={lvl.key}
                onClick={() => {
                  setSelectedLevel(lvl.key as any);
                  setSelectedUnitId('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedLevel === lvl.key
                    ? 'bg-[#22c55e] text-white shadow-md'
                    : 'bg-white text-[#718777] border border-[#e2ece0] hover:border-[#22c55e]'
                }`}
              >
                <span>{lvl.label}</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedLevel === lvl.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  {lvl.count}
                </span>
              </button>
            ))}
          </div>

          {/* Header of Lesson List */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 font-bold text-[#143521]">
              <span>🐒</span>
              <span className="font-black">
                {selectedLevel.toUpperCase()} • Đầy đủ {levelUnits.length} Bài học ({levelWords.length} từ)
              </span>
            </div>
            <span className="text-[#718777] text-[11px]">
              Chọn bài để học thẻ, luyện gõ hoặc thi
            </span>
          </div>

          {/* Unit List with 3 Action Buttons (Học Thẻ, Gõ Phím, Thi Thử) */}
          <div className="space-y-2.5">
            {levelUnits.map((unit) => {
              const unitWordsCount = dataset.words.filter(w => w.unitId === unit.id).length;

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_12px_rgba(20,53,33,0.03)] hover:border-[#22c55e] transition-all"
                >
                  {/* Left: Unit Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0 font-mono shadow-2xs">
                      {unit.tag}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-[#143521] truncate">
                        {unit.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold text-[#15803d]">
                          {unitWordsCount} thẻ từ vựng
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase">
                          Chuẩn JPD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 3 Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {/* 1. Flashcard Study Button */}
                    <button
                      onClick={() => handleStartFlashcard(unit.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Học Thẻ Flashcard Lật"
                    >
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Học Thẻ</span>
                    </button>

                    {/* 2. Typing Practice Button */}
                    <button
                      onClick={() => handleStartTyping(unit.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Luyện Gõ Từ Vựng"
                    >
                      <Keyboard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Luyện Gõ</span>
                    </button>

                    {/* 3. Exam Test Button */}
                    <button
                      onClick={() => handleStartExam(unit.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-black flex items-center gap-1 shadow-2xs active:scale-95 transition-all cursor-pointer"
                      title="Thi Thử Sát Hạch Bài Này"
                    >
                      <FileQuestion className="w-3.5 h-3.5 text-rose-600" />
                      <span>Thi</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
      {/* 3. TYPING PRACTICE ACTIVE MODE (Nút Luyện Gõ)                   */}
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

              {/* Prompt Meaning */}
              <div className="space-y-1 my-auto">
                <span className="text-[11px] font-bold text-[#8c6753] uppercase tracking-wider block">
                  Hãy gõ tiếng Nhật cho nghĩa này:
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#143521]">
                  {currentTypingWord.meaning}
                </h2>

                {/* Hint toggle */}
                {typingShowHint ? (
                  <div className="pt-2 animate-fade-in">
                    <span className="px-3 py-1 rounded-xl bg-white border border-amber-200 text-xs font-mono font-bold text-amber-700">
                      Gợi ý: {currentTypingWord.kana} ({currentTypingWord.romaji})
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setTypingShowHint(true)}
                    className="text-[11px] text-[#718777] hover:text-[#15803d] underline pt-1 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" /> Xem gợi ý
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
                  <div className="space-y-1 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 animate-shake">
                    <div className="font-bold flex items-center justify-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Chưa chính xác!
                    </div>
                    <div>
                      Đáp án đúng:{' '}
                      <span className="font-black text-red-800">
                        {currentTypingWord.word} ({currentTypingWord.kana} - {currentTypingWord.romaji})
                      </span>
                    </div>
                    <button
                      onClick={handleNextTypingWord}
                      className="mt-1 px-3 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 cursor-pointer"
                    >
                      Đã hiểu, sang từ tiếp theo &gt;
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
      {/* 4. EXAM & TEST ACTIVE MODE (Mục Thi Sát Hạch)                    */}
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
              {currentExamQuestion.type === 'audio_to_meaning' ? (
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
            </div>

            {/* Multiple Choice Options */}
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
                    disabled={selectedExamOption !== null}
                    className={`p-3.5 rounded-2xl border-2 text-left font-bold transition-all shadow-xs flex items-center gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-xl bg-stone-100 text-[#143521] flex items-center justify-center text-xs font-black shrink-0">
                      {label}
                    </span>
                    <div className="min-w-0">
                      <span className="text-sm block truncate">{opt.text}</span>
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
