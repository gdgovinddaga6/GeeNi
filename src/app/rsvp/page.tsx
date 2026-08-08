import Link from 'next/link';
import { ArrowRight, CalendarHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RSVPPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">RSVP</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Let us know you&apos;ll be there</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Please share your attendance and any special requests so we can make the celebration feel effortless for everyone.
        </p>
      </div>
      <Card className="mt-10 border-[#efe3d5] bg-white/85">
        <CardContent>
          <div className="flex items-center gap-3">
            <CalendarHeart className="h-5 w-5 text-rose" />
            <h2 className="font-display text-2xl text-ink">RSVP details</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            This version of the experience includes a refined RSVP landing page while the full guest response flow is prepared for launch.
          </p>
          <Button asChild className="mt-6">
            <Link href="/events">See the event schedule <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
