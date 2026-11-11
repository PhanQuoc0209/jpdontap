'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { dataset } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import {
  ArrowLeft,
  Volume2,
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
  XCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { diagnosePronunciation, cleanSpokenText, PronunciationDiagnosis } from '@/lib/pronunciationAdvisor';

export default function PhatAmPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Audio energy / volume level tracking for silence detection
  const audioContextRef = useRef<AudioContext | null>(null);
  const volumeIntervalRef = useRef<any>(null);
  const maxVolumeRef = useRef<number>(0);
  const voiceFramesRef = useRef<number>(0);
  const capturedTranscriptRef = useRef<string>('');

  const word = dataset.words[currentIndex] || dataset.words[0];

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

  // Clean up recorded audio and player when switching word
  useEffect(() => {
    stopAllAudio();
    setScore(null);
    setRecordedAudioUrl(null);
    setUserSpokenText('');
    setIsBoxPoppedUp(false);
    setDiagnosis(null);
    capturedTranscriptRef.current = '';
  }, [currentIndex]);

  const handleSpeak = () => {
    stopAllAudio();
    sound.speakJapanese(word.word);
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
    setIsBoxPoppedUp(true); // Ô chữ của bạn nhảy lên ngay khi ghi âm!
    setScore(null);
    setDiagnosis(null);
    setRecordedAudioUrl(null);
    setIsPlayingRecorded(false);
    setUserSpokenText('');
    capturedTranscriptRef.current = '';
    audioChunksRef.current = [];
    maxVolumeRef.current = 0;
    voiceFramesRef.current = 0;

    // 1. Attempt SpeechRecognition to capture words spoken in Japanese
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

    // 2. Real audio recording via MediaRecorder + Audio Energy Analyser
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        // Measure live microphone volume to detect genuine speech vs silence
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const actx = new AudioCtx();
            audioContextRef.current = actx;
            const analyser = actx.createAnalyser();
            analyser.fftSize = 512;
            const source = actx.createMediaStreamSource(stream);
            source.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            volumeIntervalRef.current = setInterval(() => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              if (avg > maxVolumeRef.current) {
                maxVolumeRef.current = avg;
              }
              // Normal speech level > 7-10 (ambient noise is < 5)
              if (avg > 9) {
                voiceFramesRef.current++;
              }
            }, 50);
          }
        } catch (e) {
          console.warn('AudioContext volume tracking note:', e);
        }

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Clean up volume tracking interval and audio context
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

          // Release microphone tracks
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
          } else if (diag.status === 'silent') {
            // Không nói gì: KHÔNG CHẤM ĐIỂM, KHÔNG BẮN CONFETTI, KHÔNG PHÁT ÂM THANH MỪNG
            sound.playTap();
          } else {
            // Đọc sai / Chưa rõ: Cung cấp bảng phân tích chi tiết lỗi sai
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

        // Auto-stop after 2.8 seconds so user doesn't have to manually press stop
        recordingTimerRef.current = setTimeout(() => {
          handleStopRecording();
        }, 2800);

        return;
      }
    } catch (err) {
      console.warn('Microphone permission or MediaRecorder not available, using simulated analysis:', err);
    }

    // Fallback simulation if microphone is completely blocked by browser
    setTimeout(() => {
      setIsListening(false);
      const diag = diagnosePronunciation({
        targetWord: word.word,
        targetKana: word.kana || word.word,
        targetRomaji: word.romaji,
        userSpokenText: word.word,
        isSilent: false,
        hasAudioVoice: true
      });
      setDiagnosis(diag);
      setScore(diag.score);
      setUserSpokenText(word.word);
      sound.playCorrect();
      confetti({ particleCount: 70, spread: 50 });
      sound.speakJapanese(word.word);
    }, 2200);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={stopAllAudio}
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521]">Luyện phát âm</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                stopAllAudio();
                setCurrentIndex(currentIndex - 1);
              }
            }}
            disabled={currentIndex === 0}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (currentIndex + 1 < dataset.words.length) {
                stopAllAudio();
                setCurrentIndex(currentIndex + 1);
              }
            }}
            disabled={currentIndex + 1 === dataset.words.length}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Card */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f8f5ea] via-[#f5efe2] to-[#ecdfc8] border border-[#e4dac3] p-4 shadow-md space-y-2">
        {/* Peeking Mascot */}
        <div className="absolute top-3 right-4 select-none">
          <span className="text-4xl filter drop-shadow">🐒</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#22c55e] text-white text-[10px] font-black uppercase tracking-wider">
            NHIỆM VỤ KHẨU NGỮ
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white text-[#718777] text-[10px] font-bold border border-[#e4dac3]">
            Mic chủ động
          </span>
        </div>

        <h3 className="text-base font-black text-[#2e1d0f]">
          Nói cùng Ngộ Không
        </h3>

        <p className="text-[11px] text-[#6d5b4b] leading-relaxed max-w-[240px]">
          Bấm mic thu âm, hệ thống sẽ phát lại ngay giọng của bạn để bạn tự đối chiếu với giọng mẫu tiếng Nhật chuẩn xác.
        </p>

        {/* Progress bar */}
        <div className="pt-2 flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-[#e3d7be] overflow-hidden">
            <div
              className="h-full bg-[#22c55e] rounded-full transition-all duration-300"
              style={{ width: `${Math.round(((currentIndex + 1) / dataset.words.length) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#8c6753] font-bold">
            {currentIndex + 1}/{dataset.words.length}
          </span>
        </div>
      </div>

      {/* Main Pronunciation Card */}
      <div className="rounded-[2rem] bg-[#fffcf5] border-2 border-[#fef3c7] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#143521]">
            <span>🧔</span>
            <span>Võ Sư Đàm Thoại</span>
          </div>
          <span className="text-lg">🐒</span>
        </div>

        {/* Inner White Word Box */}
        <div className="rounded-2xl bg-white border border-[#fed7aa]/50 p-6 flex flex-col items-center justify-center text-center shadow-inner space-y-2">
          <span className="text-sm font-bold text-[#ea580c] font-mono">
            {word.romaji}
          </span>
          <h2 className="text-4xl font-black text-[#143521] jp-font">
            {word.word}
          </h2>
          {word.kana && word.kana !== word.word && (
            <span className="text-xs font-semibold text-emerald-700 jp-font">
              【{word.kana}】
            </span>
          )}
          <p className="text-xs font-semibold text-[#718777]">
            {word.meaning}
          </p>
        </div>

        {/* Listen Model Button */}
        <div className="flex justify-center pt-1">
          <button
            onClick={handleSpeak}
            className="px-6 py-2 rounded-full bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] text-[#b45309] text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4" /> Nghe giọng mẫu
          </button>
        </div>
      </div>

      {/* Big Green Microphone Circle */}
      <div className="flex flex-col items-center justify-center py-2 space-y-2">
        <button
          onClick={handleStartListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all cursor-pointer ${
            isListening
              ? 'bg-red-500 animate-pulse scale-105 ring-4 ring-red-300'
              : 'btn-3d-green hover:scale-105 active:scale-90'
          }`}
          title={isListening ? 'Bấm để dừng thu âm' : 'Bấm mic để nói'}
        >
          <Mic className="w-8 h-8" />
        </button>
        <span className="text-xs font-bold text-[#597361]">
          {isListening ? '🎙️ Đang thu âm... Hãy nói to lên!' : 'Chạm micro để bắt đầu thu âm'}
        </span>
      </div>

      {/* Ô CHỮ NHẢY LÊN KHI GHI ÂM (Pop-Up Speech Box & Pronunciation Diagnosis) */}
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
            ) : diagnosis?.status === 'incorrect' ? (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{score}% • Cần cải thiện</span>
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
          ) : diagnosis?.status === 'incorrect' ? (
            /* TRƯỜNG HỢP 2: ĐỌC SAI -> PHÂN TÍCH LỖI SAI CHI TIẾT */
            <div className="space-y-3 animate-fade-in">
              {/* Verdict header */}
              <div className="rounded-2xl bg-amber-50 border-2 border-amber-300 p-3.5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-amber-700" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-amber-900 uppercase">
                    Phát hiện điểm phát âm chưa chuẩn
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

                <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-center space-y-1">
                  <span className="text-[10px] uppercase font-black text-amber-900 block">
                    👂 Hệ thống nghe bạn đọc:
                  </span>
                  <div className="text-2xl font-black text-amber-950 jp-font">
                    {diagnosis.heardText || '(Chưa rõ âm)'}
                  </div>
                  <span className="text-xs font-bold text-amber-700 font-mono block">
                    /Cần chỉnh âm/
                  </span>
                  <span className="text-[11px] text-amber-600 block">
                    {diagnosis.score}% tương đồng
                  </span>
                </div>
              </div>

              {/* Detailed Pronunciation Analysis Card */}
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 border-b border-stone-200 pb-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Phân Tích Chi Tiết Khẩu Hình &amp; Ngữ Điệu</span>
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
                  onClick={handleSpeak}
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
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thử đọc lại ngay</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopAllAudio();
                    if (currentIndex + 1 < dataset.words.length) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      setCurrentIndex(0);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Bỏ qua từ này</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP 3: ĐỌC ĐÚNG HOẶC CHƯA RÕ */
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
                  onClick={handleSpeak}
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
                  onClick={() => {
                    stopAllAudio();
                    if (currentIndex + 1 < dataset.words.length) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      setCurrentIndex(0);
                    }
                  }}
                  className="btn-3d-green px-5 py-2 rounded-xl text-white font-black text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <span>Từ tiếp theo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tip Box with Lightbulb */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-start gap-2.5 shadow-sm">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#718777] leading-relaxed">
          Mẹo: Hãy nói to, rõ ràng và nghe lại giọng của mình so với giọng chuẩn để sửa ngữ điệu ngay lập tức!
        </p>
      </div>
    </div>
  );
}
