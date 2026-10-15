import Icon from '@/components/ui/icon';

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

const placesWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'место';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'места';
  return 'мест';
};

const parseDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return { d, month: MONTHS[m - 1], weekday: DAYS[new Date(y, m - 1, d).getDay()] };
};

const Schedule = ({ data }: { data: any }) => {
  const events: any[] = data.events || [];
  if (data.enabled === false || events.length === 0) return null;

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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => {
            const dt = parseDate(e.date);
            return (
              <div
                key={e.id}
                className="flex flex-col rounded-3xl bg-hero-bg p-7 text-hero-text transition-transform hover:-translate-y-1"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-head text-5xl font-black text-[var(--hero-x-ho)]">{dt.d}</span>
                  <span className="font-head text-xl font-extrabold uppercase">{dt.month}</span>
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-hero-muted">{dt.weekday}</div>

                <div className="mt-3 flex items-center gap-2 font-head text-2xl font-black">
                  <Icon name="Clock" size={22} />
                  {e.time_start}
                  {e.time_end && <span className="text-hero-muted">– {e.time_end}</span>}
                </div>

                {e.title && <div className="mt-4 font-head text-lg font-extrabold">{e.title}</div>}

                <div className="mt-2 flex items-start gap-2 text-sm font-semibold">
                  <Icon name="Building2" size={16} className="mt-0.5 shrink-0 text-[var(--hero-x-ho)]" />
                  {e.place}
                </div>
                {e.address && (
                  <div className="mt-1 flex items-start gap-2 text-sm font-medium text-hero-muted">
                    <Icon name="MapPin" size={16} className="mt-0.5 shrink-0" />
                    {e.address}
                  </div>
                )}

                {e.left !== null && e.left !== undefined && (
                  <div
                    className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      e.left === 0
                        ? 'bg-hero-line text-hero-text'
                        : e.left <= 3
                          ? 'bg-[var(--hero-x-ho)] text-hero-accent'
                          : 'bg-hero-surface text-hero-accent'
                    }`}
                  >
                    <Icon name="Users" size={14} />
                    {e.left === 0 ? 'Мест нет' : `Осталось ${e.left} ${placesWord(e.left)}`}
                  </div>
                )}

                {e.left === 0 ? (
                  <span className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-hero-line px-6 py-3 font-head font-extrabold text-hero-muted">
                    Запись закрыта
                  </span>
                ) : (
                  <a
                    href="#book"
                    onClick={() => window.dispatchEvent(new CustomEvent('select-event', { detail: e.id }))}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[var(--hero-x-ho)] px-6 py-3 font-head font-extrabold text-hero-accent transition-transform hover:-translate-y-0.5"
                  >
                    Записаться
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Schedule;