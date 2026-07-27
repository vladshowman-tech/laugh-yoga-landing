import Icon from '@/components/ui/icon';

const FACTS = [
  'Сертифицированный ведущий по методу Laughter Yoga International',
  'Более 6 лет практики и 300+ проведённых занятий',
  'Работаю с группами, парами и корпоративными командами',
];

const Coach = () => {
  return (
    <section id="coach" className="bg-hero-surface py-20 text-hero-accent md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <div className="absolute -left-3 -top-3 h-full w-full -rotate-3 rounded-2xl border-4 border-hero-accent" aria-hidden />
            <img
              src="/coach-vitaly.png"
              alt="Виталий Володин — ведущий занятий йогой смеха"
              className="relative aspect-square w-full rounded-2xl object-cover object-top shadow-xl"
              loading="lazy"
            />
          </div>

          <div>
            <span className="mb-4 inline-block rounded bg-hero-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-contrast">
              Ведущий
            </span>
            <h2 className="font-head text-3xl font-black uppercase leading-[0.95] md:text-5xl">
              Виталий Володин
            </h2>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-snug text-hero-accent/80">
              «Я пришёл в йогу смеха выгоревшим и уставшим — а остался, потому что
              впервые за годы почувствовал лёгкость. Теперь помогаю людям
              Екатеринбурга находить эту лёгкость за один час.»
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {FACTS.map((f) => (
                <li key={f} className="flex items-start gap-3 font-semibold">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hero-accent text-hero-contrast">
                    <Icon name="Check" size={15} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#book"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-hero-accent px-7 py-3.5 font-head font-extrabold text-hero-contrast transition-transform hover:-translate-y-1 hover:rotate-1"
            >
              Прийти на занятие <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coach;