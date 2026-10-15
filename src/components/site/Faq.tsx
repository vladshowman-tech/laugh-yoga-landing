import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Faq = ({ data }: { data: any }) => {
  return (
    <section id="faq" className="bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            {data.badge}
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            {data.title}
          </h2>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {(data.items || []).map((item: any, idx: number) => (
            <AccordionItem
              key={idx}
              value={`item-${idx}`}
              className="overflow-hidden rounded-2xl border border-hero-line bg-hero-surface px-5"
            >
              <AccordionTrigger className="py-5 text-left font-head text-base font-extrabold text-hero-accent hover:no-underline md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 font-body text-base font-medium leading-snug text-hero-accent/80">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;
