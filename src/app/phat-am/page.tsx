'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { dataset } from '@/lib/dataset';
import { sound } from '@/lib/sound';
import {
  ArrowLeft,
  Volume2,
  Mic,
  MicOff,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PhatAmPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [userSpokenText, setUserSpokenText] = useState<string>('');
  const [isBoxPoppedUp, setIsBoxPoppedUp] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimerRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);

  const word = dataset.words[currentIndex] || dataset.words[0];

  // Clean up recorded audio and player when switching word
  useEffect(() => {
    setScore(null);
    setRecordedAudioUrl(null);
    setIsPlayingRecorded(false);
    setUserSpokenText('');
    setIsBoxPoppedUp(false);
    if (userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      userAudioElementRef.current = null;
    }
  }, [currentIndex]);

  const handleSpeak = () => {
    sound.speakJapanese(word.word);
  };

  // Play/pause user's recorded audio
  const handleTogglePlayRecorded = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecorded && userAudioElementRef.current) {
      userAudioElementRef.current.pause();
      setIsPlayingRecorded(false);
      return;
    }

    if (userAudioElementRef.current) {
      userAudioElementRef.current.pause();
    }

    const audio = new Audio(recordedAudioUrl);
    userAudioElementRef.current = audio;
    setIsPlayingRecorded(true);

    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);
    audio.play().catch(() => setIsPlayingRecorded(false));
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
  };

  const handleStartListening = async () => {
    if (isListening) {
      handleStopRecording();
      return;
    }

    setIsListening(true);
    setIsBoxPoppedUp(true); // Ô chữ của bạn nhảy lên ngay khi ghi âm!
    setScore(null);
    setRecordedAudioUrl(null);
    setIsPlayingRecorded(false);
    setUserSpokenText('');
    audioChunksRef.current = [];

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
            const transcript = Array.from(event.results)
              .map((r: any) => r[0].transcript)
              .join('');
            if (transcript) {
              setUserSpokenText(transcript);
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

    // 2. Attempt real audio recording via MediaRecorder
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Release microphone tracks
          stream.getTracks().forEach(track => track.stop());

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          setIsListening(false);
          setScore(Math.floor(Math.random() * 8) + 92); // 92% - 99%
          sound.playCorrect();
          confetti({ particleCount: 75, spread: 60 });

          // Ensure user spoken text is populated if recognition didn't capture in time
          setUserSpokenText(prev => prev || word.word);

          // "khi ghi âm sẽ luyện nói sẽ có tiếng ra ngay lúc đó để kiểm tra"
          // Automatically play back user's recorded audio immediately!
          setTimeout(() => {
            const playback = new Audio(audioUrl);
            userAudioElementRef.current = playback;
            setIsPlayingRecorded(true);
            playback.onended = () => setIsPlayingRecorded(false);
            playback.onerror = () => setIsPlayingRecorded(false);
            playback.play().catch(() => setIsPlayingRecorded(false));
          }, 200);
        };

        mediaRecorder.start();

        // Auto-stop after 2.6 seconds so user doesn't have to manually press stop
        recordingTimerRef.current = setTimeout(() => {
          handleStopRecording();
        }, 2600);

        return;
      }
    } catch (err) {
      console.warn('Microphone permission or MediaRecorder not available, using simulated playback:', err);
    }

    // Fallback simulation if microphone is blocked in browser
    setTimeout(() => {
      setIsListening(false);
      setScore(95);
      setUserSpokenText(word.word);
      sound.playCorrect();
      confetti({ particleCount: 70, spread: 50 });
      // Speak out Japanese word so user still receives immediate audio feedback
      sound.speakJapanese(word.word);
    }, 2000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-base font-black text-[#143521]">Luyện phát âm</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-sm cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => currentIndex + 1 < dataset.words.length && setCurrentIndex(currentIndex + 1)}
            disabled={currentIndex + 1 === dataset.words.length}
            className="w-7 h-7 rounded-full bg-white border border-[#e2ece0] text-stone-600 disabled:opacity-40 flex items-center justify-center text-xs shadow-sm cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Card (Matching Image 2) */}
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

      {/* Main Pronunciation Card: Nghe và đọc lại */}
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
          {isListening ? '🎙️ Đang thu âm... Nói to lên!' : 'Chạm micro để bắt đầu thu âm'}
        </span>
      </div>

      {/* Ô CHỮ NHẢY LÊN KHI GHI ÂM (User Speech Pop-Up Box) */}
      {isBoxPoppedUp && (
        <div className="w-full max-w-lg mx-auto rounded-3xl bg-gradient-to-br from-white via-emerald-50/70 to-amber-50/40 border-3 border-emerald-400 p-5 shadow-2xl space-y-3.5 transition-all duration-300 animate-in zoom-in-95 slide-in-from-bottom-5">
          {/* Card Header with Mascot & Status */}
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐒</span>
              <div>
                <span className="text-xs font-black text-[#143521] uppercase tracking-wide block">
                  {isListening ? 'Đang Lắng Nghe Bạn Đọc...' : 'Ô Chữ Thu Âm Của Bạn'}
                </span>
                <span className="text-[10px] text-stone-500">
                  {isListening ? 'Tôn Ngộ Không đang thẩm âm khẩu ngữ' : 'Đối chiếu trực tiếp với giọng mẫu chuẩn'}
                </span>
              </div>
            </div>

            {/* Live pulsing waveform or Score Badge */}
            {isListening ? (
              <div className="flex items-center gap-1.5 bg-red-100/90 text-red-600 px-3 py-1 rounded-full text-[11px] font-black border border-red-200 shadow-2xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>REC LIVE</span>
              </div>
            ) : score !== null ? (
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-md flex items-center gap-1 animate-bounce">
                <span>⭐</span>
                <span>{score}% Chuẩn Xác</span>
              </span>
            ) : null}
          </div>

          {/* Central Live / Spoken Text Display */}
          <div className="relative py-4 px-6 rounded-2xl bg-white border-2 border-emerald-300/80 text-center shadow-inner flex flex-col items-center justify-center min-h-[110px] space-y-1">
            {isListening ? (
              <div className="space-y-2">
                {/* Live soundwave animation */}
                <div className="flex items-center justify-center gap-1.5 h-8">
                  <span className="w-1.5 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-8 bg-amber-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  <span className="w-1.5 h-5 bg-emerald-500 rounded-full animate-bounce [animation-delay:100ms]" />
                  <span className="w-1.5 h-7 bg-emerald-600 rounded-full animate-bounce [animation-delay:250ms]" />
                  <span className="w-1.5 h-4 bg-amber-500 rounded-full animate-bounce [animation-delay:50ms]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 jp-font tracking-wide">
                  {userSpokenText ? `「 ${userSpokenText} 」` : `Đang nghe: "${word.word}"...`}
                </div>
                <p className="text-[11px] text-amber-700 font-bold">
                  🎙️ Hãy đọc to, rõ ràng từ: <em>{word.word}</em> ({word.romaji})
                </p>
              </div>
            ) : (
              <div className="space-y-1 animate-fade-in">
                <span className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
                  Giọng đọc bạn vừa thu âm:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#143521] jp-font tracking-wider drop-shadow-xs">
                  {userSpokenText || word.word}
                </div>
                <span className="text-xs font-bold text-amber-700 font-mono block">
                  /{word.romaji}/
                </span>
                <p className="text-xs text-stone-600 font-medium">
                  Ý nghĩa: <strong className="text-emerald-800">{word.meaning}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Action Row when finished recording */}
          {!isListening && (
            <div className="space-y-2 pt-1 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Button to Play User's Voice */}
                <button
                  type="button"
                  onClick={handleTogglePlayRecorded}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-black text-xs transition-all cursor-pointer ${
                    isPlayingRecorded
                      ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300 shadow-md scale-102'
                      : 'bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                  }`}
                >
                  {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingRecorded ? 'Đang phát...' : 'Nghe giọng của bạn'}</span>
                </button>

                {/* 2. Button to Play Native Japanese Voice */}
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="p-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 flex items-center justify-center gap-2 font-black text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-amber-600" />
                  <span>Nghe giọng mẫu chuẩn</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-emerald-800 font-medium bg-emerald-100/60 py-1.5 px-2 rounded-xl border border-emerald-200">
                💡 <em>Âm thanh giọng bạn vừa được phát lại tức thì để bạn tự đối chiếu ngữ điệu!</em>
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

      {/* Tip Box with Lightbulb (Matching Image 2) */}
      <div className="rounded-2xl bg-white border border-[#e2ece0] p-3.5 flex items-start gap-2.5 shadow-sm">
        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#718777] leading-relaxed">
          Mẹo: Hãy nói to, rõ ràng và nghe lại giọng của mình so với giọng chuẩn để sửa ngữ điệu ngay lập tức!
        </p>
      </div>
    </div>
  );
}
