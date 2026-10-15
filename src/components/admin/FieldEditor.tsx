import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { adminCall, fileToBase64 } from './adminApi';
import type { Field } from './schema';

type Obj = Record<string, any>;

interface Props {
  fields: Field[];
  value: Obj;
  onChange: (v: Obj) => void;
}

const ImageField = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const pick = async (file?: File) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast({ title: 'Файл больше 4 МБ', variant: 'destructive' });
      return;
    }
    setBusy(true);
    try {
      const data = await fileToBase64(file);
      const res = await adminCall<{ url: string }>('upload_image', { data, content_type: file.type });
      onChange(res.url);
    } catch (e) {
      toast({ title: 'Не удалось загрузить фото', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {value && <img src={value} alt="" className="h-40 w-40 rounded-lg border object-cover" />}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <Button type="button" variant="outline" disabled={busy} onClick={() => ref.current?.click()} className="w-fit">
        <Icon name="Upload" size={16} className="mr-2" />
        {busy ? 'Загружаю...' : value ? 'Заменить фото' : 'Загрузить фото'}
      </Button>
    </div>
  );
};

const StringsField = ({
  value,
  onChange,
  addLabel,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  addLabel: string;
}) => (
  <div className="flex flex-col gap-2">
    {value.map((s, i) => (
      <div key={i} className="flex gap-2">
        <Input value={s} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange(value.filter((_, j) => j !== i))}>
          <Icon name="Trash2" size={16} />
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => onChange([...value, ''])}>
      <Icon name="Plus" size={16} className="mr-1" />
      {addLabel}
    </Button>
  </div>
);

const FieldEditor = ({ fields, value, onChange }: Props) => {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-col gap-5">
      {fields.map((f) => {
        if (f.kind === 'bool') {
          return (
            <div key={f.key} className="flex items-center gap-3">
              <Switch checked={value[f.key] !== false && !!value[f.key]} onCheckedChange={(c) => set(f.key, c)} />
              <span className="text-sm font-medium text-slate-800">{f.label}</span>
            </div>
          );
        }

        return (
          <div key={f.key} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-800">{f.label}</label>

            {f.kind === 'text' && (
              <>
                <Input value={value[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
                {f.hint && <span className="text-xs text-slate-500">{f.hint}</span>}
              </>
            )}

            {f.kind === 'textarea' && (
              <Textarea rows={4} value={value[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />
            )}

            {f.kind === 'image' && <ImageField value={value[f.key] ?? ''} onChange={(v) => set(f.key, v)} />}

            {f.kind === 'strings' && (
              <StringsField value={value[f.key] ?? []} addLabel={f.addLabel} onChange={(v) => set(f.key, v)} />
            )}

            {f.kind === 'list' && (
              <div className="flex flex-col gap-3">
                {(value[f.key] ?? []).map((item: Obj, i: number, arr: Obj[]) => {
                  const move = (d: number) => {
                    const next = [...arr];
                    const j = i + d;
                    if (j < 0 || j >= next.length) return;
                    [next[i], next[j]] = [next[j], next[i]];
                    set(f.key, next);
                  };
                  return (
                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-bold text-slate-700">
                          {i + 1}. {item[f.itemTitleKey] || 'Без названия'}
                        </span>
                        <div className="flex shrink-0 gap-1">
                          <Button type="button" variant="ghost" size="icon" disabled={i === 0} onClick={() => move(-1)}>
                            <Icon name="ArrowUp" size={16} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={i === arr.length - 1}
                            onClick={() => move(1)}
                          >
                            <Icon name="ArrowDown" size={16} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => set(f.key, arr.filter((_, j) => j !== i))}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                      <FieldEditor
                        fields={f.fields}
                        value={item}
                        onChange={(nv) => set(f.key, arr.map((x, j) => (j === i ? nv : x)))}
                      />
                    </div>
                  );
                })}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => set(f.key, [...(value[f.key] ?? []), JSON.parse(JSON.stringify(f.empty))])}
                >
                  <Icon name="Plus" size={16} className="mr-1" />
                  {f.addLabel}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FieldEditor;
