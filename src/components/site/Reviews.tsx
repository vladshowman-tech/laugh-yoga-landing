import { useState } from 'react';
import Icon from '@/components/ui/icon';

const Reviews = ({ data }: { data: any }) => {
  const [i, setI] = useState(0);
  const items: any[] = data.items || [];
  const total = items.length;
  if (total === 0) return null;
  const cur = Math.min(i, total - 1);
  const prev = () => setI((p) => (p - 1 + total) % total);
  const next = () => setI((p) => (p + 1) % total);
  const r = items[cur];

  return (
    <section id="reviews" className="bg-hero-bg py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded bg-hero-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-text">
            {data.badge}
          </span>
          <h2 className="font-head text-3xl font-black uppercase leading-[0.95] text-hero-text md:text-5xl">
            {data.title} <span className="text-[var(--hero-x-ho)]">{data.title_accent}</span> {data.title_end}
          </h2>
        </div>

        <div className="relative rounded-3xl border border-hero-line bg-hero-surface p-8 text-hero-accent md:p-12">
          <Icon
            name="Quote"
            size={48}
            className="mb-4 text-hero-accent/25"
          />
          <p className="min-h-[7rem] font-head text-xl font-semibold leading-snug md:text-2xl">
            {r.text}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <div className="font-head text-lg font-extrabold">{r.name}</div>
              <div className="text-sm font-semibold text-hero-accent/70">{r.role}</div>
            </div>
            <div className="flex gap-3">
              <button
                aria-label="Предыдущий отзыв"
                onClick={prev}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-hero-accent text-hero-contrast transition-transform hover:-translate-x-0.5"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <button
                aria-label="Следующий отзыв"
                onClick={next}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-hero-accent text-hero-contrast transition-transform hover:translate-x-0.5"
              >
                <Icon name="ArrowRight" size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Отзыв ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === cur ? 'w-7 bg-[var(--hero-x-ho)]' : 'w-2.5 bg-hero-line'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
