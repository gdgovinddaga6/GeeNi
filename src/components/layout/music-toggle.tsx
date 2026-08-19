'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';

// TODO: The song file is not committed to the repository. Copy
// "Can't help falling in love.mp3" into public/audio/ and rename it to
// cant-help-falling-in-love.mp3 so this path resolves.
const MUSIC_SRC = '/audio/cant-help-falling-in-love.mp3';

// Design System (docs/03_Design_System/Motion_System.md):
// music never autoplays, the guest enables it explicitly, the choice is
// remembered in local storage, and the default state is muted.
const STORAGE_KEY = 'geeni:music-enabled';

// Background ambience should sit under the experience, not dominate it.
const MUSIC_VOLUME = 0.4;

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [needsGesture, setNeedsGesture] = useState(false);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    console.debug('[MusicToggle] attempting play, isMuted=', audio.muted, 'src=', MUSIC_SRC);

    audio.volume = MUSIC_VOLUME;

    try {
      await audio.play();
      setIsPlaying(true);
      setNeedsGesture(false);
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') void audioCtxRef.current.resume();
      return true;
    } catch (err) {
      console.debug('[MusicToggle] audible play() rejected:', err);
      // Try muted autoplay fallback
      try {
        audio.muted = true;
        console.debug('[MusicToggle] attempting muted autoplay fallback');
        await audio.play();
        setIsPlaying(true);
        setNeedsGesture(true);
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') void audioCtxRef.current.resume();
        return true;
      } catch {
        console.debug('[MusicToggle] muted autoplay also failed');
        setNeedsGesture(true);
        return false;
      }
    }
  }, []);

  useEffect(() => {
      // Only auto-attempt playback if the guest explicitly granted permission.
      // Treat legacy 'true' value as unset so we always ask for consent.
      const pref = window.localStorage.getItem(STORAGE_KEY);
      if (pref === 'denied' || pref === 'false') return;
      if (pref !== 'granted') return;

    const resume = () => void play();
    let cancelled = false;

    void play().then((started) => {
      console.debug('[MusicToggle] play() started=', started);
      if (!started && !cancelled) {
        setNeedsGesture(true);
        window.addEventListener('pointerdown', resume, { once: true });
        window.addEventListener('keydown', resume, { once: true });
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };
  }, [play]);

  // Listen for consent granted event dispatched by the global consent overlay.
  useEffect(() => {
    const handler = () => {
      void play();
    };
    window.addEventListener('geeni:audio-consent', handler as EventListener);
    return () => window.removeEventListener('geeni:audio-consent', handler as EventListener);
  }, [play]);

  useEffect(() => {
    let mounted = true;
    void fetch(MUSIC_SRC, { method: 'HEAD' })
      .then((res) => {
        if (!mounted) return;
        console.debug('[MusicToggle] HEAD', MUSIC_SRC, 'status=', res.status);
        setAvailable(res.ok);
      })
      .catch(() => {
        if (!mounted) return;
        console.debug('[MusicToggle] HEAD request failed');
        setAvailable(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    // Create AudioContext and connect media element to help unlocking audio
      try {
        type Win = Window & { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
        const win = window as Win;
        const Ctor = win.AudioContext ?? win.webkitAudioContext;
        if (!Ctor) return;
        if (!audioCtxRef.current) audioCtxRef.current = new Ctor();
        const audio = audioRef.current;
        if (audio && audioCtxRef.current) {
          try {
            const src = audioCtxRef.current.createMediaElementSource(audio);
            src.connect(audioCtxRef.current.destination);
          } catch {}
        }
      } catch {}
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      window.localStorage.setItem(STORAGE_KEY, 'denied');
      return;
    }

    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
      audio.muted = false;
      await audio.play();
      setIsPlaying(true);
      setNeedsGesture(false);
      window.localStorage.setItem(STORAGE_KEY, 'granted');
    } catch (err) {
      console.debug('[MusicToggle] toggle play error', err);
      const started = await play();
      window.localStorage.setItem(STORAGE_KEY, started ? 'granted' : 'denied');
      if (!started) setNeedsGesture(true);
    }
  };

  const requestGesture = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
      audio.muted = false;
      console.debug('[MusicToggle] requestGesture: attempting play after user gesture');
      await audio.play();
      setIsPlaying(true);
      setNeedsGesture(false);
      window.localStorage.setItem(STORAGE_KEY, 'granted');
    } catch {
      console.debug('[MusicToggle] requestGesture: play failed even after gesture');
      setNeedsGesture(true);
    }
  };

  return (
    <>
      {/* preload="none" keeps the song off the critical path until enabled */}
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="none" aria-hidden="true" />
      <button
        type="button"
        onClick={() => void toggle()}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        title={
          available === false
            ? 'Background music file missing'
            : isPlaying
            ? 'Pause background music'
            : 'Play background music'
        }
        aria-disabled={available === false}
        disabled={available === false}
        className={
          'rounded-full border border-[#e6dbce] bg-white p-2 text-ink transition hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory' +
          (available === false ? ' opacity-50 cursor-not-allowed' : '')
        }
      >
        {isPlaying ? <Music className="h-5 w-5 text-rose" /> : <VolumeX className="h-5 w-5" />}
      </button>

      {needsGesture && available !== false && !isPlaying ? (
        <div className="fixed inset-x-4 bottom-6 z-50 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-[12px] border border-[#e8e2d7] bg-white/95 px-4 py-3 shadow-md">
            <p className="text-sm">Enable background music for the best experience.</p>
            <button onClick={() => void requestGesture()} className="ml-2 rounded bg-rose px-3 py-1 text-white">
              Enable
            </button>
            <button
              onClick={() => {
                window.localStorage.setItem(STORAGE_KEY, 'false');
                setNeedsGesture(false);
                const audio = audioRef.current;
                if (audio) {
                  audio.pause();
                  audio.muted = false;
                }
                setIsPlaying(false);
              }}
              className="ml-2 rounded border border-[#e6dbce] bg-white px-3 py-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
