import Icon from '@/components/ui/icon';

const POINTS = [
  {
    icon: 'Wind',
    title: 'Смех + дыхание',
    text: 'Смеховые упражнения соединяются с йоговским дыханием. Тело не отличает «настоящий» смех от игрового — эффект одинаковый.',
  },
  {
    icon: 'Users',
    title: 'Всегда в группе',
    text: 'Зрительный контакт и игра запускают заразительный смех. Через пару минут никто уже не притворяется.',
  },
  {
    icon: 'Sparkles',
    title: 'Без гибкости и позы лотоса',
    text: 'Не нужно уметь садиться на шпагат. Нужно только желание выдохнуть и немного подурачиться.',
  },
];

const WhatIs = () => {
  return (
    <section id="what" className="relative bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-14 max-w-3xl">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            Метод
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            Что такое{' '}
            <span className="text-[var(--hero-x-ho)]">йога смеха</span>
          </h2>
          <p className="mt-5 text-lg font-medium leading-snug text-hero-muted">
            Практику придумал врач Мадан Катария в 1995 году. Идея простая: мы
            смеёмся телом, а не поводом. Начинаем через упражнения — и смех
            становится настоящим сам собой.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-hero-line bg-hero-bg p-7 transition-transform hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--hero-x-ho)] text-hero-accent transition-transform group-hover:rotate-12">
                <Icon name={p.icon} size={26} />
              </div>
              <h3 className="font-head text-xl font-extrabold text-hero-text">
                {p.title}
              </h3>
              <p className="mt-3 font-medium leading-snug text-hero-muted">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIs;
