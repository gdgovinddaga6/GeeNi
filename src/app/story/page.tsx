import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const storySections = [
  {
    title: 'It started with a rishta.',
    body:
      'Like most great Indian love stories, ours started with a phone call. Her dad called my dad about a rishta. Somewhere between family conversations, exchanged biodatas, and the classic “let\'s see where this goes”, Nidhi and I exchanged numbers.',
  },
  {
    title: 'Little Italy. Big beginning.',
    body:
      'We met for the first time at Little Italy. One meeting turned into another. And another. And somehow, “let\'s meet and see” became “let\'s meet again.” We met a lottt before either of us was ready to say yes.',
  },
  {
    title: 'A few things changed too...',
    body:
      'Before Nidhi came along, I had somehow managed to survive without going to proper Asian restaurants or fancy fine-dine places. Then she entered my life. And suddenly, I was discovering restaurants I didn\'t even know existed. Coincidence? We think not.',
  },
  {
    title: 'And then... we said yes.',
    body:
      'There wasn\'t a grand movie scene. No orchestra. No slow-motion background score. Just the two of us, standing outside her office, after finally deciding: Yes. Let\'s do this. And then we hugged. That hug. It was simple, spontaneous, and probably lasted only a few seconds. But somehow, it became one of those moments we\'ll remember forever.',
  },
  {
    title: 'Now we\'re enjoying the courtship era.',
    body:
      'And honestly? We\'re having a pretty great time. We\'re discovering each other, making memories, eating our way through restaurants, laughing at the smallest things, and enjoying this beautiful little chapter before the wedding. Meanwhile, our uncles and aunties have some very important advice: “Maze karlo!” “Yahi time hai!” And we smile.',
  },
  {
    title: 'And now, the next chapter.',
    body:
      'After all the calls. All the meetings. All the “let\'s see.” All the “are you sure?” And that one very special hug... We\'re finally getting married. 2nd December. And yes... You are invited. Come celebrate with us, make some noise, eat a lot, dance a lot, take way too many photos, and most importantly— be there when our story becomes forever.',
  },
];

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-rose"># Our Story</p>
        <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">It started with a rishta.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="overflow-hidden rounded-[32px] border border-[#efe6db] bg-white/80 p-2 shadow-soft">
          <Image
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80"
            alt="A couple in a warm, intimate setting"
            width={900}
            height={1100}
            className="h-[560px] w-full rounded-[28px] object-cover"
          />
        </div>

        <div className="space-y-6">
          {storySections.map((section) => (
            <Card key={section.title} className="border-[#efe3d5] bg-white/85">
              <CardContent className="p-6">
                <h2 className="font-display text-3xl text-ink">{section.title}</h2>
                <p className="mt-3 text-base leading-8 text-muted">{section.body}</p>
              </CardContent>
            </Card>
          ))}

          <Card className="border-[#efe3d5] bg-[#f9efe9]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-ink">
                <Heart className="h-5 w-5 text-rose" />
                <p className="font-display text-3xl">Nidhi & Govind</p>
              </div>
              <p className="mt-3 text-lg text-muted">#GeeNi</p>
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-rose">From a rishta to a lifetime.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
