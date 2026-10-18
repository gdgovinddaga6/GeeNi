import { EventCarousel } from '@/components/events/EventCarousel';
import { EventSchedule } from '@/components/events/EventSchedule';
import { featuredEvents, schedule } from '@/lib/schedule';

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">Events</p>
        <h1 className="mt-3 font-display text-5xl text-ink">OUR CELEBRATIONS</h1>
        <div className="mt-6 text-sm text-muted">#GeeNi</div>
      </header>

      <div className="mb-16">
        <EventCarousel events={featuredEvents} label="Wedding celebrations" />
      </div>

      <EventSchedule days={schedule} />
    </div>
  );
}
