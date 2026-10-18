import { buildScheduleIcs } from '@/lib/schedule';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildScheduleIcs(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="nidhi-govind-wedding.ics"',
    },
  });
}
