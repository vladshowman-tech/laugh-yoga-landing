import Icon from '@/components/ui/icon';

const PLANS = [
  {
    name: 'Пробное',
    price: '900 ₽',
    unit: 'одно занятие',
    note: 'Не смешно — второе бесплатно',
    features: ['Полный час практики', 'Всё оборудование включено', 'Знакомство с методом'],
    highlight: false,
  },
  {
    name: 'Абонемент',
    price: '3 900 ₽',
    unit: '5 занятий',
    note: 'Самый популярный · выгода 33%',
    features: ['5 занятий в удобные дни', 'Заморозка на болезнь', 'Место в группе за вами', 'Экономия 1 600 ₽'],
    highlight: true,
  },
  {
    name: 'Корпоратив',
    price: 'от 12 000 ₽',
    unit: 'выезд на команду',
    note: 'До 20 человек',
    features: ['Выезд в ваш офис или зал', 'Программа под задачу', 'Тимбилдинг без неловкости', 'Гибкое время'],
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section id="price" className="bg-hero-surface py-20 text-hero-accent md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-block rounded bg-hero-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-contrast">
            Цены
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] md:text-5xl">
            Выбирайте формат
          </h2>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-3xl p-8 transition-transform hover:-translate-y-1 ${
                p.highlight
                  ? 'bg-hero-accent text-hero-text shadow-2xl md:-translate-y-3'
                  : 'border-2 border-hero-accent bg-hero-surface'
              }`}
            >
              <h3 className="font-head text-xl font-extrabold uppercase">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-head text-4xl font-black">{p.price}</span>
                <span
                  className={`text-sm font-semibold ${
                    p.highlight ? 'text-hero-muted' : 'text-hero-accent/70'
                  }`}
                >
                  / {p.unit}
                </span>
              </div>
              <span
                className={`mt-2 text-sm font-semibold ${
                  p.highlight ? 'text-[var(--hero-x-ho)]' : 'text-hero-line'
                }`}
              >
                {p.note}
              </span>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 font-semibold">
                    <Icon
                      name="Check"
                      size={18}
                      className={p.highlight ? 'mt-0.5 text-[var(--hero-x-ho)]' : 'mt-0.5 text-hero-accent'}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-head font-extrabold transition-transform hover:-translate-y-0.5 ${
                  p.highlight
                    ? 'bg-[var(--hero-x-ho)] text-hero-accent'
                    : 'bg-hero-accent text-hero-contrast'
                }`}
              >
                Записаться
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
