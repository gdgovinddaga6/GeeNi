'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'geeni:music-enabled';

export function AudioConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pref = window.localStorage.getItem(STORAGE_KEY);
    // Show overlay if preference unset or legacy 'true' (treat legacy as unset)
    if (pref === null || pref === 'true') setVisible(true);
  }, []);

  const allow = async () => {
    // Persist consent and dispatch event synchronously during the user gesture
    window.localStorage.setItem(STORAGE_KEY, 'granted');
    // Dispatch a custom event listeners (like MusicToggle) can respond to.
    window.dispatchEvent(new Event('geeni:audio-consent'));
    setVisible(false);
  };

  const decline = () => {
    window.localStorage.setItem(STORAGE_KEY, 'denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="max-w-xl rounded-2xl bg-white p-8 text-center shadow-lg">
        <h2 className="mb-2 text-2xl font-display">Hello, lovely guest!</h2>
        <p className="mb-4 text-sm text-muted">
          We would love to play a gentle song in the background to set the mood. May we play soft music while you browse?
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => void allow()} className="rounded bg-rose px-4 py-2 text-white">
            Yes, play music 🎵
          </button>
          <button onClick={decline} className="rounded border border-[#e6dbce] bg-white px-4 py-2">
            No, thanks
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">You can change this anytime using the music control in the header.</p>
      </div>
    </div>
  );
}
