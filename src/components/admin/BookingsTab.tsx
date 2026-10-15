import { useEffect, useState } from 'react';
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
}

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: 'Новая', cls: 'bg-amber-100 text-amber-900' },
  in_work: { label: 'В работе', cls: 'bg-blue-100 text-blue-900' },
  done: { label: 'Записан', cls: 'bg-green-100 text-green-900' },
  cancelled: { label: 'Отказ', cls: 'bg-slate-200 text-slate-700' },
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

const BookingsTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Booking[] | null>(null);

  const load = () =>
    adminCall<{ items: Booking[] }>('list_bookings')
      .then((r) => setItems(r.items))
      .catch((e) => toast({ title: 'Не удалось загрузить заявки', description: e.message, variant: 'destructive' }));

  useEffect(() => {
    load();
  }, []);

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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Заявки ({items.length})</h2>
        <Button variant="outline" size="sm" onClick={load}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-slate-500">Заявок пока нет</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((b) => (
            <div
              key={b.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="font-bold text-slate-900">{b.name}</div>
                <a href={`tel:${b.phone}`} className="text-sm font-semibold text-blue-700">
                  {b.phone}
                </a>
                <div className="mt-1 text-xs text-slate-500">
                  {b.slot || 'Любое время'} · {fmt(b.created_at)}
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
