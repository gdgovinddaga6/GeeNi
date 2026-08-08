import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Compass, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const googleCalendarLink =
  'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Nidhi%20%26%20Govind%20Wedding&details=Join%20us%20for%20our%20wedding%20celebration.%20We%20would%20love%20to%20celebrate%20with%20you.&location=Serene%20Resort%2C%20Hyderabad&dates=20261202T183000%2F20261202T223000';

export default function VenuePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-rose">Venue</p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Serene Resort, Hyderabad</h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            Nestled in quiet elegance, the resort offers the ideal setting for a warm traditional celebration with modern luxury at its core.
          </p>
          <div className="mt-8 space-y-4">
            <Card>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-rose" />
                  <div>
                    <h2 className="font-display text-2xl text-ink">Address</h2>
                    <p className="mt-2 text-sm leading-7 text-muted">12, Lakeside Road, Hyderabad, Telangana 500001</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80"
          alt="Luxury resort venue with gardens and elegant architecture"
          width={900}
          height={1100}
          className="h-[520px] w-full rounded-[32px] object-cover"
        />
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-rose" />
              <h2 className="font-display text-2xl text-ink">Directions</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              The resort is 35 minutes from the airport and 20 minutes from the city center. Guests may use ride-hailing services or self-drive to arrive comfortably.
            </p>
            <Button asChild className="mt-6">
              <Link href="https://maps.app.goo.gl/AFEcLHiRDbkRov1g9" target="_blank" rel="noreferrer">
                Open in Maps <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-rose" />
              <h2 className="font-display text-2xl text-ink">Add to Calendar</h2>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Button asChild variant="secondary" className="justify-center">
                <Link href="/wedding-invite.ics" target="_blank" rel="noreferrer">
                  Apple Calendar
                </Link>
              </Button>
              <Button asChild variant="secondary" className="justify-center">
                <Link href={googleCalendarLink} target="_blank" rel="noreferrer">
                  Google Calendar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
