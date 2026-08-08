import Image from 'next/image';
import { Camera, Heart, Search, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const memories = [
  {
    title: 'Sunlit Ceremony',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    tag: 'Ceremony',
  },
  {
    title: 'Golden Hour',
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    tag: 'Family',
  },
  {
    title: 'Laughter & Love',
    src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80',
    tag: 'Friends',
  },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-rose">Gallery</p>
          <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">A living archive of moments</h1>
          <p className="mt-6 text-lg leading-8 text-muted">
            The gallery grows over time, gathering guest memories into a calm and searchable experience.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-[#efe3d5] bg-white/80 px-4 py-3 text-sm text-muted">
          <Search className="h-4 w-4 text-rose" />
          Search by event, family, or favorite memory
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {memories.map((memory) => (
          <Card key={memory.title} className="overflow-hidden p-0">
            <Image src={memory.src} alt={memory.title} width={800} height={1000} className="h-72 w-full object-cover" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl text-ink">{memory.title}</h2>
                  <p className="mt-1 text-sm text-muted">{memory.tag}</p>
                </div>
                <span className="rounded-full bg-[#f7efe7] p-2 text-rose">
                  <Heart className="h-4 w-4" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-10 border-[#efe3d5] bg-[#fcf7f2]">
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2"><Camera className="h-4 w-4 text-rose" /> Photos & Videos</span>
            <span className="flex items-center gap-2 rounded-full bg-white px-3 py-2"><Sparkles className="h-4 w-4 text-rose" /> AI organization soon</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
