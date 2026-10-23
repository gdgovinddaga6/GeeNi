// Wedding schedule — single source for the events page, calendar invites and the homepage countdown.
// All times are local to the venue (IST, UTC+05:30).

export const VENUE_NAME = 'Serene Resort & Convention';
export const VENUE_ADDRESS = 'Serene Resort & Convention, Peddashapur, Shamshabad, Ranga Reddy, Telangana 509325';

const IST_OFFSET = '+05:30';
// Events without a listed end run until the next event that day, or this long if they are the last one.
const LAST_EVENT_HOURS = 2;

export type ScheduleEvent = {
  id: string;
  name: string;
  /** Local start, `YYYY-MM-DDTHH:mm` */
  start: string;
  /** Local end, `YYYY-MM-DDTHH:mm`, when the schedule lists one */
  end?: string;
};

export type ScheduleDay = {
  date: string;
  events: ScheduleEvent[];
};

export const schedule: ScheduleDay[] = [
  {
    date: '2026-11-30',
    events: [
      { id: 'mayara', name: 'Mayara', start: '2026-11-30T17:30' },
      { id: 'sangeet', name: 'Sangeet', start: '2026-11-30T20:31' },
    ],
  },
  {
    date: '2026-12-01',
    events: [
      { id: 'haldi', name: 'Haldi', start: '2026-12-01T13:31', end: '2026-12-01T15:30' },
      { id: 'reception', name: 'Reception', start: '2026-12-01T20:31' },
    ],
  },
  {
    date: '2026-12-02',
    events: [{ id: 'phere', name: 'Phere', start: '2026-12-02T09:31' }],
  },
];

export const scheduleEvents: ScheduleEvent[] = schedule.flatMap((day) => day.events);

export function getEvent(id: string): ScheduleEvent {
  const event = scheduleEvents.find((item) => item.id === id);
  if (!event) throw new Error(`Unknown schedule event: ${id}`);
  return event;
}

export function toDate(local: string): Date {
  return new Date(`${local}:00${IST_OFFSET}`);
}

/** The listed end, else the next event's start that day, else a fixed length. */
export function getEventEnd(event: ScheduleEvent): Date {
  if (event.end) return toDate(event.end);
  const day = schedule.find((item) => item.events.includes(event));
  const next = day?.events[day.events.indexOf(event) + 1];
  if (next) return toDate(next.start);
  return new Date(toDate(event.start).getTime() + LAST_EVENT_HOURS * 60 * 60 * 1000);
}

const timeFormat = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata',
});

const dayFormat = new Intl.DateTimeFormat('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'Asia/Kolkata',
});

export function formatTime(local: string): string {
  return timeFormat.format(toDate(local)).toUpperCase();
}

/** "1:31 PM" or "1:31 – 3:30 PM" when the schedule lists an end. */
export function formatTimeRange(event: ScheduleEvent): string {
  return event.end ? `${formatTime(event.start)} – ${formatTime(event.end)}` : formatTime(event.start);
}

export function formatDay(date: string): string {
  return dayFormat.format(toDate(`${date}T12:00`));
}

/** `YYYYMMDDTHHmmssZ`, the UTC form used by iCalendar and Google Calendar links. */
export function toCalendarStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

const CALENDAR_TITLE_PREFIX = 'Nidhi & Govind';

export function getCalendarTitle(event: ScheduleEvent): string {
  return `${CALENDAR_TITLE_PREFIX} – ${event.name}`;
}

export function getGoogleCalendarLink(event: ScheduleEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: getCalendarTitle(event),
    details: 'Join us for our wedding celebration. We would love to celebrate with you.',
    location: VENUE_ADDRESS,
    dates: `${toCalendarStamp(toDate(event.start))}/${toCalendarStamp(getEventEnd(event))}`,
    ctz: 'Asia/Kolkata',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

// iCalendar lines longer than 75 characters must be folded onto continuation lines that start with a space.
function foldIcsLine(line: string): string {
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += 74) parts.push(line.slice(i, i + 74));
  return parts.join('\r\n ');
}

const ICS_STAMP = '20261018T000000Z';

/** One iCalendar file with every event on the schedule. */
export function buildScheduleIcs(): string {
  const events = scheduleEvents.flatMap((event) => [
    'BEGIN:VEVENT',
    `UID:geeni-${event.id}-${event.start.replace(/[-:]/g, '')}@geeni`,
    `DTSTAMP:${ICS_STAMP}`,
    `DTSTART:${toCalendarStamp(toDate(event.start))}`,
    `DTEND:${toCalendarStamp(getEventEnd(event))}`,
    `SUMMARY:${escapeIcsText(getCalendarTitle(event))}`,
    `LOCATION:${escapeIcsText(VENUE_ADDRESS)}`,
    'END:VEVENT',
  ]);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GeeNi//Wedding Invite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Nidhi & Govind Wedding',
    ...events,
    'END:VCALENDAR',
  ]
    .map(foldIcsLine)
    .join('\r\n')
    .concat('\r\n');
}

// The main celebrations, shown as large stops on the events timeline. Keyed by schedule event id.
export type FeaturedEvent = {
  title: string;
  subtitle?: string;
  /** Display copy for the time, as given by the family. */
  time: string;
  image: string;
};

export const featuredEvents: Record<string, FeaturedEvent> = {
  mayara: { title: 'Mayra', subtitle: 'A celebration of blessings, family and traditions.', time: '5:30 PM onwards', image: '/events/mayra.png' },
  sangeet: { title: 'Sangeet', subtitle: 'An evening of music, movement and memories.', time: '8:31 PM onwards', image: '/events/sangeet.png' },
  haldi: { title: 'Haldi', subtitle: 'A radiant afternoon filled with color and blessings.', time: '1:31 PM onwards', image: '/events/haldi.png' },
  reception: { title: 'Reception', subtitle: 'An elegant evening of toasts and celebration.', time: '8:31 PM onwards', image: '/events/reception.png' },
  phere: { title: 'Phere', time: '9:31 AM', image: '/events/phere.png' },
}; 
