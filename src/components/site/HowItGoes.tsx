const STEPS = [
  {
    t: 'Настройка',
    time: '0–15 мин',
    text: 'Знакомимся, снимаем «взрослую серьёзность». Лёгкая разминка и дыхание, чтобы тело проснулось.',
  },
  {
    t: 'Смеховые упражнения',
    time: '15–55 мин',
    text: 'Игровые сценки, хлопки, «хо-хо, ха-ха». Смех из игрового переходит в настоящий и заразительный.',
  },
  {
    t: 'Смеховая медитация',
    time: '55–80 мин',
    text: 'Свободный смех без поводов, затем тишина. Самая яркая часть — тело отпускает напряжение.',
  },
  {
    t: 'Расслабление',
    time: '80–100 мин',
    text: 'Лёжа на мягком полу дышим и отдыхаем. Уходите лёгкими, с ясной головой и улыбкой.',
  },
];

const HowItGoes = () => {
  return (
    <section id="how" className="bg-hero-surface py-20 text-hero-accent md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:sticky lg:top-28">
            <span className="mb-4 inline-block rounded bg-hero-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-contrast">
              Формат
            </span>
            <h2 className="font-head text-3xl font-black uppercase leading-[0.95] md:text-5xl">
              Как проходит занятие
            </h2>
            <p className="mt-5 max-w-md text-lg font-semibold leading-snug text-hero-accent/80">
              100 минут. Никакой сцены и «выступлений» — только вы, группа и много
              смеха. Приходите в удобной одежде, остальное на нас.
            </p>
            <img
              src="https://cdn.poehali.dev/projects/4626b584-3db2-4647-9c5a-24f1113590fb/files/4f1127df-e4d1-4668-be21-abf9a82c8ead.jpg"
              alt="Групповое занятие йогой смеха"
              className="mt-8 aspect-[4/3] w-full rounded-2xl border-4 border-hero-accent object-cover shadow-xl"
              loading="lazy"
            />
          </div>

          <ol className="relative flex flex-col gap-6 border-l-4 border-hero-accent/30 pl-7">
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative">
                <span className="absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full bg-hero-accent font-head text-sm font-extrabold text-hero-contrast">
                  {i + 1}
                </span>
                <div className="rounded-2xl bg-hero-bg p-6 text-hero-text">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-head text-xl font-extrabold">{s.t}</h3>
                    <span className="text-sm font-semibold uppercase tracking-wide text-hero-muted">
                      {s.time}
                    </span>
                  </div>
                  <p className="mt-2 font-medium leading-snug text-hero-muted">
                    {s.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItGoes;