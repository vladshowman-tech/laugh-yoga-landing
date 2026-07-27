import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CONTACTS = [
  { icon: 'MapPin', label: 'Студия в центре Екатеринбурга', sub: 'Адрес пришлём после записи' },
  { icon: 'Phone', label: '+7 (343) 000-00-00', sub: 'Пн–Вс, 10:00–21:00' },
  { icon: 'Send', label: '@hohohaha_ekb', sub: 'Пишите в Telegram' },
];

const Booking = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', slot: '' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const validate = () => {
    const e: { name?: string; phone?: string } = {};
    if (form.name.trim().length < 2) e.name = 'Как вас зовут?';
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 10) e.phone = 'Проверьте номер телефона';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    toast({
      title: 'Заявка принята!',
      description: `${form.name}, мы перезвоним и подтвердим место в группе.`,
    });
    setForm({ name: '', phone: '', slot: '' });
    setErrors({});
  };

  return (
    <section id="book" className="bg-hero-accent py-20 text-hero-text md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="mb-4 inline-block rounded bg-[var(--hero-x-ho)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-hero-accent">
              Запись
            </span>
            <h2 className="font-head text-3xl font-black uppercase leading-[0.95] md:text-5xl">
              Приходите{' '}
              <span className="text-[var(--hero-x-ho)]">смеяться</span>
            </h2>
            <p className="mt-5 max-w-md text-lg font-medium leading-snug text-hero-muted">
              Оставьте заявку — подберём удобное время и забронируем место в
              ближайшей группе. Занятие всего 900&nbsp;₽.
            </p>

            <ul className="mt-9 flex flex-col gap-5">
              {CONTACTS.map((c) => (
                <li key={c.label} className="flex items-center gap-4">
                  <span id={c.icon === 'MapPin' ? 'contacts' : undefined} className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--hero-x-ho)] text-hero-accent">
                    <Icon name={c.icon} size={22} />
                  </span>
                  <div>
                    <div className="font-head font-extrabold">{c.label}</div>
                    <div className="text-sm font-medium text-hero-muted">{c.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={submit}
            noValidate
            className="rounded-3xl bg-hero-bg p-7 md:p-9"
          >
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-hero-muted">
                Ваше имя
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Как к вам обращаться"
                className="w-full rounded-xl border-2 border-hero-line bg-hero-accent px-4 py-3 font-body text-hero-text placeholder:text-hero-muted/50 focus:border-[var(--hero-x-ho)] focus:outline-none"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm font-semibold text-[var(--hero-x-ho)]">{errors.name}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-hero-muted">
                Телефон
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
                className="w-full rounded-xl border-2 border-hero-line bg-hero-accent px-4 py-3 font-body text-hero-text placeholder:text-hero-muted/50 focus:border-[var(--hero-x-ho)] focus:outline-none"
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm font-semibold text-[var(--hero-x-ho)]">{errors.phone}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-hero-muted">
                Когда удобно
              </label>
              <select
                value={form.slot}
                onChange={(e) => setForm({ ...form, slot: e.target.value })}
                className="w-full rounded-xl border-2 border-hero-line bg-hero-accent px-4 py-3 font-body text-hero-text focus:border-[var(--hero-x-ho)] focus:outline-none"
              >
                <option value="">Любое время</option>
                <option value="weekday-morning">Будни, утро</option>
                <option value="weekday-evening">Будни, вечер</option>
                <option value="weekend">Выходные</option>
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--hero-x-ho)] px-8 py-4 font-head text-lg font-extrabold text-hero-accent transition-transform hover:-translate-y-1 hover:rotate-1"
            >
              Записаться на занятие <span aria-hidden>→</span>
            </button>
            <p className="mt-3 text-center text-xs font-medium text-hero-muted">
              Нажимая кнопку, вы соглашаетесь на обработку данных
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;