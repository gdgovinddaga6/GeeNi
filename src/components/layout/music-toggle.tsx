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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    audio.volume = MUSIC_VOLUME;

    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      // Playback can fail when the browser blocks audio before the first
      // user interaction, or when the audio file is missing.
      return false;
    }
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) !== 'true') return;

    const resume = () => {
      void play();
    };

    let cancelled = false;

    void play().then((started) => {
      // Browsers block audible playback until the guest interacts with the
      // page, so resume their saved preference on the first tap or key press.
      if (!started && !cancelled) {
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

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      window.localStorage.setItem(STORAGE_KEY, 'false');
    } else {
      const started = await play();
      window.localStorage.setItem(STORAGE_KEY, started ? 'true' : 'false');
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
        title={isPlaying ? 'Pause background music' : 'Play background music'}
        className="rounded-full border border-[#e6dbce] bg-white p-2 text-ink transition hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        {isPlaying ? (
          <Music className="h-5 w-5 text-rose" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </button>
    </>
  );
}
