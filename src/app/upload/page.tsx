import Link from 'next/link';
import { ArrowRight, CheckCircle2, CloudUpload, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UploadForm } from '@/components/upload/UploadForm';
import { features } from '@/lib/config/features';
import { isGoogleAuthReady } from '@/lib/auth/options';

export const dynamic = 'force-dynamic';

export default function UploadPage() {
  const googleEnabled = isGoogleAuthReady();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-rose">Upload Memories</p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Share every beautiful moment</h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            The experience is designed for a fast, calm upload flow — from camera to gallery in just a few taps.
          </p>
          <Button asChild className="mt-8">
            <Link href="/gallery">
              View Gallery <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Card className="border-[#efe3d5] bg-white/85">
          <CardContent>
            <div className="flex items-center gap-3">
              <CloudUpload className="h-5 w-5 text-rose" />
              <h2 className="font-display text-2xl text-ink">How it works</h2>
            </div>
            <div className="mt-6 space-y-4">
              {[
                googleEnabled
                  ? 'Sign in with your Google account'
                  : 'Add your name so we know who the memory is from',
                'Select photos and videos from your device',
                'Add captions, tags, and event details',
                'Confirm upload and see it appear in the gallery',
              ].map((step) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-[#efe3d5] bg-[#fcfaf7] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-rose" />
                  <p className="text-sm leading-7 text-muted">{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {features.upload ? (
        <UploadForm requireGoogle={googleEnabled} />
      ) : (
        <Card className="mt-10 border-[#efe3d5] bg-white/85">
          <CardContent>
            <h2 className="font-display text-2xl text-ink">Uploads are currently closed</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Thank you for wanting to share. Please enjoy the gallery, and check back when memories are being collected.
            </p>
            <Button asChild className="mt-6">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mt-10 border-[#efe3d5] bg-[#f9efe9]">
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-rose" />
            <p className="text-sm leading-7 text-muted">Optimized for mobile, built for a guest experience that feels effortless.</p>
          </div>
          <p className="text-sm font-medium text-ink">Upload support for photos, videos, and HEIC files</p>
        </CardContent>
      </Card>
    </div>
  );
}
