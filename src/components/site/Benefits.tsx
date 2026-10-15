import Icon from '@/components/ui/icon';

const Benefits = ({ data }: { data: any }) => {
  return (
    <section id="benefits" className="bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-14 max-w-3xl">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            {data.badge}
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            {data.title}{' '}
            <span className="text-[var(--hero-x-ho)]">{data.title_accent}</span>
          </h2>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {(data.stats || []).map((s: any, i: number) => (
            <div
              key={i}
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
          {(data.items || []).map((b: any, i: number) => (
            <div
              key={i}
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
