'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CalendarDays, Heart, Menu, X } from 'lucide-react';
import { features, type FeatureName } from '@/lib/config/features';

const links: Array<{ href: string; label: string; feature?: FeatureName }> = [
  { href: '/events', label: 'Events' },
  { href: '/venue', label: 'Venue' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/upload', label: 'Upload', feature: 'upload' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const visibleLinks = links.filter((link) => !link.feature || features[link.feature]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#efe6db] bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-ink" aria-label="GeeNi home page">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6dbce] bg-white shadow-sm">
            <Heart className="h-5 w-5 text-rose" />
          </div>
          <div>
            <p className="font-display text-xl leading-none">GeeNi</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Nidhi & Govind</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {visibleLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/rsvp"
            className="inline-flex items-center gap-2 rounded-full border border-[#e6dbce] bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-rose hover:text-rose"
          >
            <CalendarDays className="h-4 w-4" />
            RSVP
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-[#e6dbce] bg-white p-2 md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="h-5 w-5 text-ink" /> : <Menu className="h-5 w-5 text-ink" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-[#efe6db] bg-ivory md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8" aria-label="Mobile navigation">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-muted transition hover:bg-white hover:text-ink"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/rsvp"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-[#e6dbce] bg-white px-4 py-3 text-sm font-medium text-ink"
              onClick={() => setIsOpen(false)}
            >
              <CalendarDays className="h-4 w-4" />
              RSVP
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
