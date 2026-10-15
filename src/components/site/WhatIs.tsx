import Icon from '@/components/ui/icon';

const WhatIs = ({ data }: { data: any }) => {
  return (
    <section id="what" className="relative bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="mb-14 max-w-3xl">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            {data.badge}
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            {data.title}{' '}
            <span className="text-[var(--hero-x-ho)]">{data.title_accent}</span>
          </h2>
          <p className="mt-5 text-lg font-medium leading-snug text-hero-muted">
            {data.text}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {(data.points || []).map((p: any, i: number) => (
            <div
              key={i}
              className="group rounded-2xl border border-hero-line bg-hero-bg p-7 transition-transform hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--hero-x-ho)] text-hero-accent transition-transform group-hover:rotate-12">
                <Icon name={p.icon} fallback="Sparkles" size={26} />
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
