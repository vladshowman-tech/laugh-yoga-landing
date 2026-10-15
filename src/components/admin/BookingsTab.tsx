import { useEffect, useMemo, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { adminCall } from './adminApi';

interface Booking {
  id: number;
  name: string;
  phone: string;
  slot: string;
  status: string;
  created_at: string;
  event_label: string;
  event_id: number | null;
}

interface EventItem {
  id: number;
  date: string;
  time_start: string;
  place: string;
  title: string;
  archived: boolean;
}

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: 'Новая', cls: 'bg-amber-100 text-amber-900' },
  in_work: { label: 'В работе', cls: 'bg-blue-100 text-blue-900' },
  done: { label: 'Записан', cls: 'bg-green-100 text-green-900' },
  cancelled: { label: 'Отказ', cls: 'bg-slate-200 text-slate-700' },
};

const ALL = 'all';
const NO_EVENT = 'none';

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const fmtDate = (iso: string) => {
  const [, m, d] = iso.split('-');
  return `${d}.${m}`;
};

const BookingsTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Booking[] | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<string>(ALL);

  const load = () =>
    Promise.all([
      adminCall<{ items: Booking[] }>('list_bookings'),
      adminCall<{ items: EventItem[] }>('list_events'),
    ])
      .then(([b, e]) => {
        setItems(b.items);
        setEvents(e.items);
      })
      .catch((e) => toast({ title: 'Не удалось загрузить заявки', description: e.message, variant: 'destructive' }));

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    (items || []).forEach((b) => {
      if (b.status === 'cancelled') return;
      const key = b.event_id ? String(b.event_id) : NO_EVENT;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [items]);

  const visibleEvents = useMemo(() => {
    const withBookings = new Set((items || []).map((b) => b.event_id).filter(Boolean) as number[]);
    return events
      .filter((e) => !e.archived || withBookings.has(e.id))
      .sort((a, b) => (a.date + a.time_start).localeCompare(b.date + b.time_start));
  }, [events, items]);

  const setStatus = async (id: number, status: string) => {
    await adminCall('set_booking_status', { id, status });
    setItems((prev) => prev && prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const remove = async (id: number) => {
    if (!window.confirm('Удалить заявку?')) return;
    await adminCall('delete_booking', { id });
    setItems((prev) => prev && prev.filter((b) => b.id !== id));
  };

  if (!items) return <p className="py-10 text-center text-slate-500">Загружаю...</p>;

  const filtered = items.filter((b) => {
    if (filter === ALL) return true;
    if (filter === NO_EVENT) return !b.event_id;
    return String(b.event_id) === filter;
  });

  const activeCount = items.filter((b) => b.status !== 'cancelled').length;
  const noEventCount = counts[NO_EVENT] || 0;

  const chip = (key: string, label: string, count: number, archived = false) => (
    <button
      key={key}
      onClick={() => setFilter(key)}
      className={`flex shrink-0 flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-colors ${
        filter === key
          ? 'border-slate-900 bg-slate-900 text-white'
          : `border-slate-200 hover:bg-slate-100 ${archived ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-800'}`
      }`}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className={`text-xs ${filter === key ? 'text-slate-300' : 'text-slate-500'}`}>
        записалось: <b>{count}</b>
      </span>
    </button>
  );

  const current = events.find((e) => String(e.id) === filter);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Заявки ({filtered.length})</h2>
        <Button variant="outline" size="sm" onClick={load}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить
        </Button>
      </div>

      <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
        {chip(ALL, 'Все заявки', activeCount)}
        {visibleEvents.map((e) =>
          chip(
            String(e.id),
            `${fmtDate(e.date)} · ${e.time_start}${e.title ? ` · ${e.title}` : ` · ${e.place}`}`,
            counts[String(e.id)] || 0,
            e.archived,
          ),
        )}
        {noEventCount > 0 && chip(NO_EVENT, 'Без выбора занятия', noEventCount)}
      </div>
      <p className="mb-5 text-xs text-slate-500">В счётчик не входят заявки со статусом «Отказ».</p>

      {current && (
        <div className="mb-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-bold text-slate-900">
            {fmtDate(current.date)} · {current.time_start} {current.title && `· ${current.title}`}
          </div>
          <div>{current.place}</div>
          <div className="mt-1 font-semibold">
            Записалось: {counts[String(current.id)] || 0}
            {current.archived && <span className="ml-2 font-normal text-slate-500">(занятие прошло)</span>}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-slate-500">
          {filter === ALL ? 'Заявок пока нет' : 'На это занятие пока никто не записался'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-bold text-slate-900">{b.name}</div>
                <a href={`tel:${b.phone}`} className="text-sm font-semibold text-blue-700">
                  {b.phone}
                </a>
                {b.event_label && (
                  <div className="mt-1 text-sm font-semibold text-slate-800">Занятие: {b.event_label}</div>
                )}
                <div className="mt-1 text-xs text-slate-500">
                  {!b.event_label && `${b.slot || 'Любое время'} · `}
                  {fmt(b.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={b.status}
                  onChange={(e) => setStatus(b.id, e.target.value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${STATUS[b.status]?.cls || ''}`}
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <Button variant="ghost" size="icon" onClick={() => remove(b.id)}>
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
