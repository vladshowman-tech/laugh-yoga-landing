import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { adminCall } from './adminApi';

interface EventItem {
  id: number;
  date: string;
  time_start: string;
  time_end: string;
  place: string;
  title: string;
  address: string;
  archived: boolean;
  capacity: number | null;
  taken: number;
}

const EMPTY = { id: 0, date: '', time_start: '', time_end: '', place: '', title: '', address: '', capacity: '' as string | number | null };

const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
};

const EventCard = ({ e, onEdit, onDelete, onCopy }: { e: EventItem; onEdit: () => void; onDelete: () => void; onCopy: () => void }) => (
  <div className={`flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between ${e.archived ? 'border-slate-200 bg-slate-50' : 'border-slate-300 bg-white'}`}>
    <div>
      <div className="font-bold text-slate-900">
        {fmtDate(e.date)} · {e.time_start}
        {e.time_end && `–${e.time_end}`}
        {e.title && <span className="font-semibold text-slate-600"> · {e.title}</span>}
      </div>
      <div className="mt-1 text-sm text-slate-700">{e.place}</div>
      {e.address && <div className="text-sm text-slate-500">{e.address}</div>}
      <div className="mt-1.5">
        {e.capacity ? (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              e.taken >= e.capacity ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {e.taken >= e.capacity ? 'Мест нет' : `Свободно ${e.capacity - e.taken}`} · занято {e.taken} из {e.capacity}
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            Без лимита · записалось {e.taken}
          </span>
        )}
      </div>
    </div>
    <div className="flex shrink-0 gap-1">
      <Button variant="ghost" size="icon" title="Копировать" onClick={onCopy}>
        <Icon name="Copy" size={16} />
      </Button>
      <Button variant="ghost" size="icon" title="Изменить" onClick={onEdit}>
        <Icon name="Pencil" size={16} />
      </Button>
      <Button variant="ghost" size="icon" title="Удалить" onClick={onDelete}>
        <Icon name="Trash2" size={16} />
      </Button>
    </div>
  </div>
);

const ScheduleTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [items, setItems] = useState<EventItem[] | null>(null);
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const [saving, setSaving] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const load = () =>
    adminCall<{ items: EventItem[] }>('list_events')
      .then((r) => setItems(r.items))
      .catch((e) => toast({ title: 'Не удалось загрузить', description: e.message, variant: 'destructive' }));

  useEffect(() => {
    load();
  }, []);

  const refreshSite = () => qc.invalidateQueries({ queryKey: ['site-content'] });

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      await adminCall(form.id ? 'update_event' : 'add_event', form);
      toast({ title: form.id ? 'Занятие обновлено' : 'Занятие добавлено' });
      setForm(null);
      await load();
      refreshSite();
    } catch (e) {
      toast({ title: 'Не удалось сохранить', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!window.confirm('Удалить занятие?')) return;
    await adminCall('delete_event', { id });
    await load();
    refreshSite();
  };

  if (!items) return <p className="py-10 text-center text-slate-500">Загружаю...</p>;

  const upcoming = items.filter((e) => !e.archived).sort((a, b) => (a.date + a.time_start).localeCompare(b.date + b.time_start));
  const archive = items.filter((e) => e.archived);

  const set = (k: string, v: string) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">Предстоящие занятия ({upcoming.length})</h2>
          <Button onClick={() => setForm({ ...EMPTY })}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить занятие
          </Button>
        </div>

        {form && (
          <div className="mb-6 rounded-xl border-2 border-slate-900 bg-slate-50 p-5">
            <h3 className="mb-4 font-bold text-slate-900">{form.id ? 'Изменить занятие' : 'Новое занятие'}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Дата *</label>
                <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Время начала *</label>
                <Input type="time" value={form.time_start} onChange={(e) => set('time_start', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Время окончания</label>
                <Input type="time" value={form.time_end} onChange={(e) => set('time_end', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-3">
                <label className="text-sm font-semibold text-slate-800">Место *</label>
                <Input
                  placeholder="Например: Студия «Лотос»"
                  value={form.place}
                  onChange={(e) => set('place', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-3">
                <label className="text-sm font-semibold text-slate-800">Дополнительное наименование</label>
                <Input
                  placeholder="Например: Вечерняя группа"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-800">Лимит мест</label>
                <Input
                  type="number"
                  min={1}
                  placeholder="Без ограничений"
                  value={form.capacity ?? ''}
                  onChange={(e) => set('capacity', e.target.value)}
                />
                <span className="text-xs text-slate-500">Оставьте пустым, если мест неограниченно</span>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-3">
                <label className="text-sm font-semibold text-slate-800">Адрес</label>
                <Input
                  placeholder="Например: ул. Ленина, 24, 3 этаж"
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <Button onClick={save} disabled={saving || !form.date || !form.time_start || !form.place.trim()}>
                {saving ? 'Сохраняю...' : 'Сохранить'}
              </Button>
              <Button variant="outline" onClick={() => setForm(null)}>
                Отмена
              </Button>
            </div>
          </div>
        )}

        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-slate-500">Предстоящих занятий нет. Раздел на сайте скрыт, пока не добавите новые.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((e) => (
              <EventCard
                key={e.id}
                e={e}
                onEdit={() => setForm({ ...e })}
                onDelete={() => remove(e.id)}
                onCopy={() => setForm({ ...e, id: 0, date: '' })}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
        <button
          onClick={() => setShowArchive((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Icon name="Archive" size={20} />
            Архив ({archive.length})
          </h2>
          <Icon name={showArchive ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </button>
        <p className="mt-1 text-sm text-slate-500">Сюда занятия попадают сами, когда их время прошло. На сайте они не показываются.</p>

        {showArchive && (
          <div className="mt-5 flex flex-col gap-3">
            {archive.length === 0 && <p className="py-4 text-center text-slate-500">Архив пуст</p>}
            {archive.map((e) => (
              <EventCard
                key={e.id}
                e={e}
                onEdit={() => setForm({ ...e })}
                onDelete={() => remove(e.id)}
                onCopy={() => {
                  setForm({ ...e, id: 0, date: '' });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTab;