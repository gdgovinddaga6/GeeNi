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
      { id: 'ghee-pilai', name: 'Ghee Pilai', start: '2026-11-30T15:01' },
      // TODO: confirm the name of this ritual; the handwritten schedule is hard to read here.
      { id: 'bana-banana', name: 'Bana Banana', start: '2026-11-30T15:31' },
      { id: 'mayra', name: 'Mayra', start: '2026-11-30T17:30' },
      { id: 'milni', name: 'Milni', start: '2026-11-30T18:00' },
      { id: 'tilak', name: 'Tilak', start: '2026-11-30T19:31' },
      { id: 'sangeet', name: 'Sangeet', start: '2026-11-30T20:31' },
    ],
  },
  {
    date: '2026-12-01',
    events: [
      { id: 'chaak-muhurat', name: 'Chaak Muhurat', start: '2026-12-01T08:01' },
      { id: 'vinayak-sthapana', name: 'Vinayak Sthapana', start: '2026-12-01T10:31' },
      { id: 'lunch-dec-1', name: 'Lunch', start: '2026-12-01T12:00', end: '2026-12-01T13:00' },
      { id: 'haldi', name: 'Haldi', start: '2026-12-01T13:31', end: '2026-12-01T15:30' },
      { id: 'nikasi', name: 'Nikasi', start: '2026-12-01T17:01' },
      { id: 'toran-baraat-swagat', name: 'Toran & Baraat Swagat', start: '2026-12-01T18:31' },
      { id: 'reception', name: 'Reception', start: '2026-12-01T20:31' },
    ],
  },
  {
    date: '2026-12-02',
    events: [
      // TODO: confirm the name of this ritual; the handwritten schedule is hard to read here.
      { id: 'varmala', name: 'Varmala', start: '2026-12-02T08:31' },
      { id: 'phere', name: 'Phere', start: '2026-12-02T09:31' },
      { id: 'sajjan-goth', name: 'Lunch – Sajjan Goth', start: '2026-12-02T11:31' },
      { id: 'pehravani', name: 'Pehravani', start: '2026-12-02T12:01' },
    ],
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
