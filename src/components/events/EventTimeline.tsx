import { CalendarDays, CalendarPlus } from 'lucide-react';
import { AddToCalendar } from '@/components/calendar/AddToCalendar';
import { PosterLightbox } from '@/components/events/PosterLightbox';
import { cn } from '@/lib/utils';
import {
  featuredEvents,
  formatDay,
  formatTimeRange,
  getGoogleCalendarLink,
  type ScheduleDay,
  type ScheduleEvent,
} from '@/lib/schedule';

// The rail runs down the node column; every node is centred on this same left offset.
const RAIL = 'left-[15px] sm:left-[19px]';

function CalendarLink({ event, name, withLabel = false }: { event: ScheduleEvent; name: string; withLabel?: boolean }) {
  return (
    <a
      href={getGoogleCalendarLink(event)}
      target="_blank"
      rel="noreferrer"
      title={`Add ${name} to Google Calendar`}
      className={cn(
        'flex h-11 shrink-0 items-center rounded-full text-muted transition-colors hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose',
        withLabel ? 'w-fit gap-2 text-xs' : 'w-11 justify-center',
      )}
    >
      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
      {withLabel ? <span aria-hidden="true">Add to calendar</span> : null}
      <span className="sr-only">Add {name} to Google Calendar</span>
    </a>
  );
}

function TimelineStop({ event, priority = false }: { event: ScheduleEvent; priority?: boolean }) {
  const featured = featuredEvents[event.id];

  if (featured) {
    return (
      <li className="relative py-3 pl-12 sm:pl-16">
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ivory bg-rose ring-2 ring-rose sm:h-5 sm:w-5',
            RAIL,
          )}
        />
        <article className="flex gap-4 rounded-[24px] border border-[#efe6db] bg-white/80 p-3 shadow-soft sm:gap-6 sm:p-4">
          <PosterLightbox src={featured.image} title={featured.title} priority={priority} />
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <time dateTime={event.start} className="text-xs font-medium uppercase tracking-[0.12em] text-rose">
              {featured.time}
            </time>
            <h4 className="mt-1 font-display text-2xl uppercase leading-tight tracking-[0.06em] text-ink sm:text-3xl">
              {featured.title}
            </h4>
            {featured.subtitle ? <p className="mt-1 text-sm leading-6 text-muted">{featured.subtitle}</p> : null}
            <div className="-mb-2 mt-1">
              <CalendarLink event={event} name={featured.title} withLabel />
            </div>
          </div>
        </article>
      </li>
    );
  }

  return (
    <li className="relative py-1 pl-12 sm:pl-16">
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose bg-ivory',
          RAIL,
        )}
      />
      <div className="flex items-center gap-3 pl-4 sm:pl-5">
        <div className="min-w-0 flex-1">
          <time dateTime={event.start} className="block text-xs tabular-nums text-muted">
            {formatTimeRange(event)}
          </time>
          <span className="text-ink">{event.name}</span>
        </div>
        <CalendarLink event={event} name={event.name} />
      </div>
    </li>
  );
}

export function EventTimeline({ days }: { days: ScheduleDay[] }) {
  const firstEventId = days[0]?.events[0]?.id;

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className="mx-auto max-w-2xl scroll-mt-24">
      <h2 id="schedule-heading" className="sr-only">
        Schedule
      </h2>
      <div className="mb-10 flex flex-col items-center gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-ink">
          <CalendarDays className="h-4 w-4 text-rose" aria-hidden="true" />
          Add all events to your calendar
        </p>
        <AddToCalendar className="w-full max-w-md sm:flex-row sm:[&>*]:flex-1" />
      </div>

      <div className="relative">
        {/* One continuous rail from the first day to the last stop. */}
        <span aria-hidden="true" className={cn('absolute bottom-10 top-4 w-px -translate-x-1/2 bg-[#e6d3cf]', RAIL)} />

        {days.map((day, i) => (
          <div key={day.date} className="relative pb-10 last:pb-0">
            <h3 className="relative mb-3 flex min-h-10 flex-col justify-center pl-12 sm:pl-16">
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-xs font-medium text-white sm:h-10 sm:w-10 sm:text-sm',
                  RAIL,
                )}
              >
                {i + 1}
              </span>
              <span className="text-xs uppercase tracking-[0.3em] text-rose">Day {i + 1}</span>
              <time dateTime={day.date} className="font-display text-2xl text-ink sm:text-3xl">
                {formatDay(day.date)}
              </time>
            </h3>
            <ol>
              {day.events.map((event) => (
                <TimelineStop key={event.id} event={event} priority={event.id === firstEventId} />
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
