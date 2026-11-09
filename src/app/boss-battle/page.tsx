'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { dataset, BossItem, VocabWord, KanjiItem, SentenceItem, ExamQuestionItem } from '@/lib/dataset';
import { WukongMascot, WukongMood } from '@/components/WukongMascot';
import { sound } from '@/lib/sound';
import confetti from 'canvas-confetti';
import {
  Swords,
  Volume2,
  Shield,
  Heart,
  Flame,
  Trophy,
  ArrowLeft,
  RotateCcw,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Undo2,
  Check,
  Headphones,
  Image as ImageIcon,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

interface MCQQuestion {
  type: 'vocab' | 'kanji' | 'image' | 'listening_oral';
  titleBadge: string;
  prompt: string;
  subPrompt?: string;
  correctAnswer: string;
  correctWord: string;
  picId?: string;
  trap?: string;
  options: { id: string; main: string; sub?: string }[];
  explanation?: string;
  meaningVi?: string;
}

export default function BossBattlePage() {
  const [selectedTier, setSelectedTier] = useState<'sơ cấp' | 'trung cấp' | 'cao cấp'>('sơ cấp');
  const [selectedBossId, setSelectedBossId] = useState<string>('boss-jpd113-1');

  // Filter bosses by active tier
  const tierBosses = useMemo(() => {
    return dataset.bosses.filter(b => b.tier === selectedTier);
  }, [selectedTier]);

  const boss = useMemo(() => {
    return dataset.bosses.find(b => b.id === selectedBossId) || tierBosses[0] || dataset.bosses[0];
  }, [selectedBossId, tierBosses]);

  // Keep selected boss in sync when tier changes
  useEffect(() => {
    if (tierBosses.length > 0 && !tierBosses.some(b => b.id === selectedBossId)) {
      setSelectedBossId(tierBosses[0].id);
    }
  }, [selectedTier, tierBosses, selectedBossId]);

  // Battle State
  const [bossHp, setBossHp] = useState(boss.maxHp);
  const [playerHp, setPlayerHp] = useState(100);
  const [combo, setCombo] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wukongMood, setWukongMood] = useState<WukongMood>('idle');
  const [bossHurt, setBossHurt] = useState(false);
  const [playerHurt, setPlayerHurt] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [lastDamage, setLastDamage] = useState<number>(25);

  // MCQ state
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecking, setIsAnswerChecking] = useState(false);
  const [showTrapHint, setShowTrapHint] = useState(false);
  const [showBossHelp, setShowBossHelp] = useState(false);
  const [bossWrongExplanation, setBossWrongExplanation] = useState<{
    meaningVi: string;
    correctAnswer: string;
    explanation: string;
  } | null>(null);

  // Sentence Scramble state for final bosses
  const [sentenceQuestions, setSentenceQuestions] = useState<SentenceItem[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const isSentenceMode = boss.questionType === 'sentence_scramble' || boss.isFinalBoss;

  // Initialize questions whenever the active boss changes
  useEffect(() => {
    setBossHp(boss.maxHp);
    setPlayerHp(100);
    setCombo(0);
    setQuestionIndex(0);
    setCorrectCount(0);
    setBattleOutcome('playing');
    setSelectedAnswer(null);
    setIsAnswerChecking(false);
    setShowTrapHint(false);
    setShowHint(false);

    if (isSentenceMode) {
      // Load sentence questions for this course
      const sList = dataset.sentences.filter(s => s.course === boss.course);
      const chosen = sList.length > 0 ? sList : dataset.sentences.slice(0, 5);
      setSentenceQuestions(chosen);
      if (chosen[0]) {
        setSelectedTokens([]);
        setAvailableTokens([...chosen[0].scrambled]);
      }
    } else if (boss.questionType === 'kanji') {
      // Kanji MCQs
      const courseKanji = dataset.kanji.filter(k => !k.course || k.course === boss.course);
      const pool = courseKanji.length >= 4 ? courseKanji : dataset.kanji;
      const generated: MCQQuestion[] = [];

      for (let i = 0; i < boss.totalQuestions; i++) {
        const correct = pool[i % pool.length];
        const wrongs = pool.filter(k => k.kanji !== correct.kanji).sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [correct, ...wrongs].sort(() => 0.5 - Math.random()).map(k => ({
          id: k.kanji,
          main: k.kunyomi || k.onyomi,
          sub: k.kanji
        }));

        generated.push({
          type: 'kanji',
          titleBadge: 'CHỮ HÁN KANJI',
          prompt: `「${correct.kanji}」の正しい読み方はどれですか？`,
          subPrompt: '正しいひらがな・読み方を選んでください',
          correctAnswer: correct.kanji,
          correctWord: `${correct.kanji} (${correct.kunyomi || correct.onyomi})`,
          meaningVi: correct.meaning,
          explanation: `Chữ Hán 「${correct.kanji}」 (Hán-Việt: ${correct.hanViet}) có nghĩa là: "${correct.meaning}". Cách đọc chuẩn: ${correct.kunyomi || correct.onyomi}.`,
          options
        });
      }
      setMcqQuestions(generated);
    } else {
      // Vocabulary & Exam (Image + Listening/Oral) Mix Mode!
      // 1. Identify current unit and bai number
      let baiNumber = '1';
      if (boss.unitId) {
        const match = boss.unitId.match(/v(\d+)/);
        if (match) baiNumber = match[1];
      }

      // 2. Fetch authentic unit vocabulary
      const courseWords = dataset.words.filter(w => w.course === boss.course);
      let unitPool = courseWords;
      if (boss.unitId && boss.unitId !== `${boss.course}-all` && boss.unitId !== `${boss.course}-sentence`) {
        const filtered = dataset.words.filter(w => w.unitId === boss.unitId);
        if (filtered.length >= 2) {
          unitPool = filtered;
        }
      }

      // 3. Fetch authentic exam questions from on-thi-noijpd
      const courseExam = dataset.examQuestions.filter(q => q.course === boss.course);
      const baiExam = boss.unitId === `${boss.course}-all`
        ? courseExam
        : courseExam.filter(q => q.bai === baiNumber);

      const imagePool = (baiExam.filter(q => q.kind === 'image').length > 0
        ? baiExam.filter(q => q.kind === 'image')
        : courseExam.filter(q => q.kind === 'image')
      ).sort(() => 0.5 - Math.random());

      const oralPool = (baiExam.filter(q => q.kind === 'listening_oral').length > 0
        ? baiExam.filter(q => q.kind === 'listening_oral')
        : courseExam.filter(q => q.kind === 'listening_oral')
      ).sort(() => 0.5 - Math.random());

      const generated: MCQQuestion[] = [];
      const totalTarget = boss.totalQuestions || 8;

      // Helper to sanitize circular placeholders like 'わたしは○○です。'
      const sanitizeAnswer = (ans: string) => ans.replace(/○○/g, 'ゴクウ');

      // A. Create 1-2 Image Questions if available
      const imageCount = Math.min(imagePool.length, 2);
      for (let i = 0; i < imageCount; i++) {
        const eq = imagePool[i];
        const correctAns = sanitizeAnswer(eq.correctAnswer);
        const correctMeaning = eq.correctMeaning || 'Câu trả lời chính xác';

        // Distractors from other exam questions (No Vietnamese leak in options!)
        const seen = new Set([correctAns]);
        const distractors: { id: string; main: string }[] = [];
        const candidatePool = [...courseExam].sort(() => 0.5 - Math.random());

        for (const c of candidatePool) {
          const ansClean = sanitizeAnswer(c.correctAnswer);
          if (ansClean && !seen.has(ansClean)) {
            seen.add(ansClean);
            distractors.push({
              id: ansClean,
              main: ansClean
            });
            if (distractors.length >= 3) break;
          }
        }

        const options = [
          { id: correctAns, main: correctAns },
          ...distractors
        ].sort(() => 0.5 - Math.random());

        generated.push({
          type: 'image',
          titleBadge: `ẢI THỰC CHIẾN • HỎI ĐÁP HÌNH ẢNH (BÀI ${eq.bai})`,
          prompt: eq.questionJp,
          subPrompt: '画像を見て、最も適切な日本語を選んでください',
          correctAnswer: correctAns,
          correctWord: eq.questionJp,
          picId: eq.picId,
          trap: eq.trap,
          meaningVi: eq.meaningVi,
          explanation: `Câu hỏi tiếng Nhật: ${eq.questionJp}\n🇻🇳 Nghĩa: "${eq.meaningVi}"\n✅ Đáp án chuẩn: ${correctAns} (${correctMeaning})${eq.hint ? `\n💡 Gợi ý: ${eq.hint}` : ''}`,
          options
        });
      }

      // B. Create 1-2 Listening / Oral Questions if available
      const oralCount = Math.min(oralPool.length, 2);
      for (let i = 0; i < oralCount; i++) {
        const eq = oralPool[i];
        const correctAns = sanitizeAnswer(eq.correctAnswer);
        const correctMeaning = eq.correctMeaning || 'Câu trả lời chuẩn';

        const seen = new Set([correctAns]);
        const distractors: { id: string; main: string }[] = [];
        const candidatePool = [...courseExam].sort(() => 0.5 - Math.random());

        for (const c of candidatePool) {
          const ansClean = sanitizeAnswer(c.correctAnswer);
          if (ansClean && !seen.has(ansClean)) {
            seen.add(ansClean);
            distractors.push({
              id: ansClean,
              main: ansClean
            });
            if (distractors.length >= 3) break;
          }
        }

        const options = [
          { id: correctAns, main: correctAns },
          ...distractors
        ].sort(() => 0.5 - Math.random());

        generated.push({
          type: 'listening_oral',
          titleBadge: `ẢI THỰC CHIẾN • PHẢN XẠ VẤN ĐÁP (BÀI ${eq.bai})`,
          prompt: eq.questionJp,
          subPrompt: '音声を聞いて、最も適切な返答を選んでください',
          correctAnswer: correctAns,
          correctWord: eq.questionJp,
          trap: eq.hint || eq.trap,
          meaningVi: eq.meaningVi,
          explanation: `Câu hỏi phản xạ: ${eq.questionJp}\n🇻🇳 Nghĩa: "${eq.meaningVi}"\n✅ Đáp án chuẩn: ${correctAns} (${correctMeaning})${eq.hint ? `\n💡 Ngữ cảnh: ${eq.hint}` : ''}`,
          options
        });
      }

      // C. Fill remaining slots with Authentic Vocabulary Questions of the unit
      const vocabNeeded = Math.max(1, totalTarget - generated.length);
      const shuffledUnitPool = [...unitPool].sort(() => 0.5 - Math.random());

      for (let i = 0; i < vocabNeeded; i++) {
        const correct = shuffledUnitPool[i % shuffledUnitPool.length];
        const wrongs = courseWords
          .filter(w => w.id !== correct.id && w.word !== correct.word && w.kana !== correct.kana)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const hasKanji = Boolean(correct.kana && correct.kana !== correct.word);
        const isKanjiToKana = hasKanji && i % 2 === 0;

        let prompt = '';
        let subPrompt = '';
        let options: { id: string; main: string; sub?: string }[] = [];

        if (isKanjiToKana) {
          // Kanji -> Hiragana reading
          prompt = `「${correct.word}」の正しい読み方はどれですか？`;
          subPrompt = '正しいひらがな・読み方を選んでください';
          options = [correct, ...wrongs].sort(() => 0.5 - Math.random()).map(w => ({
            id: w.id,
            main: w.kana
          }));
        } else if (hasKanji) {
          // Hiragana -> Kanji representation
          prompt = `「${correct.kana}」の正しい表記・漢字はどれですか？`;
          subPrompt = '正しい漢字・表記を選んでください';
          options = [correct, ...wrongs].sort(() => 0.5 - Math.random()).map(w => ({
            id: w.id,
            main: w.word
          }));
        } else {
          // Kana-only word -> Word recognition
          prompt = `「${correct.word}」`;
          subPrompt = '正しい単語を選んでください';
          options = [correct, ...wrongs].sort(() => 0.5 - Math.random()).map(w => ({
            id: w.id,
            main: w.word
          }));
        }

        generated.push({
          type: 'vocab',
          titleBadge: correct.unitTitle ? `TỪ VỰNG: ${correct.unitTitle.toUpperCase()}` : 'TỪ VỰNG TIẾNG NHẬT',
          prompt,
          subPrompt,
          correctAnswer: correct.id,
          correctWord: correct.word,
          meaningVi: correct.meaning,
          explanation: `Từ vựng: 「${correct.word}」 【${correct.kana}】 (${correct.romaji})\n🇻🇳 Nghĩa tiếng Việt: "${correct.meaning}"\nBài học: ${correct.unitTitle || 'JPD'} (${correct.unitTag || 'JPD'})`,
          options
        });
      }

      // Shuffle entire generated set so image/listening/vocab appear dynamically!
      const finalQuestions = [...generated].sort(() => 0.5 - Math.random());
      setMcqQuestions(finalQuestions);
    }
  }, [boss.id, isSentenceMode]);

  // Current Question
  const currentMcq = mcqQuestions[questionIndex];
  const currentSentence = sentenceQuestions[questionIndex];

  // Update sentence scramble tokens
  useEffect(() => {
    if (isSentenceMode && currentSentence) {
      setSelectedTokens([]);
      setAvailableTokens([...currentSentence.scrambled]);
      setShowHint(false);
    }
  }, [questionIndex, isSentenceMode, currentSentence]);

  // Trigger audio prompt for listening questions
  const handleListenQuestion = () => {
    if (currentMcq?.correctWord) {
      sound.speakJapanese(currentMcq.correctWord);
    }
  };

  // Handler for MCQ Option Click
  const handleSelectMcq = (optId: string) => {
    if (isAnswerChecking || battleOutcome !== 'playing' || !currentMcq) return;
    setIsAnswerChecking(true);
    setSelectedAnswer(optId);

    const isCorrect = optId === currentMcq.correctAnswer;
    if (!isCorrect && currentMcq.trap) {
      setShowTrapHint(true);
    }
    handleCombatResolution(isCorrect);
  };

  // Handler for Sentence Token Selection
  const handleAddToken = (token: string, idx: number) => {
    sound.playTap();
    setSelectedTokens([...selectedTokens, token]);
    const updated = [...availableTokens];
    updated.splice(idx, 1);
    setAvailableTokens(updated);
  };

  const handleRemoveToken = (token: string, idx: number) => {
    sound.playTap();
    const updatedSelected = [...selectedTokens];
    updatedSelected.splice(idx, 1);
    setSelectedTokens(updatedSelected);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleResetTokens = () => {
    if (!currentSentence) return;
    sound.playTap();
    setSelectedTokens([]);
    setAvailableTokens([...currentSentence.scrambled]);
  };

  // Submit assembled sentence
  const handleSubmitSentence = () => {
    if (!currentSentence || isAnswerChecking) return;
    setIsAnswerChecking(true);

    const assembled = selectedTokens.join('');
    const target = currentSentence.tokens.join('');
    const isCorrect = assembled === target || assembled === currentSentence.jp;

    handleCombatResolution(isCorrect);
  };

  // Common Combat Resolution
  const handleCombatResolution = (isCorrect: boolean) => {
    if (isCorrect) {
      sound.playWukongStrike();
      setWukongMood('attack');
      setBossHurt(true);
      setShowTrapHint(false);
      const newCombo = combo + 1;
      setCombo(newCombo);
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);

      const baseDamage = Math.ceil(boss.maxHp / boss.requiredCorrect);
      const comboBonus = Math.floor(baseDamage * (newCombo * 0.15));
      const totalDamage = baseDamage + comboBonus;
      setLastDamage(totalDamage);
      const newBossHp = Math.max(0, bossHp - totalDamage);
      setBossHp(newBossHp);

      setTimeout(() => {
        setWukongMood('idle');
        setBossHurt(false);
      }, 800);

      // Check Boss Defeat
      if (newBossHp <= 0 || newCorrect >= boss.requiredCorrect) {
        setTimeout(() => {
          setBattleOutcome('victory');
          sound.playVictory();
          confetti({
            particleCount: 140,
            spread: 85,
            origin: { y: 0.6 }
          });
        }, 900);
      } else {
        setTimeout(() => {
          advanceNextQuestion();
        }, 1100);
      }
    } else {
      sound.playWrong();
      setWukongMood('hurt');
      setPlayerHurt(true);
      setCombo(0);
      const newPlayerHp = Math.max(0, playerHp - 25);
      setPlayerHp(newPlayerHp);

      setTimeout(() => {
        setWukongMood('idle');
        setPlayerHurt(false);
      }, 700);

      // Stop & Display comprehensive explanation card for user to review
      if (!isSentenceMode && currentMcq) {
        const correctOpt = currentMcq.options.find(o => o.id === currentMcq.correctAnswer);
        const correctText = correctOpt ? correctOpt.main : currentMcq.correctWord;
        setBossWrongExplanation({
          meaningVi: currentMcq.meaningVi || 'Xem giải thích chi tiết bên dưới',
          correctAnswer: correctText,
          explanation: currentMcq.explanation || `Đáp án chính xác là: ${correctText}`
        });
      } else if (isSentenceMode && currentSentence) {
        setBossWrongExplanation({
          meaningVi: currentSentence.vi,
          correctAnswer: currentSentence.jp,
          explanation: `Cấu trúc câu đúng: 「${currentSentence.jp}」\nCách đọc: ${currentSentence.kana} (${currentSentence.romaji})${currentSentence.hint ? `\n💡 Gợi ý: ${currentSentence.hint}` : ''}`
        });
      }
    }
  };

  const advanceNextQuestion = () => {
    setIsAnswerChecking(false);
    setSelectedAnswer(null);
    setShowTrapHint(false);
    setShowBossHelp(false);
    setBossWrongExplanation(null);
    const maxQ = isSentenceMode ? sentenceQuestions.length : boss.totalQuestions;
    if (questionIndex + 1 < maxQ) {
      setQuestionIndex(prev => prev + 1);
    } else {
      setQuestionIndex(0);
    }
  };

  const handleRestart = () => {
    setBossHp(boss.maxHp);
    setPlayerHp(100);
    setCombo(0);
    setQuestionIndex(0);
    setCorrectCount(0);
    setBattleOutcome('playing');
    setSelectedAnswer(null);
    setIsAnswerChecking(false);
    setShowTrapHint(false);
    setShowHint(false);
    setShowBossHelp(false);
    setBossWrongExplanation(null);
    if (isSentenceMode && sentenceQuestions[0]) {
      setSelectedTokens([]);
      setAvailableTokens([...sentenceQuestions[0].scrambled]);
    }
  };

  // Seamless Instant Progression: "Qua ải 2 chơi luôn"
  const handleNextStage = () => {
    const currentIndex = tierBosses.findIndex(b => b.id === selectedBossId);
    if (currentIndex >= 0 && currentIndex + 1 < tierBosses.length) {
      const nextBoss = tierBosses[currentIndex + 1];
      setSelectedBossId(nextBoss.id);
      setBattleOutcome('playing');
      sound.playTap();
    } else {
      // Completed all bosses of this tier: advance to next tier!
      const tiers: ('sơ cấp' | 'trung cấp' | 'cao cấp')[] = ['sơ cấp', 'trung cấp', 'cao cấp'];
      const currentTierIndex = tiers.indexOf(selectedTier);
      if (currentTierIndex + 1 < tiers.length) {
        const nextTier = tiers[currentTierIndex + 1];
        const nextTierBosses = dataset.bosses.filter(b => b.tier === nextTier);
        if (nextTierBosses.length > 0) {
          setSelectedTier(nextTier);
          setSelectedBossId(nextTierBosses[0].id);
          setBattleOutcome('playing');
          sound.playVictory();
        }
      } else {
        // Grand victory over the entire game!
        setSelectedBossId(tierBosses[0].id);
        setBattleOutcome('playing');
        sound.playVictory();
      }
    }
  };

  const isFinalGameBoss = selectedTier === 'cao cấp' && boss.isFinalBoss;

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Tier Selector: Sơ cấp (JPD1) / Trung cấp (JPD2) / Cao cấp (JPD3) */}
        <div className="flex items-center gap-1 bg-[#e4ede1] p-1 rounded-full text-xs font-black">
          {[
            { key: 'sơ cấp', label: 'SƠ CẤP (JPD1)' },
            { key: 'trung cấp', label: 'TRUNG CẤP (JPD2)' },
            { key: 'cao cấp', label: 'CAO CẤP (JPD3)' }
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setSelectedTier(t.key as any)}
              className={`px-3 py-1 rounded-full transition-all text-[11px] ${
                selectedTier === t.key
                  ? 'bg-white text-[#143521] shadow-sm font-black'
                  : 'text-[#718777] font-semibold hover:text-[#143521]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Boss Selection Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {tierBosses.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBossId(b.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedBossId === b.id
                ? 'bg-stone-900 text-white shadow-md scale-102 ring-2 ring-emerald-500'
                : 'bg-white text-stone-600 border border-[#e2ece0] hover:border-stone-400'
            }`}
          >
            <span>{b.avatar}</span>
            <span>{b.name}</span>
            {b.isFinalBoss && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] uppercase tracking-wider animate-pulse">
                TRÙM CUỐI
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Boss Header & HP Bar */}
      <div className="rounded-2xl bg-stone-900/90 text-white p-3.5 border border-stone-800 shadow-md space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
              Lv. {boss.level}
            </span>
            <div>
              <h2 className="text-base font-extrabold text-amber-100 flex items-center gap-2">
                {boss.name} <span className="text-xs text-stone-400 font-normal jp-font">{boss.japaneseName}</span>
              </h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-stone-300">
              Câu {questionIndex + 1}/{isSentenceMode ? sentenceQuestions.length : boss.totalQuestions} • Cần đúng {boss.requiredCorrect} câu
            </span>
          </div>
        </div>

        {/* Boss HP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-bold text-rose-400">
            <span>Sinh lực Yêu Ma</span>
            <span>{bossHp} / {boss.maxHp} HP</span>
          </div>
          <div className="h-3 rounded-full bg-stone-800 p-0.5 border border-rose-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-300 shadow-md"
              style={{ width: `${Math.max(0, (bossHp / boss.maxHp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Battle Arena Canvas (Mythical Oriental Landscape) */}
      <div className={`relative overflow-hidden rounded-3xl h-64 sm:h-72 border-2 border-amber-900/40 shadow-2xl bg-gradient-to-b ${boss.bgGradient} flex flex-col justify-between p-4 transition-transform ${bossHurt ? 'animate-wiggle' : ''} ${playerHurt ? 'ring-4 ring-red-600 animate-shake' : ''}`}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,0.6)_0%,transparent_70%)] pointer-events-none" />

        {/* Top Arena Info: Combo & Boss Special Skill */}
        <div className="relative z-10 flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
            combo > 0
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 scale-105 shadow-lg shadow-orange-500/30'
              : 'bg-stone-900/60 text-stone-400 border border-stone-800'
          }`}>
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Combo x{combo}</span>
            {combo >= 2 && <span className="text-[10px] text-red-950 font-extrabold uppercase">(+{combo * 15}% Sát Thương)</span>}
          </div>

          <div className="text-[11px] font-semibold text-rose-300/80 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-500/20">
            {boss.specialSkill}
          </div>
        </div>

        {/* Combat Characters: Hero Ngộ Không vs Boss */}
        <div className="relative z-10 flex items-end justify-between px-4 sm:px-10 pb-2">
          {/* Left: TÔN NGỘ KHÔNG - Lunges with staff on attack */}
          <div className={`flex flex-col items-center transition-all duration-500 ease-out z-20 ${
            wukongMood === 'attack'
              ? 'translate-x-[90px] sm:translate-x-[200px] scale-120 z-30'
              : wukongMood === 'hurt'
              ? '-translate-x-3 scale-95'
              : ''
          }`}>
            <WukongMascot
              size="lg"
              mood={wukongMood}
              speechBubble={wukongMood === 'attack' ? 'KIM CÔ BỔNG XUẤT CHIÊU! 💥' : wukongMood === 'hurt' ? 'A nha!' : undefined}
            />
            <div className="mt-1 w-24 sm:w-28 space-y-0.5 text-center">
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                <span>Ngộ Không</span>
                <span>{playerHp}/100</span>
              </div>
              <div className="h-2 rounded-full bg-stone-900 border border-emerald-500/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${playerHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* VS Center Marker */}
          <div className={`text-amber-500/60 font-black text-xl italic select-none pb-8 transition-all duration-300 ${
            wukongMood === 'attack' ? 'opacity-0 scale-50' : 'animate-pulse opacity-100'
          }`}>
            VS
          </div>

          {/* Right: Boss Demon taking Staff Strike */}
          <div className="flex flex-col items-center relative">
            <div className={`relative transition-all duration-300 ${
              bossHurt ? 'translate-x-4 rotate-12 scale-85 filter brightness-150 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]' : 'animate-float'
            }`}>
              <div className="text-7xl sm:text-8xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] filter select-none">
                {boss.avatar}
              </div>

              {/* Epic Golden Staff Slam Effect When Wukong Strikes */}
              {bossHurt && (
                <div className="absolute -inset-6 z-40 pointer-events-none flex items-center justify-center">
                  {/* 3D Golden-Red Ruyi Jingu Bang Staff Slamming Down onto Boss */}
                  <div className="absolute w-48 sm:w-60 h-6 sm:h-7 bg-gradient-to-r from-yellow-300 via-red-600 to-yellow-300 rounded-full border-2 border-yellow-100 shadow-[0_0_35px_#f59e0b,0_0_60px_#ef4444] animate-staff-slam" />

                  {/* Golden Slash Shockwave */}
                  <div className="absolute w-32 h-32 rounded-full border-4 border-t-yellow-300 border-r-amber-400 border-b-transparent border-l-transparent animate-slash-arc filter drop-shadow-[0_0_20px_#f59e0b]" />

                  {/* Energy Pulse */}
                  <div className="absolute w-20 h-20 rounded-full bg-yellow-400/40 blur-md animate-ping" />

                  {/* Floating Damage & Action Text */}
                  <div className="absolute -top-10 sm:-top-12 animate-float-damage whitespace-nowrap text-center">
                    <div className="text-yellow-300 font-black text-xl sm:text-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] flex items-center justify-center gap-1 font-mono">
                      <span>⚡ -{lastDamage || 25} HP</span>
                      <span className="text-base sm:text-lg text-amber-200">💥</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-300 bg-black/80 px-2.5 py-0.5 rounded-full border border-amber-500/50 shadow-md">
                      Gậy Như Ý Bạo Kích
                    </span>
                  </div>
                </div>
              )}
            </div>
            <span className="text-xs font-black text-amber-200 mt-1 drop-shadow-md">
              {boss.name}
            </span>
          </div>
        </div>
      </div>

      {/* Outcome Modals: Victory or Defeat */}
      {battleOutcome === 'victory' && (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950 border-2 border-emerald-500 p-6 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🏆
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-emerald-200">Đại Thắng Yêu Vương!</h3>
            <p className="text-xs text-stone-300">
              Ngộ Không đã diệt trừ thành công {boss.name}. Kiến thức tiếng Nhật chuẩn xác tuyệt đối!
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="bg-stone-900/80 px-4 py-2 rounded-2xl border border-amber-500/30">
              <span className="text-xs text-stone-400 block">Kinh nghiệm</span>
              <span className="text-lg font-black text-amber-400">+{boss.rewardXp} XP</span>
            </div>
            <div className="bg-stone-900/80 px-4 py-2 rounded-2xl border border-pink-500/30">
              <span className="text-xs text-stone-400 block">Đào Tiên</span>
              <span className="text-lg font-black text-pink-400">🍑 +{boss.rewardPeaches} Quả</span>
            </div>
          </div>

          {/* Action buttons with Instant Next Stage progression */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Khiêu chiến lại
            </button>
            <button
              onClick={handleNextStage}
              className="btn-3d-green px-6 py-3 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <span>{isFinalGameBoss ? 'Tái Chiến Toàn Bộ JPD 🔄' : 'Vượt ải kế tiếp & Chiến luôn ▶'}</span>
            </button>
          </div>
        </div>
      )}

      {battleOutcome === 'defeat' && (
        <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-stone-900 to-red-950 border-2 border-rose-600 p-6 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
            💀
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-rose-200">Ngộ Không Bị Thất Thủ!</h3>
            <p className="text-xs text-stone-300">
              Yêu Ma quá hung hãn. Đừng nản lòng, hãy xem lại từ vựng hoặc gợi ý đề thi và tái đấu ngay!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" /> Tái chiến ngay
            </button>
            <Link
              href="/flashcards"
              className="px-4 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
            >
              Ôn lại từ vựng
            </Link>
          </div>
        </div>
      )}

      {/* --- QUESTION CONSOLE --- */}
      {battleOutcome === 'playing' && (
        <>
          {/* MODE A: FINAL BOSS SENTENCE SCRAMBLE & TRANSLATION MATRIX */}
          {isSentenceMode && currentSentence ? (
            <div className="rounded-[2.2rem] bg-[#fdfbf7] border-2 border-[#e8dfcf] p-4 sm:p-5 shadow-2xl space-y-4">
              <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto" />

              {/* Header */}
              <div className="flex items-center justify-between pb-1 border-b border-[#ebdccb]">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    ẢI TRÙM CUỐI • MA TRẬN GHÉP CÂU DỊCH
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-[#1c1917] mt-1">
                    &ldquo;{currentSentence.vi}&rdquo;
                  </h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs"
                    title="Gợi ý cấu trúc"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => sound.speakJapanese(currentSentence.jp)}
                    className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-md active:scale-95"
                    title="Nghe câu hoàn chỉnh"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Hint Box if toggled */}
              {showHint && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-900 font-medium animate-fade-in">
                  💡 <strong>Gợi ý cú pháp:</strong> {currentSentence.hint}
                </div>
              )}

              {/* Assembled Sentence Area */}
              <div className="min-h-[58px] p-3 rounded-2xl bg-white border-2 border-dashed border-[#cbd5e1] flex flex-wrap items-center gap-2 shadow-inner">
                {selectedTokens.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">
                    Chạm các mảnh từ bên dưới theo đúng thứ tự câu dịch tiếng Nhật...
                  </span>
                ) : (
                  selectedTokens.map((token, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveToken(token, idx)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-sm font-black shadow-sm active:scale-90 transition-transform flex items-center gap-1 jp-font"
                    >
                      <span>{token}</span>
                      <span className="text-[10px] text-emerald-200">✕</span>
                    </button>
                  ))
                )}
              </div>

              {/* Scrambled Word Bank */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#718777] uppercase tracking-wider block">
                  Các mảnh từ xáo trộn:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableTokens.map((token, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddToken(token, idx)}
                      className="px-3.5 py-2 rounded-xl bg-white border-2 border-[#e2ece0] hover:border-[#22c55e] text-[#143521] text-sm font-black shadow-xs active:scale-95 transition-all jp-font"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Reset & Strike */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleResetTokens}
                  className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Undo2 className="w-3.5 h-3.5" /> Xếp lại
                </button>

                <button
                  disabled={selectedTokens.length === 0 || isAnswerChecking || !!bossWrongExplanation}
                  onClick={handleSubmitSentence}
                  className="btn-3d-green flex-1 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                >
                  <Sparkles className="w-4 h-4" /> Tung Chiêu Gậy Như Ý
                </button>
              </div>

              {/* COMPREHENSIVE EXPLANATION CARD FOR SENTENCE */}
              {bossWrongExplanation && (
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 space-y-3 animate-fade-in shadow-md">
                  <div className="flex items-center gap-2 text-red-700 font-black text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Chưa chính xác! Xem câu mẫu hoàn chỉnh:</span>
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-red-200 space-y-2 text-xs text-stone-800">
                    <div>
                      🇻🇳 <strong>Nghĩa câu:</strong> <span className="text-red-700 font-bold">{bossWrongExplanation.meaningVi}</span>
                    </div>
                    <div>
                      ✅ <strong>Câu chuẩn tiếng Nhật:</strong> <span className="text-emerald-700 font-black jp-font text-sm">{bossWrongExplanation.correctAnswer}</span>
                    </div>
                    {bossWrongExplanation.explanation && (
                      <div className="pt-2 text-stone-700 whitespace-pre-line border-t border-red-100 leading-relaxed">
                        📖 {bossWrongExplanation.explanation}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setBossWrongExplanation(null);
                      setShowHint(false);
                      if (playerHp <= 0) {
                        setBattleOutcome('defeat');
                      } else {
                        advanceNextQuestion();
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Đã hiểu, tiếp tục chiến đấu ➔</span>
                  </button>
                </div>
              )}
            </div>
          ) : currentMcq ? (
            /* MODE B: DYNAMIC INTERWOVEN CONSOLE (VOCAB + REAL EXAM IMAGE + REAL ORAL/LISTENING) */
            <div className="rounded-[2.2rem] bg-[#fdfbf7] border-2 border-[#e8dfcf] p-4 sm:p-5 shadow-2xl space-y-3.5">
              <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto" />

              {/* Header Badge */}
              <div className="flex items-center justify-between pb-1 border-b border-[#ebdccb]">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    {currentMcq.type === 'image' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                        <ImageIcon className="w-3 h-3" /> ĐỀ THI HÌNH ẢNH
                      </span>
                    )}
                    {currentMcq.type === 'listening_oral' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider">
                        <Headphones className="w-3 h-3" /> PHẢN XẠ VẤN ĐÁP
                      </span>
                    )}
                    {currentMcq.type === 'vocab' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider">
                        <BookOpen className="w-3 h-3" /> {currentMcq.titleBadge}
                      </span>
                    )}
                    {currentMcq.type === 'kanji' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">
                        CHỮ HÁN KANJI
                      </span>
                    )}
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black text-[#1c1917]">
                    {currentMcq.prompt}
                  </h4>
                  {currentMcq.subPrompt && (
                    <span className="text-xs text-stone-500 font-medium block">
                      {currentMcq.subPrompt}
                    </span>
                  )}
                </div>

                {/* Help button & Speaker Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setShowBossHelp(!showBossHelp)}
                    className="px-3 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    title="Khó quá? Bấm để xem giải thích & gợi ý"
                  >
                    <span>💡 Khó quá?</span>
                  </button>

                  <button
                    onClick={handleListenQuestion}
                    className="w-10 h-10 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-5 h-5 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* HELP & EXPLANATION ACCORDION */}
              {showBossHelp && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-xs animate-fade-in space-y-1.5 shadow-sm">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <span>💡 Trợ giúp giải thích &amp; gợi ý:</span>
                  </div>
                  {currentMcq.meaningVi && (
                    <div className="text-stone-800">
                      🇻🇳 <strong>Nghĩa tiếng Việt:</strong> <span className="text-amber-900 font-semibold">{currentMcq.meaningVi}</span>
                    </div>
                  )}
                  {currentMcq.explanation && (
                    <div className="whitespace-pre-line text-stone-700 leading-relaxed border-t border-amber-200/80 pt-1.5">
                      📖 {currentMcq.explanation}
                    </div>
                  )}
                </div>
              )}

              {/* SPECIFIC DISPLAY: REAL EXAM IMAGE */}
              {currentMcq.type === 'image' && currentMcq.picId && (
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-2 border-2 border-stone-200/80 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/exam_images/${currentMcq.picId}.png`}
                    alt="Đề thi hình ảnh"
                    className="max-h-44 sm:max-h-52 object-contain rounded-xl"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 font-mono">
                    Mã đề thi: {currentMcq.picId}
                  </span>
                </div>
              )}

              {/* SPECIFIC DISPLAY: LISTENING / ORAL PROMPT BANNER */}
              {currentMcq.type === 'listening_oral' && (
                <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 p-3 rounded-2xl border border-purple-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-purple-900 block">
                        Lắng nghe & chọn phản xạ tiếng Nhật chuẩn:
                      </span>
                      <span className="text-[11px] text-stone-600">
                        Bấm nút loa để nghe lại câu hỏi của giám khảo
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleListenQuestion}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" /> Nghe
                  </button>
                </div>
              )}

              {/* EXAM TRAP WARNING ALERT IF ANSWERED INCORRECTLY */}
              {showTrapHint && currentMcq.trap && (
                <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs animate-fade-in space-y-1">
                  <div className="font-black flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Lưu ý bẫy đề thi giám khảo hay gài:</span>
                  </div>
                  <p className="whitespace-pre-line text-[11px] leading-relaxed text-amber-950 font-medium pl-5">
                    {currentMcq.trap}
                  </p>
                </div>
              )}

              {/* 4 Options Grid (A, B, C, D) */}
              <div className="grid grid-cols-2 gap-3">
                {currentMcq.options.map((opt, idx) => {
                  const letter = ['A', 'B', 'C', 'D'][idx];
                  const isSelected = selectedAnswer === opt.id;
                  const isCorrectOpt = opt.id === currentMcq.correctAnswer;

                  let btnStyle = 'bg-white border-[#e8dfcf] hover:border-[#22c55e] text-[#1c1917] shadow-xs';

                  if (selectedAnswer) {
                    if (isSelected) {
                      btnStyle = isCorrectOpt
                        ? 'bg-[#ecfdf5] border-2 border-[#22c55e] text-[#15803d] ring-2 ring-emerald-300'
                        : 'bg-[#fef2f2] border-2 border-[#ef4444] text-[#b91c1c] ring-2 ring-red-300';
                    } else if (isCorrectOpt) {
                      btnStyle = 'bg-[#ecfdf5] border-2 border-[#22c55e] text-[#15803d]';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswerChecking || !!bossWrongExplanation}
                      onClick={() => handleSelectMcq(opt.id)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between items-center relative active:scale-95 min-h-[92px] ${btnStyle}`}
                    >
                      <span className="self-start text-[11px] font-black text-[#d97706] mb-0.5">
                        {letter}
                      </span>
                      <div className="w-full text-center">
                        <span className="text-base sm:text-lg font-black text-[#143521] jp-font block">
                          {opt.main}
                        </span>
                        {opt.sub && (
                          <span className="text-[11px] text-[#718777] font-medium block mt-0.5">
                            {opt.sub}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* COMPREHENSIVE EXPLANATION CARD FOR MCQ */}
              {bossWrongExplanation && (
                <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 space-y-3 animate-fade-in shadow-md">
                  <div className="flex items-center gap-2 text-red-700 font-black text-sm">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>Chưa chính xác! Xem giải thích chi tiết:</span>
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-red-200 space-y-2 text-xs text-stone-800">
                    <div>
                      🇻🇳 <strong>Nghĩa tiếng Việt:</strong> <span className="text-red-700 font-bold">{bossWrongExplanation.meaningVi}</span>
                    </div>
                    <div>
                      ✅ <strong>Đáp án chuẩn xác:</strong> <span className="text-emerald-700 font-black jp-font text-sm">{bossWrongExplanation.correctAnswer}</span>
                    </div>
                    {bossWrongExplanation.explanation && (
                      <div className="pt-2 text-stone-700 whitespace-pre-line border-t border-red-100 leading-relaxed">
                        📖 {bossWrongExplanation.explanation}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setBossWrongExplanation(null);
                      setShowBossHelp(false);
                      if (playerHp <= 0) {
                        setBattleOutcome('defeat');
                      } else {
                        advanceNextQuestion();
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Đã hiểu, tiếp tục chiến đấu ➔</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
