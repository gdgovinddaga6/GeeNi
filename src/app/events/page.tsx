import { EventsStory } from '@/components/events/EventsStory';

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
