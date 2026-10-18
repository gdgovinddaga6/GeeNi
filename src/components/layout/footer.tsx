import Link from 'next/link';
import { Phone } from 'lucide-react';
import { contacts, formatPhone } from '@/lib/contacts';

export function Footer() {
  return (
    <footer className="border-t border-[#efe6db] bg-white/70">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <section aria-labelledby="footer-contact-heading">
          <p className="text-sm uppercase tracking-[0.4em] text-rose">Contact</p>
          <h2 id="footer-contact-heading" className="mt-3 font-display text-3xl text-ink">
            Questions? Give us a call.
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {contacts.map((contact) => (
              <li key={contact.phone}>
                <a
                  href={`tel:${contact.phone}`}
                  className="group flex items-center gap-4 rounded-[20px] border border-[#efe6db] bg-white p-4 transition hover:border-[#d9b7a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7efe7] text-rose">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl text-ink">{contact.name}</span>
                    <span className="block whitespace-nowrap text-sm tabular-nums text-muted group-hover:text-rose">
                      {formatPhone(contact.phone)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-col gap-6 border-t border-[#efe6db] pt-8 lg:flex-row lg:items-center lg:justify-between">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
