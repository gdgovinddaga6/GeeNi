'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, CalendarRange, Camera, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { features } from '@/lib/config/features';

const quickActions = [
  {
    href: '/events',
    title: 'Events',
    description: 'From blessings to the grand ceremony, every moment is thoughtfully planned.',
    icon: CalendarRange,
  },
  {
    href: '/venue',
    title: 'Venue',
    description: 'A serene resort in Hyderabad, designed for warm gatherings and easy travel.',
    icon: MapPin,
  },
  {
    href: '/gallery',
    title: 'Gallery',
    description: 'A growing archive of the moments we will treasure for years to come.',
    icon: Camera,
  },
  {
    href: '/upload',
    title: 'Upload',
    description: 'Celebrate with us by sharing the memories you hold close.',
    icon: Sparkles,
  },
];

const weddingDate = new Date('2026-12-02T18:30:00+05:30');

function getTimeLeft() {
  const difference = weddingDate.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isLive: false,
  };
}

export default function HomePage() {
  const [countdown, setCountdown] = useState(getTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-[#efe6db] bg-[radial-gradient(circle_at_top_left,_rgba(165,195,180,0.18),_transparent_24%),linear-gradient(180deg,_#dfeaf0_0%,_#d7e6ea_35%,_#eaf2f3_100%)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:px-10 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[32px] border border-[#eef2f0] bg-[#dfeaf0]/85 p-6 shadow-[0_25px_80px_-30px_rgba(45,45,45,0.28)] backdrop-blur-sm sm:p-8 lg:p-10"
          >
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-display text-3xl tracking-[0.18em] text-[#4a4d4d] sm:text-5xl">
                SAVE THE DATE
              </p>
              <p className="mt-3 font-display text-xl italic text-[#4a4d4d] sm:text-2xl">
                for the wedding of
              </p>
              <h1 className="mt-5 font-display text-5xl leading-none text-[#2d2d2d] sm:text-7xl lg:text-[7rem]">
                Nidhi <span className="mx-2 text-[#b98d6a]">&</span> Govind
              </h1>

              <div className="mt-8 flex items-center justify-center gap-3 text-lg text-[#3d3d3d] sm:text-2xl">
                <span className="font-display text-2xl sm:text-4xl">Dec 02, 2026</span>
                <span className="text-[#b98d6a]">|</span>
                <span>Hyderabad</span>
              </div>
            </div>

            <div className="mt-10 grid gap-4 rounded-[28px] bg-[#f2efe8]/70 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
              {countdownItems.map((item) => (
                <div key={item.label} className="rounded-[20px] border border-[#e8e2d7] bg-white/30 p-4 text-center backdrop-blur-sm">
                  <p className="font-display text-4xl leading-none text-[#2d2d2d] sm:text-5xl">
                    {item.value.toString().padStart(2, '0')}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#5b5b5b]">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-rose">Guest details</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Everything guests need, beautifully arranged</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {quickActions
            .filter((item) => item.href !== '/upload' || features.upload)
            .map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group block h-full">
                <Card className="h-full transition duration-300 group-hover:-translate-y-1 group-hover:border-[#d9b7a9] group-hover:shadow-soft">
                  <CardContent className="h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7efe7] text-rose">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                    <p className="text-sm leading-7 text-muted">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#efe6db] bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <Image
            src="https://i.postimg.cc/QtzxG11P/PXL-20260412-103757297.jpg"
            alt="Nidhi and Govind together"
            width={900}
            height={1100}
            className="h-[460px] w-full rounded-[32px] object-cover"
          />
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.4em] text-rose">Our Story</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">It started with a rishta.</h2>
            <p className="mt-6 text-lg leading-8 text-muted">
              What began with a phone call, a family connection, and a quiet first meeting became a story of laughter, food, thoughtful little moments, and a yes we will always remember.
            </p>
            <Button asChild className="mt-8 w-fit">
              <Link href="/story">
                Read Our Story <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <Card className="overflow-hidden bg-[#f9efe9] p-0">
          <div className="grid gap-8 p-8 lg:grid-cols-[1fr_0.8fr] lg:p-10">
            <div className="flex flex-col justify-center">
              <p className="text-sm uppercase tracking-[0.4em] text-rose">Featured gathering</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Wedding Ceremony</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
                Join us as the evening unfolds in a setting of warm light, floral charm, and heartfelt blessings under the open sky.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted">
                <div className="rounded-full border border-[#e9ddd0] bg-white/70 px-4 py-2">Dec 02 · 6:30 PM</div>
                <div className="rounded-full border border-[#e9ddd0] bg-white/70 px-4 py-2">Traditional attire</div>
              </div>
            </div>
            <div className="rounded-[28px] bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3 text-ink">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f7efe7] text-rose">
                  {countdown.isLive ? 'Now' : '⏳'}
                </span>
                <span className="font-medium">{countdown.isLive ? 'The celebration is here' : 'Countdown to the celebration'}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                {countdownItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#eee6dc] bg-[#fcfaf7] p-4">
                    <p className="font-display text-3xl text-ink">{item.value.toString().padStart(2, '0')}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted">{item.label}</p>
                  </div>
                ))}
              </div>

              <Button asChild className="mt-6 w-full">
                <Link href="/venue">Open Venue Details</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
