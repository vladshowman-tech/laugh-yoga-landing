import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = [
  {
    q: 'Мне не смешно по команде — это точно сработает?',
    a: 'Да. Мы начинаем со смеховых упражнений, а не с шуток. Тело не отличает игровой смех от настоящего, и уже через несколько минут в группе смех становится искренним и заразительным.',
  },
  {
    q: 'Нужна ли физическая подготовка или гибкость?',
    a: 'Нет. Это не про позы и растяжку. Всё, что нужно — удобная одежда и желание выдохнуть. Практика подходит людям любого возраста и уровня подготовки.',
  },
  {
    q: 'Что взять с собой?',
    a: 'Только себя и удобную одежду, в которой не жалко подвигаться. Коврики и всё остальное оборудование уже на месте.',
  },
  {
    q: 'Есть ли противопоказания?',
    a: 'Практику стоит согласовать с врачом при тяжёлых сердечно-сосудистых заболеваниях, эпилепсии, грыжах и в поздние сроки беременности. Если сомневаетесь — напишите нам перед записью.',
  },
  {
    q: 'Что если приду и мне не понравится?',
    a: 'Если после пробного занятия вы не почувствовали пользы — приходите на второе бесплатно. Мы уверены в методе.',
  },
  {
    q: 'Где проходят занятия?',
    a: 'В уютной студии в центре Екатеринбурга. Точный адрес и время ближайшей группы пришлём после записи.',
  },
];

const Faq = () => {
  return (
    <section id="faq" className="bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            Вопросы
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            Частые вопросы
          </h2>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {FAQ.map((item, idx) => (
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
