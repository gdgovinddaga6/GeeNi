'use client';

import clsx from 'clsx';

export function FloatingNav({ count, active, onSelect }: { count: number; active: number; onSelect: (i: number) => void }) {
  return (
    <nav className="fixed right-6 top-1/3 z-50 hidden md:flex flex-col items-center gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={clsx(
            'w-10 text-center text-xs tracking-widest',
            'transition-opacity duration-300',
            active === i ? 'opacity-100 font-medium text-ink' : 'opacity-40 text-muted'
          )}
          aria-current={active === i}
        >
          {String(i + 1).padStart(2, '0')}
        </button>
      ))}
      <div className="mt-3 h-12 w-[1px] bg-[#eee]" />
    </nav>
  );
}
