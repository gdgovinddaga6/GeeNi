import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock3, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EventsStory } from '@/components/events/EventsStory';

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
  const items = [
    { id: 'mayra', title: 'MAYRA', subtitle: 'A celebration of blessings, family and traditions.', date: '2 DECEMBER', image: '/events/mayra.jpg' },
    { id: 'haldi', title: 'HALDI', subtitle: 'A radiant morning filled with color and blessings.', date: '3 DECEMBER', image: '/events/haldi.jpg' },
    { id: 'sangeet', title: 'SANGEET', subtitle: 'An evening of music, movement and memories.', date: '4 DECEMBER', image: '/events/sangeet.jpg' },
    { id: 'wedding', title: 'THE WEDDING', subtitle: '', date: '5 DECEMBER', image: '/events/ceremony.jpg' },
    { id: 'reception', title: 'RECEPTION', subtitle: 'An elegant evening of toasts and celebration.', date: '6 DECEMBER', image: '/events/reception.jpg' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">Events</p>
        <h1 className="mt-3 font-display text-5xl text-ink">OUR CELEBRATIONS</h1>
        <p className="mt-4 text-lg text-muted">Five moments. One beautiful beginning.</p>
        <div className="mt-6 text-sm text-muted">#GeeNi</div>
      </header>

      <EventsStory items={items} />
    </div>
  );
}
