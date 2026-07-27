import Icon from '@/components/ui/icon';

const BENEFITS = [
  { icon: 'HeartPulse', t: 'Меньше стресса', d: 'Смех снижает кортизол и мышечные зажимы. Тело выдыхает вслед за вами.' },
  { icon: 'Brain', t: 'Ясная голова', d: 'Приток кислорода и эндорфинов — после занятия думается легче и спокойнее.' },
  { icon: 'Lungs', t: 'Дыхание и лёгкие', d: 'Диафрагмальное дыхание тренирует лёгкие лучше, чем офисные вздохи.' },
  { icon: 'Moon', t: 'Крепкий сон', d: 'Сброшенное напряжение помогает засыпать быстрее и спать глубже.' },
  { icon: 'Smile', t: 'Настроение', d: 'Заряд хорошего настроения держится не час, а несколько дней.' },
  { icon: 'Zap', t: 'Энергия', d: 'Мягкая физнагрузка без спортзала: пресс и лицо работают за вас.' },
];

const STATS = [
  { n: '100', s: 'мин чистого смеха' },
  { n: '−40%', s: 'ощущаемого стресса' },
  { n: '15–20', s: 'человек в группе' },
  { n: '700 ₽', s: 'пробное занятие' },
];

const Benefits = () => {
  return (
    <section id="benefits" className="bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-14 max-w-3xl">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            Польза
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            Что забираете{' '}
            <span className="text-[var(--hero-x-ho)]">с собой</span>
          </h2>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.s}
              className="rounded-2xl bg-[var(--hero-x-ho)] px-4 py-6 text-center text-hero-accent"
            >
              <div className="font-head text-3xl font-black md:text-4xl">{s.n}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wide md:text-sm">
                {s.s}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.t}
              className="flex gap-4 rounded-2xl border border-hero-line bg-hero-bg p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-hero-surface text-hero-accent">
                <Icon name={b.icon} fallback="Heart" size={24} />
              </div>
              <div>
                <h3 className="font-head text-lg font-extrabold text-hero-text">{b.t}</h3>
                <p className="mt-1 font-medium leading-snug text-hero-muted">{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;