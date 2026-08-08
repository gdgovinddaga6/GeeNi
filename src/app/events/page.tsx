import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock3, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const events = [
  {
    title: 'Mayra',
    time: 'Friday · 6:00 PM',
    location: 'Garden Courtyard',
    dress: 'Traditional Indian attire',
    description: 'An intimate evening of blessings, music, and the warmth of family gathering together.',
    accent: 'from-[#f4d9c9] to-[#f8f1e4]',
    tint: 'text-[#7a564d]',
  },
  {
    title: 'Sangeet',
    time: 'Saturday · 7:30 PM',
    location: 'Grand Lawn',
    dress: 'Festive and vibrant',
    description: 'A joyful night of dance, laughter, and celebrations glowing under the evening sky.',
    accent: 'from-[#f0e3b7] to-[#f9f0d3]',
    tint: 'text-[#7c6540]',
  },
  {
    title: 'Haldi',
    time: 'Sunday · 11:00 AM',
    location: 'Poolside Terrace',
    dress: 'Bright and cheerful',
    description: 'A radiant morning filled with color, blessings, and happy memories in bloom.',
    accent: 'from-[#dfe9cf] to-[#f2f5e8]',
    tint: 'text-[#4f6848]',
  },
  {
    title: 'Reception',
    time: 'Sunday · 8:00 PM',
    location: 'Ballroom',
    dress: 'Indian formal',
    description: 'A refined evening of elegance, toasts, and a heartfelt welcome for our loved ones.',
    accent: 'from-[#e8d8d5] to-[#f5efe8]',
    tint: 'text-[#775e5e]',
  },
  {
    title: 'Wedding Ceremony',
    time: 'Dec 02 · 6:30 PM',
    location: 'Mandap Garden',
    dress: 'Traditional attire',
    description: 'The centerpiece of the weekend — a beautiful, sacred moment surrounded by love and family.',
    accent: 'from-[#d5d9c8] to-[#edf1dc]',
    tint: 'text-[#586149]',
  },
];

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">Events</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">A weekend of cherished moments</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Every celebration has been thoughtfully planned to feel warm, graceful, and beautifully paced.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Image
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
          alt="Wedding events at a luxury resort"
          width={900}
          height={1100}
          className="h-[480px] w-full rounded-[32px] object-cover"
        />

        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.title} className={`border-none bg-gradient-to-br ${event.accent} p-0 shadow-soft`}>
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className={`text-xs uppercase tracking-[0.3em] ${event.tint}`}>Celebration</div>
                    <h2 className="mt-1 font-display text-3xl text-ink">{event.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">{event.description}</p>
                  </div>
                  <div className="rounded-full border border-[#f0e2d5] bg-white/60 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#4a4d4d]">
                    {event.time}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#4f4f4f]">
                  <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" />{event.time}</span>
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{event.location}</span>
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" />{event.dress}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button asChild>
          <Link href="/venue">Open Venue Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/rsvp">RSVP Now</Link>
        </Button>
      </div>
    </div>
  );
}
