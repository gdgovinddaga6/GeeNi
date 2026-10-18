import { EventSchedule } from '@/components/events/EventSchedule';
import { EventsStory } from '@/components/events/EventsStory';
import { formatShortDay, formatTimeRange, getEvent, schedule } from '@/lib/schedule';

function eventDate(id: string) {
  const event = getEvent(id);
  return `${formatShortDay(event.start)} · ${formatTimeRange(event)}`.toUpperCase();
}

export default function EventsPage() {
  const items = [
    { id: 'mayra', title: 'MAYRA', subtitle: 'A celebration of blessings, family and traditions.', date: eventDate('mayra'), image: '/events/mayra.jpg' },
    { id: 'sangeet', title: 'SANGEET', subtitle: 'An evening of music, movement and memories.', date: eventDate('sangeet'), image: '/events/sangeet.jpg' },
    { id: 'haldi', title: 'HALDI', subtitle: 'A radiant afternoon filled with color and blessings.', date: eventDate('haldi'), image: '/events/haldi.jpg' },
    { id: 'reception', title: 'RECEPTION', subtitle: 'An elegant evening of toasts and celebration.', date: eventDate('reception'), image: '/events/reception.jpg' },
    { id: 'wedding', title: 'THE WEDDING', subtitle: '', date: eventDate('phere'), image: '/events/ceremony.jpg' },
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
