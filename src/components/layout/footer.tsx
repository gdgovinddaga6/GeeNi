import Link from 'next/link';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#efe6db] bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-2xl text-ink">GeeNi</p>
          <p className="mt-2 max-w-md text-sm text-muted">
            A timeless celebration of love, tradition, and memory for Nidhi Bang and Govind Daga.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <Link href="/contact" className="transition hover:text-ink">
            Contact
          </Link>
          <Link href="/faq" className="transition hover:text-ink">
            FAQ
          </Link>
          <a href="mailto:hello@geeni.in" className="flex items-center gap-2 transition hover:text-ink">
            <Mail className="h-4 w-4" />
            hello@geeni.in
          </a>
        </div>
      </div>
    </footer>
  );
}
