import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { BOOKING_URL } from '@/lib/api';

const WaitlistForm = ({ eventId }: { eventId: number }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (form.name.trim().length < 2) {
      toast({ title: 'Как вас зовут?', variant: 'destructive' });
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      toast({ title: 'Проверьте номер телефона', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, event_id: eventId, waitlist: true }),
      });
      if (res.status === 409) {
        toast({ title: 'Появились места', description: 'Обновите страницу и запишитесь на занятие.' });
        return;
      }
      if (!res.ok) throw new Error('failed');
      setDone(true);
    } catch {
      toast({
        title: 'Не удалось отправить',
        description: 'Попробуйте ещё раз немного позже.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="mt-6 flex items-start gap-2 rounded-2xl bg-hero-surface px-4 py-3 text-sm font-semibold text-hero-accent">
        <Icon name="CheckCircle" size={18} className="mt-0.5 shrink-0" />
        Вы в листе ожидания. Если место освободится, мы вам позвоним.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--hero-x-ho)] px-6 py-3 font-head font-extrabold text-hero-accent transition-transform hover:-translate-y-0.5"
      >
        <Icon name="BellRing" size={18} />
        Встать в лист ожидания
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
      <p className="text-sm font-medium text-hero-muted">Оставьте телефон, и мы позвоним, если место освободится.</p>
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Ваше имя"
        className="w-full rounded-xl border-2 border-hero-line bg-hero-accent px-4 py-2.5 font-body text-hero-text placeholder:text-hero-muted/50 focus:border-[var(--hero-x-ho)] focus:outline-none"
      />
      <input
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="+7 (___) ___-__-__"
        className="w-full rounded-xl border-2 border-hero-line bg-hero-accent px-4 py-2.5 font-body text-hero-text placeholder:text-hero-muted/50 focus:border-[var(--hero-x-ho)] focus:outline-none"
      />
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-full bg-[var(--hero-x-ho)] px-6 py-3 font-head font-extrabold text-hero-accent transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {busy ? 'Отправляем...' : 'Сообщите мне о месте'}
      </button>
    </form>
  );
};

export default WaitlistForm;
