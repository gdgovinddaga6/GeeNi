import { MessageCircleQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    question: 'What is the dress code?',
    answer: 'Traditional Indian attire is warmly encouraged for the celebration weekend.',
  },
  {
    question: 'Is parking available?',
    answer: 'Yes, valet and dedicated guest parking are available at the resort.',
  },
  {
    question: 'Can I upload photos during the wedding?',
    answer: 'Absolutely. Guests can share memories directly from the live gallery flow.',
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.4em] text-rose">FAQ</p>
        <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Helpful answers for every guest</h1>
      </div>
      <div className="mt-10 grid gap-6">
        {faqs.map((faq) => (
          <Card key={faq.question}>
            <CardContent>
              <div className="flex items-start gap-3">
                <MessageCircleQuestion className="mt-1 h-5 w-5 text-rose" />
                <div>
                  <h2 className="font-display text-2xl text-ink">{faq.question}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{faq.answer}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
