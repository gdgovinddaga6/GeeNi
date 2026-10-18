'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { FeaturedEvent } from '@/lib/schedule';

// Cards are 80% of the row on phones, half on tablets and just under a third on desktop, so the next one peeks in.
const CARD_WIDTH = 'w-[80%] sm:w-[calc(50%-0.75rem)] lg:w-[calc(30%-1rem)]';
const IMAGE_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 80vw';

const arrowClass =
  'flex h-11 w-11 items-center justify-center rounded-full border border-[#e8dfd6] bg-white text-ink transition-colors hover:border-rose hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-40';

type EventCarouselProps = {
  events: FeaturedEvent[];
  label: string;
  /** Shown to the left of the arrow buttons, e.g. a section heading. */
  children?: ReactNode;
};

export function EventCarousel({ events, label, children }: EventCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setAtStart(track.scrollLeft <= 1);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !(card instanceof HTMLElement)) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>{children}</div>
        <div className="hidden shrink-0 gap-3 sm:flex">
          <button type="button" className={arrowClass} onClick={() => scrollByCard(-1)} disabled={atStart} aria-label="Previous events">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" className={arrowClass} onClick={() => scrollByCard(1)} disabled={atEnd} aria-label="Next events">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:-mx-10 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event, i) => (
          <li
            key={event.id}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${events.length}: ${event.title}`}
            className={`${CARD_WIDTH} shrink-0 snap-start overflow-hidden rounded-[24px] border border-[#efe6db] bg-white/80 shadow-soft`}
          >
            <div className="relative aspect-[4/5]">
              <Image src={event.image} alt="" fill sizes={IMAGE_SIZES} className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-3xl uppercase tracking-[0.06em] text-ink">{event.title}</h3>
              <p className="mt-2 text-sm font-medium text-ink">{event.time}</p>
              <p className="text-sm text-ink">{event.day}</p>
              {event.subtitle ? <p className="mt-3 text-sm leading-6 text-muted">{event.subtitle}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
