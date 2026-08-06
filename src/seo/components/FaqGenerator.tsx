import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { SeoFaqItem } from '@/seo/types';

export function FaqGenerator({ faqs, title = 'FAQ' }: { faqs: SeoFaqItem[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <Accordion type="single" collapsible className="bg-white rounded-xl border px-4">
        {faqs.map((f, i) => (
          <AccordionItem key={f.question} value={`seo-faq-${i}`}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
