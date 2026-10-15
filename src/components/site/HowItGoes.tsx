const HowItGoes = ({ data }: { data: any }) => {
  return (
    <section id="how" className="bg-hero-surface py-20 text-hero-accent md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:sticky lg:top-28">
            <span className="mb-4 inline-block rounded bg-hero-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-contrast">
              {data.badge}
            </span>
            <h2 className="font-head text-3xl font-black uppercase leading-[0.95] md:text-5xl">
              {data.title}
            </h2>
            <p className="mt-5 max-w-md text-lg font-semibold leading-snug text-hero-accent/80">
              {data.text}
            </p>
            {data.image && (
              <img
                src={data.image}
                alt={data.title}
                className="mt-8 aspect-[4/3] w-full rounded-2xl border-4 border-hero-accent object-cover shadow-xl"
                loading="lazy"
              />
            )}
          </div>

          <ol className="relative flex flex-col gap-6 border-l-4 border-hero-accent/30 pl-7">
            {(data.steps || []).map((s: any, i: number) => (
              <li key={i} className="relative">
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
