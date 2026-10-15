import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BOOKING_URL } from '@/lib/api';

const PAY_URL = 'https://securepayecom.com/sc/eRSKdfqtgDhlKAPV';

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

const inputCls =
  'w-full rounded-xl border-2 border-hero-line bg-hero-accent px-4 py-3 font-body text-hero-text placeholder:text-hero-muted/50 focus:border-[var(--hero-x-ho)] focus:outline-none';

interface Props {
  event: any | null;
  onClose: () => void;
}

const BookingDialog = ({ event, onClose }: Props) => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [busy, setBusy] = useState(false);
  const [waitDone, setWaitDone] = useState(false);

  useEffect(() => {
    if (event) {
      setErrors({});
      setWaitDone(false);
    }
  }, [event?.id]);

  if (!event) return <Dialog open={false} />;

  const full = event.left === 0;
  const [y, m, d] = event.date.split('-').map(Number);
  const weekday = DAYS[new Date(y, m - 1, d).getDay()];

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = 'Как вас зовут?';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Проверьте номер телефона';
    const mail = form.email.trim();
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) e.email = 'Проверьте адрес почты';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (busy || !validate()) return;
    setBusy(true);
    try {
      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, event_id: event.id, waitlist: full }),
      });
      if (res.status === 409) {
        await qc.invalidateQueries({ queryKey: ['site-content'] });
        toast({
          title: full ? 'Появились свободные места' : 'Места только что закончились',
          description: full ? 'Закройте окно и откройте занятие снова.' : 'Теперь можно встать в лист ожидания.',
          variant: 'destructive',
        });
        onClose();
        return;
      }
      if (!res.ok) throw new Error('failed');
      await qc.invalidateQueries({ queryKey: ['site-content'] });
      if (full) {
        setWaitDone(true);
        return;
      }
      window.location.href = PAY_URL;
    } catch {
      toast({
        title: 'Не удалось отправить данные',
        description: 'Попробуйте ещё раз немного позже.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!event} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border-hero-line bg-hero-bg p-6 text-hero-text md:p-8">
        <DialogHeader>
          <DialogTitle className="font-head text-2xl font-black uppercase">
            {full ? 'Лист ожидания' : 'Запись на занятие'}
          </DialogTitle>
          <DialogDescription className="sr-only">Заполните данные, чтобы записаться на выбранное занятие</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-hero-surface p-4 text-hero-accent">
          <div className="font-head text-lg font-black">
            {d} {MONTHS[m - 1]}, {weekday}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm font-bold">
            <Icon name="Clock" size={16} />
            {event.time_start}
            {event.time_end && ` – ${event.time_end}`}
          </div>
          {event.title && <div className="mt-2 font-head font-extrabold">{event.title}</div>}
          <div className="mt-1 flex items-start gap-2 text-sm font-semibold">
            <Icon name="Building2" size={16} className="mt-0.5 shrink-0" />
            {event.place}
          </div>
          {event.address && (
            <div className="mt-1 flex items-start gap-2 text-sm font-medium">
              <Icon name="MapPin" size={16} className="mt-0.5 shrink-0" />
              {event.address}
            </div>
          )}
          {event.left != null && (
            <div className="mt-2 flex items-center gap-2 text-sm font-bold">
              <Icon name="Users" size={16} />
              {full ? 'Мест нет' : `Осталось мест: ${event.left}`}
            </div>
          )}
        </div>

        {waitDone ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Icon name="CheckCircle" size={40} className="text-[var(--hero-x-ho)]" />
            <p className="font-head text-lg font-extrabold">Вы в листе ожидания</p>
            <p className="text-sm font-medium text-hero-muted">Если место освободится, мы вам позвоним.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-[var(--hero-x-ho)] px-8 py-3 font-head font-extrabold text-hero-accent"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hero-muted">Имя</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Как к вам обращаться"
                className={inputCls}
              />
              {errors.name && <p className="mt-1 text-sm font-semibold text-[var(--hero-x-ho)]">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hero-muted">Телефон</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
                className={inputCls}
              />
              {errors.phone && <p className="mt-1 text-sm font-semibold text-[var(--hero-x-ho)]">{errors.phone}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-hero-muted">
                E-mail <span className="normal-case tracking-normal">(необязательно)</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@mail.ru"
                className={inputCls}
              />
              {errors.email && <p className="mt-1 text-sm font-semibold text-[var(--hero-x-ho)]">{errors.email}</p>}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--hero-x-ho)] px-8 py-4 font-head text-lg font-extrabold text-hero-accent transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Icon name={full ? 'BellRing' : 'CreditCard'} size={20} />
              {busy ? 'Подождите...' : full ? 'Добавить в лист ожидания' : 'Оплатить'}
            </button>
            <p className="text-center text-xs font-medium text-hero-muted">
              Нажимая кнопку, вы соглашаетесь на обработку данных
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
