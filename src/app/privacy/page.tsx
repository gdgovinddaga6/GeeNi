import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">Privacy</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Your memories remain treated with care</h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          Guest photos and videos are shared only with the couple and the approved gallery experience.
        </p>
      </div>
      <Card className="mt-10 border-[#efe3d5] bg-white/85">
        <CardContent>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 text-rose" />
            <p className="text-sm leading-7 text-muted">
              This experience is being built with privacy-minded defaults and will continue to evolve with guest trust and security in mind.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
