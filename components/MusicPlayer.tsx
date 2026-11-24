"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music, Volume2, VolumeX, Sparkles, Disc, Pause, Play, Heart } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [songTitle, setSongTitle] = useState<string>("Can't Help Falling in Love (Music Box)");
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Romantic music box notes (pentatonic / major 7th romantic lullaby arpeggios)
  // Frequencies for: C4, E4, G4, B4, C5, D5, E5, G5, A4, F4
  const chords = [
    // C Major 7th
    [261.63, 329.63, 392.0, 493.88, 523.25],
    // A Minor 7th
    [220.0, 261.63, 329.63, 392.0, 440.0],
    // F Major 7th
    [174.61, 220.0, 261.63, 329.63, 349.23],
    // G Dominant / Sus
    [196.0, 246.94, 293.66, 392.0, 493.88],
  ];

  const playSynthesizedTone = (freq: number, duration: number, timeOffset: number) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;

    // Create oscillator with warm music box sound (sine + soft triangle harmonics)
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);

    // Warm bell attack and gentle exponential decay
    const startTime = ctx.currentTime + timeOffset;
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.25, startTime + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  };

  const startSynthesizedMusic = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (!gainNodeRef.current) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(isMuted ? 0 : volume * 0.4, ctx.currentTime);
      g.connect(ctx.destination);
      gainNodeRef.current = g;
    }

    let chordIdx = 0;
    const playMeasure = () => {
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      // Arpeggiate chord like a sweet music box
      currentChord.forEach((note, i) => {
        const offset = i * 0.28;
        playSynthesizedTone(note, 1.4, offset);
      });

      // Add a sparkling high note
      const highNote = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
      playSynthesizedTone(highNote, 1.8, 0.7);
    };

    playMeasure();
    intervalRef.current = window.setInterval(playMeasure, 2000);
  };

  const stopSynthesizedMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSynthesizedMusic();
      setIsPlaying(false);
    } else {
      if (customAudioUrl && audioElementRef.current) {
        audioElementRef.current.play().catch(() => {});
      } else {
        startSynthesizedMusic();
      }
      setIsPlaying(true);
    }
  };

  // Adjust volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        isMuted ? 0 : volume * 0.4,
        audioCtxRef.current.currentTime
      );
    }
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopSynthesizedMusic();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopSynthesizedMusic();
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setSongTitle(file.name.replace(/\.[^/.]+$/, ""));
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="bg-[#190610]/90 backdrop-blur-md border border-rose-500/30 shadow-2xl rounded-full p-2.5 flex items-center gap-3 transition-all duration-300 hover:border-rose-400">
        {/* Animated Vinyl Disc Icon */}
        <button
          onClick={togglePlay}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-lg shadow-rose-500/40 transition-transform ${
            isPlaying ? "animate-spin-slow" : "hover:scale-105"
          }`}
          title={isPlaying ? "Pause music" : "Play romantic melody"}
        >
          <Disc className="w-7 h-7" />
          <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#190610] flex items-center justify-center">
            <Heart className="w-2 h-2 text-rose-400 fill-rose-400" />
          </div>
        </button>

        {/* Info & Controls */}
        <div className="pr-3 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-rose-200 tracking-wide flex items-center gap-1">
              {isPlaying && (
                <span className="flex gap-0.5 items-end h-3 mr-1">
                  <span className="w-0.5 bg-rose-400 h-2 animate-pulse" />
                  <span className="w-0.5 bg-pink-400 h-3 animate-pulse delay-75" />
                  <span className="w-0.5 bg-rose-300 h-1.5 animate-pulse delay-150" />
                </span>
              )}
              {songTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={togglePlay}
              className="text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-rose-300 text-rose-300" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-rose-300 text-rose-300" /> Play Melody
                </>
              )}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-rose-300/80 hover:text-rose-200 transition-colors p-0.5"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-14 h-1 bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
              title="Volume"
            />

            {/* Custom Song Input Option */}
            <label
              htmlFor="custom-song-upload"
              className="text-[10px] text-rose-400/70 hover:text-rose-300 cursor-pointer underline ml-1"
              title="Upload your special couple song (MP3)"
            >
              Our Song?
            </label>
            <input
              id="custom-song-upload"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {customAudioUrl && (
        <audio
          ref={audioElementRef}
          src={customAudioUrl}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
