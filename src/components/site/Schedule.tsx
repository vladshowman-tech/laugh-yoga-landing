import Icon from '@/components/ui/icon';

const Schedule = ({ data }: { data: any }) => {
  const items: any[] = data.items || [];
  if (data.enabled === false || items.length === 0) return null;

  return (
    <section id="schedule" className="bg-hero-surface py-20 text-hero-accent md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded bg-hero-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-contrast">
            {data.badge}
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] md:text-5xl">
            {data.title}
          </h2>
          {data.text && (
            <p className="mx-auto mt-5 max-w-xl text-lg font-semibold leading-snug text-hero-accent/80">
              {data.text}
            </p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((s, i) => (
            <div
              key={i}
              className="flex flex-col rounded-3xl bg-hero-bg p-7 text-hero-text transition-transform hover:-translate-y-1"
            >
              <div className="font-head text-2xl font-black uppercase text-[var(--hero-x-ho)]">
                {s.day}
              </div>
              <div className="mt-1 flex items-center gap-2 font-head text-3xl font-black">
                <Icon name="Clock" size={24} />
                {s.time}
              </div>
              <div className="mt-4 font-head text-lg font-extrabold">{s.title}</div>
              <div className="mt-1 flex items-start gap-2 text-sm font-medium text-hero-muted">
                <Icon name="MapPin" size={16} className="mt-0.5 shrink-0" />
                {s.place}
              </div>
              <a
                href="#book"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--hero-x-ho)] px-6 py-3 font-head font-extrabold text-hero-accent transition-transform hover:-translate-y-0.5"
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

export default Schedule;
