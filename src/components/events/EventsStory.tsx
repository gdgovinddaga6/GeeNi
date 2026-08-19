'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FloatingNav } from './FloatingNav';

type EventItem = {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  image: string;
  variant?: number;
};

export function EventsStory({ items }: { items: EventItem[] }) {
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    sentinelRefs.current = sentinelRefs.current.slice(0, items.length);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sentinelRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { root: null, threshold: 0.55 }
    );

    sentinelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  const scrollTo = (i: number) => {
    const el = sentinelRefs.current[i];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative">
      <FloatingNav count={items.length} active={active} onSelect={scrollTo} />

      <div className="md:flex md:items-stretch">
        {/* Visual column (sticky) */}
        <div className="hidden md:block md:w-2/3 md:sticky md:top-0 md:h-screen md:flex md:items-center md:justify-center">
          <div className="w-[74%] rounded-2xl overflow-hidden shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={items[active].id}
                initial={{ opacity: 0, scale: 1.08, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative h-[70vh]"
              >
                <Image src={items[active].image} alt={items[active].title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Text flow column */}
        <div className="md:w-1/3">
          {items.map((it, i) => (
            <section
              key={it.id}
              ref={(el: HTMLDivElement | null) => { sentinelRefs.current[i] = el; }}
              className="min-h-screen flex items-center px-6 md:px-8"
              aria-hidden={active !== i}
            >
              <div className="max-w-xl">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={active === i ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <div className="text-sm text-muted tracking-widest">{String(i + 1).padStart(2, '0')}</div>
                  <h2 className="mt-4 font-display text-4xl leading-tight text-ink tracking-[0.06em]">{it.title}</h2>
                  {it.subtitle ? <p className="mt-4 text-lg text-muted leading-relaxed">{it.subtitle}</p> : null}
                  {it.date ? <div className="mt-4 text-sm text-[#666]">{it.date}</div> : null}
                </motion.div>
              </div>
            </section>
          ))}

          {/* Closing section */}
          <section className="min-h-screen flex items-center px-6 md:px-8">
            <div className="max-w-xl">
              <h3 className="font-display text-3xl text-ink">AND THIS IS JUST THE BEGINNING.</h3>
              <p className="mt-4 text-muted">#GeeNi — Two families. One beautiful story.</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-6 inline-block rounded border border-[#e6dbce] px-4 py-2"
              >
                Back to top
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
