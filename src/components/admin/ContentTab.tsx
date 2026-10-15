import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { adminCall } from './adminApi';
import FieldEditor from './FieldEditor';
import { SECTIONS } from './schema';

const ContentTab = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [content, setContent] = useState<Record<string, any> | null>(null);
  const [active, setActive] = useState(SECTIONS[0].key);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    adminCall('get_content')
      .then(setContent)
      .catch((e) => toast({ title: 'Не удалось загрузить', description: e.message, variant: 'destructive' }));
  }, []);

  const section = SECTIONS.find((s) => s.key === active)!;

  const choose = (key: string) => {
    if (dirty && !window.confirm('Есть несохранённые изменения. Перейти без сохранения?')) return;
    setDirty(false);
    adminCall('get_content').then(setContent);
    setActive(key);
  };

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await adminCall('save_content', { key: active, value: content[active] });
      await qc.invalidateQueries({ queryKey: ['site-content'] });
      setDirty(false);
      toast({ title: 'Сохранено', description: 'Изменения уже видны на сайте.' });
    } catch (e) {
      toast({ title: 'Не удалось сохранить', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <p className="py-10 text-center text-slate-500">Загружаю...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => choose(s.key)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
              active === s.key ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Icon name={s.icon} fallback="Circle" size={16} />
            {s.title}
          </button>
        ))}
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
          <Button onClick={save} disabled={saving || !dirty}>
            <Icon name="Save" size={16} className="mr-2" />
            {saving ? 'Сохраняю...' : 'Сохранить'}
          </Button>
        </div>
        <FieldEditor
          fields={section.fields}
          value={content[active] || {}}
          onChange={(v) => {
            setContent({ ...content, [active]: v });
            setDirty(true);
          }}
        />
      </div>
    </div>
  );
};

export default ContentTab;
