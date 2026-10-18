import { EventSchedule } from '@/components/events/EventSchedule';
import { EventsStory } from '@/components/events/EventsStory';
import { schedule } from '@/lib/schedule';

export default function EventsPage() {
  const items = [
    { id: 'mayra', title: 'MAYARA', subtitle: 'A celebration of blessings, family and traditions.', date: '5:30 PM onwards | Monday, 30th November 2026', image: '/events/mayra.jpg' },
    { id: 'sangeet', title: 'SANGEET', subtitle: 'An evening of music, movement and memories.', date: '8:31 PM onwards | Monday, 30th November 2026', image: '/events/sangeet.jpg' },
    { id: 'haldi', title: 'HALDI', subtitle: 'A radiant afternoon filled with color and blessings.', date: '1:31 PM onwards | Tuesday, 1st December 2026', image: '/events/haldi.jpg' },
    { id: 'reception', title: 'RECEPTION', subtitle: 'An elegant evening of toasts and celebration.', date: '8:31 PM onwards | Tuesday, 1st December 2026', image: '/events/reception.jpg' },
    { id: 'wedding', title: 'SHAADI', subtitle: '', date: '9:31 AM | Wednesday, 2nd December 2026', image: '/events/ceremony.jpg' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">Events</p>
        <h1 className="mt-3 font-display text-5xl text-ink">OUR CELEBRATIONS</h1>
        <div className="mt-6 text-sm text-muted">#GeeNi</div>
      </header>

      <EventSchedule days={schedule} />

      <EventsStory items={items} />
    </div>
  );
}
