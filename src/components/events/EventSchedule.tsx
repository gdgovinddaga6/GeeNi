import Link from 'next/link';
import { CalendarDays, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDay, formatTimeRange, getGoogleCalendarLink, type ScheduleDay } from '@/lib/schedule';

export function EventSchedule({ days }: { days: ScheduleDay[] }) {
  return (
    <section aria-labelledby="schedule-heading" className="mb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="schedule-heading" className="font-display text-3xl text-ink">
          Schedule
        </h2>
        <Button asChild variant="secondary" size="sm">
          <Link href="/wedding-invite.ics">
            <CalendarDays className="mr-2 h-4 w-4" aria-hidden="true" />
            Add all events to calendar
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {days.map((day) => (
          <Card key={day.date}>
            <CardContent>
              <h3 className="font-display text-2xl text-ink">
                <time dateTime={day.date}>{formatDay(day.date)}</time>
              </h3>
              <ol className="divide-y divide-[#efe6db]">
                {day.events.map((event) => (
                  <li key={event.id} className="flex items-center gap-4 py-3">
                    <div className="flex-1">
                      <time dateTime={event.start} className="block text-sm tabular-nums text-muted">
                        {formatTimeRange(event)}
                      </time>
                      <span className="text-ink">{event.name}</span>
                    </div>
                    <a
                      href={getGoogleCalendarLink(event)}
                      target="_blank"
                      rel="noreferrer"
                      title={`Add ${event.name} to Google Calendar`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
                    >
                      <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Add {event.name} to Google Calendar</span>
                    </a>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
