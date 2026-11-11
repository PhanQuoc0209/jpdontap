'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dataset, VocabWord } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import { WukongMascot } from '@/components/WukongMascot';
import {
  ArrowLeft,
  Volume2,
  Timer,
  Mic,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Swords,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { diagnosePronunciation, cleanSpokenText, PronunciationDiagnosis } from '@/lib/pronunciationAdvisor';

export default function PhatAmPage() {
  const router = useRouter();

  // Unit filter: default to first lesson (jpd113-v1-1) or 'all'
  const [selectedUnitId, setSelectedUnitId] = useState<string>('jpd113-v1-1');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Audio and recording state
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [isBoxPoppedUp, setIsBoxPoppedUp] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<PronunciationDiagnosis | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const playbackTimerRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Audio volume level tracking for silence detection
  const audioContextRef = useRef<AudioContext | null>(null);
  const volumeIntervalRef = useRef<any>(null);
  const maxVolumeRef = useRef<number>(0);
  const voiceFramesRef = useRef<number>(0);
  const capturedTranscriptRef = useRef<string>('');

  // Filter words by selected unit or fallback to all words
  const activeWords: VocabWord[] = useMemo(() => {
    if (selectedUnitId === 'all') return dataset.words;
    const list = dataset.words.filter(w => w.unitId === selectedUnitId);
    return list.length > 0 ? list : dataset.words;
  }, [selectedUnitId]);

  const word: VocabWord = activeWords[currentIndex] || activeWords[0];
  const total = activeWords.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);
  const selectedUnit = dataset.units.find(u => u.id === selectedUnitId);

  // Stop all playing and recording audio immediately
  const stopAllAudio = () => {
    // 1. Clear any pending auto-playback timer
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }

    // 2. Stop user recorded audio playback
    if (userAudioElementRef.current) {
      try {
        userAudioElementRef.current.pause();
        userAudioElementRef.current.currentTime = 0;
        userAudioElementRef.current.src = '';
      } catch (err) {}
      userAudioElementRef.current = null;
    }
    setIsPlayingRecorded(false);

    // 3. Immediately cancel Japanese speech synthesis
    sound.stopAll();

    // 4. Stop recording if in progress
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (err) {}
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {}
      mediaRecorderRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (err) {}
      audioContextRef.current = null;
    }
    setIsListening(false);
  };

  // Clean up on component unmount and page visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        stopAllAudio();
      }
    };
    window.addEventListener('pagehide', stopAllAudio);
    window.addEventListener('beforeunload', stopAllAudio);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopAllAudio();
      window.removeEventListener('pagehide', stopAllAudio);
      window.removeEventListener('beforeunload', stopAllAudio);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Clean up recorded audio and player when switching word or unit
  useEffect(() => {
    stopAllAudio();
    setScore(null);
    setRecordedAudioUrl(null);
    setUserSpokenText('');
    setIsBoxPoppedUp(false);
    setDiagnosis(null);
    capturedTranscriptRef.current = '';
  }, [currentIndex, selectedUnitId]);

  const handleSpeak = (rate: number = 0.9) => {
    stopAllAudio();
    setIsSpeaking(true);
    sound.speakJapanese(word.word || word.kana, rate);
    setTimeout(() => setIsSpeaking(false), 1200);
  };

  // Play/pause user's recorded audio
  const handleTogglePlayRecorded = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecorded) {
      stopAllAudio();
      return;
    }

    stopAllAudio();

    const audio = new Audio(recordedAudioUrl);
    userAudioElementRef.current = audio;
    setIsPlayingRecorded(true);

    audio.onended = () => {
      setIsPlayingRecorded(false);
      userAudioElementRef.current = null;
    };
    audio.onerror = () => {
      setIsPlayingRecorded(false);
      userAudioElementRef.current = null;
    };
    audio.play().catch(() => {
      setIsPlayingRecorded(false);
      userAudioElementRef.current = null;
    });
  };

  const handleStopRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (err) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping media recorder:', err);
      }
    }
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current);
      volumeIntervalRef.current = null;
    }
  };

  const handleStartListening = async () => {
    if (isListening) {
      handleStopRecording();
      return;
    }

    stopAllAudio();

    setIsListening(true);
    setIsBoxPoppedUp(true); // Ô chữ nhảy lên ngay khi ghi âm!
    setScore(null);
    setDiagnosis(null);
    setRecordedAudioUrl(null);
    setIsPlayingRecorded(false);
    setUserSpokenText('');
    capturedTranscriptRef.current = '';
    audioChunksRef.current = [];
    maxVolumeRef.current = 0;
    voiceFramesRef.current = 0;

    // 1. Attempt SpeechRecognition in Japanese
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = 'ja-JP';
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            let finalPart = '';
            let interimPart = '';
            for (let i = 0; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                finalPart += res[0].transcript;
              } else {
                interimPart += res[0].transcript;
              }
            }
            const raw = (finalPart || interimPart || '').trim();
            const cleaned = cleanSpokenText(raw, word.word, word.kana || word.word);
            if (cleaned) {
              capturedTranscriptRef.current = cleaned;
              setUserSpokenText(cleaned);
            }
          };

          recognition.onerror = () => {};
          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (err) {
          console.warn('Speech recognition start note:', err);
        }
      }
    }

    // 2. Capture actual Microphone audio with MediaRecorder & analyze volume
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        // Set up Web Audio Analyser for volume energy measurement
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const sourceNode = audioCtx.createMediaStreamSource(stream);
            const analyserNode = audioCtx.createAnalyser();
            analyserNode.fftSize = 256;
            sourceNode.connect(analyserNode);

            const bufferLength = analyserNode.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            volumeIntervalRef.current = setInterval(() => {
              analyserNode.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const averageVolume = sum / bufferLength;
              if (averageVolume > maxVolumeRef.current) {
                maxVolumeRef.current = averageVolume;
              }
              if (averageVolume > 14) {
                voiceFramesRef.current += 1;
              }
            }, 60);
          }
        } catch (audioErr) {
          console.warn('AudioContext volume metering note:', audioErr);
        }

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current);
            volumeIntervalRef.current = null;
          }
          if (audioContextRef.current) {
            try {
              audioContextRef.current.close();
            } catch (e) {}
            audioContextRef.current = null;
          }

          stream.getTracks().forEach((track) => track.stop());

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          setIsListening(false);

          const rawTranscript = capturedTranscriptRef.current.trim();
          const transcript = cleanSpokenText(rawTranscript, word.word, word.kana || word.word);
          const hasSpokenVoice = voiceFramesRef.current >= 3 || maxVolumeRef.current > 12;
          const isSilent = !hasSpokenVoice && transcript === '';

          // Run deep linguistic pronunciation diagnosis
          const diag = diagnosePronunciation({
            targetWord: word.word,
            targetKana: word.kana || word.word,
            targetRomaji: word.romaji,
            userSpokenText: transcript,
            isSilent,
            hasAudioVoice: hasSpokenVoice
          });

          setDiagnosis(diag);
          setScore(diag.score);

          if (diag.status === 'correct') {
            sound.playCorrect();
            confetti({ particleCount: 75, spread: 60 });
          } else {
            sound.playTap();
          }

          // Play back user's recorded voice immediately if sound was detected
          if (hasSpokenVoice) {
            playbackTimerRef.current = setTimeout(() => {
              const playback = new Audio(audioUrl);
              userAudioElementRef.current = playback;
              setIsPlayingRecorded(true);
              playback.onended = () => {
                setIsPlayingRecorded(false);
                userAudioElementRef.current = null;
              };
              playback.onerror = () => {
                setIsPlayingRecorded(false);
                userAudioElementRef.current = null;
              };
              playback.play().catch(() => {
                setIsPlayingRecorded(false);
                userAudioElementRef.current = null;
              });
            }, 250);
          }
        };

        mediaRecorder.start();

        // Auto-stop after 4.2 seconds so user has comfortable time to pronounce clearly
        recordingTimerRef.current = setTimeout(() => {
          handleStopRecording();
        }, 4200);

        return;
      }
    } catch (err) {
      console.warn('Microphone permission or MediaRecorder not available, using simulated analysis:', err);
    }

    // Fallback simulation if mic is blocked in test environments
    setTimeout(() => {
      setIsListening(false);
      const isVoiceDetected = maxVolumeRef.current > 10 || userSpokenText.trim().length > 0;
      const diag = diagnosePronunciation({
        targetWord: word.word,
        targetKana: word.kana || word.word,
        targetRomaji: word.romaji,
        userSpokenText: userSpokenText || word.word,
        isSilent: !isVoiceDetected,
        hasAudioVoice: isVoiceDetected
      });
      setDiagnosis(diag);
      setScore(diag.score);
    }, 2500);
  };

  const handleNextWord = () => {
    stopAllAudio();
    sound.playCorrect();
    setEarnedXp(prev => prev + 10);

    if (currentIndex + 1 < total) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      sound.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      stopAllAudio();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    stopAllAudio();
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Header with Back button and Lesson Dropdown */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          onClick={stopAllAudio}
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <h1 className="text-base font-black text-[#143521] truncate max-w-[200px]">
          Học từ &amp; Phát âm
        </h1>

        {/* Ải/Bài học Dropdown Selector */}
        <select
          value={selectedUnitId}
          onChange={(e) => {
            stopAllAudio();
            setSelectedUnitId(e.target.value);
            setCurrentIndex(0);
            setIsCompleted(false);
          }}
          className="text-xs font-bold bg-white border border-[#e2ece0] text-stone-700 rounded-full px-3 py-1.5 outline-hidden shadow-xs max-w-[170px] truncate cursor-pointer"
        >
          <option value="all">🌟 Toàn bộ từ vựng (1025 từ)</option>
          <optgroup label="JPD113 (Nhật 1 - Sơ Cấp)">
            {dataset.units.filter(u => u.course === 'jpd113').map(u => (
              <option key={u.id} value={u.id}>
                {u.tag} {u.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="JPD123 (Nhật 2 - Trung Cấp)">
            {dataset.units.filter(u => u.course === 'jpd123').map(u => (
              <option key={u.id} value={u.id}>
                {u.tag} {u.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="JPD133 (Nhật 3 - Cao Cấp)">
            {dataset.units.filter(u => u.course === 'jpd133').map(u => (
              <option key={u.id} value={u.id}>
                {u.tag} {u.title}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Subheader: Lantern + Unit Tag & XP Badge */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-lg filter drop-shadow-xs">🏮</span>
          <span className="text-xs font-black uppercase tracking-wider text-[#b45309] truncate max-w-[220px]">
            {selectedUnit ? `${selectedUnit.tag}: ${selectedUnit.title}` : 'Kho từ vựng toàn diện'}
          </span>
        </div>

        <div className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black shrink-0">
          +{earnedXp} XP
        </div>
      </div>

      {/* Progress Bar + Counter (e.g. 1/12) */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full bg-[#e2ede0] overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#22c55e] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-black text-[#718777] font-mono">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* UNIFIED CARD: Khám phá từ mới & Luyện phát âm AI */}
      <div className="relative overflow-hidden rounded-[2.2rem] bg-gradient-to-b from-[#fbfdfa] via-[#f7fbf5] to-[#f0f7ee] border-2 border-[#e1ece0] p-5 sm:p-6 shadow-xl space-y-4">
        {/* Peeking Mascot Top-Right */}
        <div className="absolute top-2 right-4 pointer-events-none select-none">
          <div className="w-16 h-16 relative">
            <WukongMascot mood={isListening ? 'attack' : isSpeaking ? 'happy' : 'idle'} size="sm" />
          </div>
        </div>

        {/* Top Tag & Mode Indicator */}
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-[#22c55e] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
            HỌC TỪ &amp; PHÁT ÂM
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white text-[#718777] text-[10px] font-bold border border-[#e4dac3]">
            Thẩm âm AI
          </span>
        </div>

        {/* Main Japanese Word & Phonetics */}
        <div className="text-center space-y-1.5 pt-1">
          <span className="text-sm font-bold text-[#ea580c] font-mono block">
            /{word.romaji}/
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#143521] jp-font tracking-tight drop-shadow-xs">
            {word.word}
          </h2>
          {word.kana && word.kana !== word.word && (
            <span className="text-sm font-bold text-emerald-700 jp-font block">
              【{word.kana}】
            </span>
          )}
        </div>

        {/* Meaning Pill Badge */}
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] text-sm font-black text-center shadow-xs">
            {word.meaning}
          </span>
        </div>

        {/* Audio Listen Controls (Normal 0.9x and Slow 0.6x) */}
        <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto pt-1">
          <button
            type="button"
            onClick={() => handleSpeak(0.9)}
            className="py-2.5 px-3 rounded-full bg-white border border-[#cbd5e1] hover:border-[#22c55e] text-[#143521] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#22c55e]" />
            <span>Nghe mẫu</span>
          </button>

          <button
            type="button"
            onClick={() => handleSpeak(0.6)}
            className="py-2.5 px-3 rounded-full bg-white border border-[#cbd5e1] hover:border-[#22c55e] text-[#143521] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Timer className="w-4 h-4 text-amber-600" />
            <span>Nghe chậm (0.6x)</span>
          </button>
        </div>

        {/* Big Microphone Practice Button */}
        <div className="flex flex-col items-center justify-center pt-2 space-y-2 border-t border-[#e2ece0]/80">
          <button
            type="button"
            onClick={handleStartListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 animate-pulse scale-105 ring-4 ring-red-300'
                : 'btn-3d-green hover:scale-105 active:scale-90'
            }`}
            title={isListening ? 'Bấm để dừng thu âm' : 'Bấm mic để phát âm thử'}
          >
            <Mic className="w-8 h-8" />
          </button>
          <span className="text-xs font-bold text-[#597361]">
            {isListening ? '🎙️ Đang thu âm... Hãy nói to lên!' : 'Chạm micro để phát âm'}
          </span>
        </div>
      </div>

      {/* POP-UP SPEECH EVALUATION BOX (Hiển thị ngay khi ghi âm & phân tích giọng đọc) */}
      {isBoxPoppedUp && (
        <div className="w-full max-w-lg mx-auto rounded-3xl bg-white border-2 border-emerald-400 p-5 shadow-2xl space-y-4 transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐒</span>
              <div>
                <span className="text-xs font-black text-[#143521] uppercase tracking-wide block">
                  {isListening ? 'Đang Lắng Nghe Bạn Đọc...' : 'Kết Quả Thẩm Âm Khẩu Ngữ'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {isListening ? 'Tôn Ngộ Không đang phân tích tần số âm' : 'Đối chiếu khẩu hình và phát âm chuẩn Nhật'}
                </span>
              </div>
            </div>

            {/* Status & Score Badge */}
            {isListening ? (
              <div className="flex items-center gap-1.5 bg-red-100/90 text-red-600 px-3 py-1 rounded-full text-[11px] font-black border border-red-200 shadow-2xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>REC LIVE</span>
              </div>
            ) : diagnosis?.status === 'silent' ? (
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-300 text-xs font-black flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Không có tiếng (Chưa chấm)</span>
              </span>
            ) : diagnosis?.status === 'unclear' || diagnosis?.status === 'incorrect' ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Chưa nghe rõ • Hãy nói rõ ràng</span>
              </span>
            ) : diagnosis?.status === 'correct' ? (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1 animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{score}% Chuẩn Xác</span>
              </span>
            ) : null}
          </div>

          {/* Central Body Content */}
          {isListening ? (
            <div className="py-6 px-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3">
              {/* Animated Sound Wave Bars */}
              <div className="flex items-center justify-center gap-1.5 h-10">
                <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-8 bg-emerald-600 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-10 bg-amber-500 rounded-full animate-bounce [animation-delay:300ms]" />
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full animate-bounce [animation-delay:100ms]" />
                <span className="w-1.5 h-9 bg-emerald-600 rounded-full animate-bounce [animation-delay:250ms]" />
                <span className="w-1.5 h-5 bg-amber-500 rounded-full animate-bounce [animation-delay:50ms]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 jp-font">
                {userSpokenText ? `「 ${userSpokenText} 」` : `Đang nghe: "${word.word}"...`}
              </div>
              <p className="text-xs text-amber-800 font-bold">
                🎙️ Hãy đọc to, rõ ràng từ: <span className="underline">{word.word}</span> (/{word.romaji}/)
              </p>
            </div>
          ) : diagnosis?.status === 'silent' ? (
            /* TRƯỜNG HỢP 1: KHÔNG NÓI GÌ -> KHÔNG CHẤM ĐIỂM, BÁO NHẮC NHỞ RÕ RÀNG */
            <div className="rounded-2xl bg-rose-50/80 border-2 border-rose-300 p-4 space-y-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-rose-900">
                    Chưa nghe thấy giọng nói của bạn!
                  </h4>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Hệ thống không ghi nhận được âm thanh từ micro. Đồng nghĩa là <strong>chưa thể chấm điểm</strong> lượt đọc này.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-3 border border-rose-200 text-xs text-stone-700 space-y-1.5">
                <span className="font-bold text-stone-900 block">💡 Hướng dẫn thử lại:</span>
                <ul className="list-disc list-inside space-y-1 text-stone-600 text-[11px]">
                  <li>Kiểm tra quyền truy cập Micro trên trình duyệt (cho phép mic hoạt động).</li>
                  <li>Ghé gần micro và đọc to rõ ràng từ: <strong className="text-emerald-700">「 {word.word} 」</strong> (/{word.romaji}/).</li>
                </ul>
              </div>

              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handleStartListening}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                  <span>Bấm micro để nói lại ngay</span>
                </button>
              </div>
            </div>
          ) : diagnosis?.status === 'unclear' || diagnosis?.status === 'incorrect' ? (
            /* TRƯỜNG HỢP 2: ÂM CHƯA ĐÚNG / CHƯA NGHE RÕ -> BÁO NHẮC NHỞ PHÁT ÂM RÕ RÀNG */
            <div className="space-y-3 animate-fade-in">
              {/* Verdict header */}
              <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-3.5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5 text-amber-700" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-amber-900 uppercase">
                    {diagnosis.verdictTitle || 'Chưa nghe rõ phát âm'}
                  </h4>
                  <p className="text-xs text-amber-800 font-medium">
                    {diagnosis.verdictMessage}
                  </p>
                </div>
              </div>

              {/* Comparison Box */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center space-y-1">
                  <span className="text-[10px] uppercase font-black text-emerald-800 block">
                    🎯 Từ mẫu chuẩn:
                  </span>
                  <div className="text-2xl font-black text-emerald-950 jp-font">
                    {word.word}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 font-mono block">
                    /{word.romaji}/
                  </span>
                  {word.kana && (
                    <span className="text-[11px] text-emerald-600 block">
                      【{word.kana}】
                    </span>
                  )}
                </div>

                <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-center space-y-1 flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-black text-amber-900 block">
                    📢 Yêu cầu phát âm:
                  </span>
                  <div className="text-lg font-black text-amber-900 leading-tight">
                    Cần phát âm rõ hơn
                  </div>
                  <span className="text-xs font-bold text-amber-700 font-mono block">
                    /Đọc to • Rõ ràng/
                  </span>
                  <span className="text-[11px] text-amber-600 block">
                    Để hệ thống nghe rõ
                  </span>
                </div>
              </div>

              {/* Detailed Pronunciation Analysis Card */}
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 border-b border-stone-200 pb-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Hướng Dẫn Khẩu Hình Chuẩn Để Đọc Rõ Ràng</span>
                </div>

                <div className="space-y-2 text-stone-700">
                  <div className="space-y-0.5">
                    <span className="font-bold text-emerald-800 block text-[11px]">
                      👄 Khẩu hình miệng &amp; Vị trí đặt lưỡi:
                    </span>
                    <p className="text-[11px] text-stone-600 leading-relaxed bg-white p-2 rounded-lg border border-stone-200">
                      {diagnosis.mouthShapeAdvice}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-bold text-amber-800 block text-[11px]">
                      🎵 Cao độ &amp; Trọng âm (Pitch Accent):
                    </span>
                    <p className="text-[11px] text-stone-600 leading-relaxed bg-white p-2 rounded-lg border border-stone-200">
                      {diagnosis.pitchAccentAdvice}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-800 block text-[11px]">
                      💡 Lời khuyên của Ngộ Không:
                    </span>
                    <p className="text-[11px] text-stone-600 leading-relaxed bg-amber-50/60 p-2 rounded-lg border border-amber-200/80">
                      {diagnosis.coachingRecommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTogglePlayRecorded}
                  disabled={!recordedAudioUrl}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer ${
                    isPlayingRecorded
                      ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300 shadow-xs'
                  }`}
                >
                  {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingRecorded ? 'Đang phát...' : 'Nghe lại giọng bạn'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSpeak(0.9)}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center gap-2 font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Nghe giọng mẫu chuẩn</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleStartListening}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Bấm micro để phát âm rõ lại</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextWord}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Bỏ qua từ này</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP 3: ĐỌC ĐÚNG (CHUẨN XÁC 95% - 98%) */
            <div className="space-y-3 animate-fade-in">
              <div className="rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 p-4 text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 mb-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-sm font-black text-emerald-950">
                  {diagnosis?.verdictTitle || 'Phát âm tuyệt vời! Chuẩn xác'}
                </h4>
                <p className="text-xs text-emerald-800">
                  {diagnosis?.verdictMessage || `Khẩu hình và ngữ điệu từ 「${word.word}」 rất tự nhiên.`}
                </p>
                <div className="text-3xl font-black text-[#143521] jp-font pt-1">
                  {userSpokenText || word.word}
                </div>
                <span className="text-xs font-bold text-amber-700 font-mono block">
                  /{word.romaji}/ • {word.meaning}
                </span>
              </div>

              {/* Audio Listen Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleTogglePlayRecorded}
                  disabled={!recordedAudioUrl}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer ${
                    isPlayingRecorded
                      ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  }`}
                >
                  {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingRecorded ? 'Đang phát...' : 'Nghe giọng của bạn'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSpeak(0.9)}
                  className="p-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 flex items-center justify-center gap-2 font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Nghe giọng mẫu</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleStartListening}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                  <span>Thu âm lại</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextWord}
                  className="btn-3d-green px-5 py-2 rounded-xl text-white font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span>Từ tiếp theo (+10 XP)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Persistent Bottom Action & Navigation Bar */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handlePrevWord}
          disabled={currentIndex === 0}
          className="py-3 rounded-2xl bg-white border border-[#cbd5e1] hover:bg-stone-50 disabled:opacity-40 text-stone-700 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Từ trước</span>
        </button>

        <button
          type="button"
          onClick={handleNextWord}
          className="btn-3d-green py-3 rounded-2xl text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Đã thuộc &amp; Tiếp tục (+10 XP)</span>
        </button>
      </div>

      {/* Tip Box with Lightbulb */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-start gap-2.5 shadow-sm">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#718777] leading-relaxed">
          Mẹo: Học nghĩa và nghe chuẩn trước, sau đó bấm micro phát âm to rõ ràng để hệ thống đối chiếu và chấm điểm nhé!
        </p>
      </div>

      {/* Completion Modal when finishing all words in the selected unit */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcfaf5] border-2 border-[#d6e5d3] rounded-[2.5rem] p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scale-up">
            <div className="w-24 h-24 mx-auto flex items-center justify-center">
              <WukongMascot mood="happy" size="md" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black uppercase tracking-wider">
                Ải đã hoàn thành!
              </span>
              <h3 className="text-xl font-black text-[#143521]">
                Xuất Sắc Lắm Đại Thánh!
              </h3>
              <p className="text-xs text-[#718777]">
                Bạn đã khám phá và luyện phát âm trọn vẹn {total} từ vựng của bài học này.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl p-3 border border-[#e2ece0]">
              <div className="text-center">
                <div className="text-xs text-[#718777] font-bold">Kinh nghiệm</div>
                <div className="text-lg font-black text-amber-600">+{earnedXp} XP</div>
              </div>
              <div className="text-center border-l border-[#e2ece0]">
                <div className="text-xs text-[#718777] font-bold">Chiến lợi phẩm</div>
                <div className="text-lg font-black text-pink-600">🍑 +1 Đào Tiên</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  router.push('/boss-battle');
                }}
                className="btn-3d-red w-full py-3 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Swords className="w-4 h-4" /> Khiêu chiến Boss ngay
              </button>

              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  router.push('/luyen-viet');
                }}
                className="btn-3d-green w-full py-3 rounded-full text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4" /> Luyện viết chữ Hán
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-2.5 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Học lại lượt này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
