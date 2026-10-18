'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ICS_PATH = '/wedding-invite.ics';

// Android's Google Calendar app can't open a downloaded .ics file, so Google users subscribe to the
// feed instead: Google fetches it from this site and adds every event as its own calendar.
function getGoogleSubscribeLink(origin: string): string {
  const feed = `${origin}${ICS_PATH}`.replace(/^https?:/, 'webcal:');
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(feed)}`;
}

export function AddToCalendar({ className }: { className?: string }) {
  // The feed URL needs the deployed origin, which is only known in the browser.
  const [googleLink, setGoogleLink] = useState('https://calendar.google.com/calendar/r');

  useEffect(() => {
    setGoogleLink(getGoogleSubscribeLink(window.location.origin));
  }, []);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Button asChild variant="secondary" className="justify-center">
        <Link href={ICS_PATH}>Apple Calendar</Link>
      </Button>
      <Button asChild variant="secondary" className="justify-center">
        <a href={googleLink} target="_blank" rel="noreferrer">
          Google Calendar
        </a>
      </Button>
    </div>
  );
}
