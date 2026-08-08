import { Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const contacts = [
  { name: 'Ashok Kumar Daga', phone: '9441013301' },
  { name: 'Manjor Bang', phone: '9885441501' },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">RSVP</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">We&apos;re delighted to celebrate with you</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Please reach out to us directly for RSVP and event details. Your presence means the world to us.
        </p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-rose" />
              <h2 className="font-display text-2xl text-ink">Email</h2>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">hello@geeni.in</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-rose" />
              <h2 className="font-display text-2xl text-ink">RSVP contacts</h2>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              {contacts.map((contact) => (
                <p key={contact.name}>
                  {contact.name}: <a href={`tel:${contact.phone}`} className="text-ink hover:text-rose">{contact.phone}</a>
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
