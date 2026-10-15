import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { adminCall } from './adminApi';

interface Admin {
  id: number;
  username: string;
  me: boolean;
}

const AdminsTab = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Admin[]>([]);
  const [form, setForm] = useState({ username: '', password: '' });
  const [pw, setPw] = useState({ old_password: '', new_password: '' });

  const load = () => adminCall<{ items: Admin[] }>('list_admins').then((r) => setItems(r.items));

  useEffect(() => {
    load();
  }, []);

  const run = async (fn: () => Promise<unknown>, okText: string) => {
    try {
      await fn();
      toast({ title: okText });
      load();
    } catch (e) {
      toast({ title: 'Ошибка', description: (e as Error).message, variant: 'destructive' });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Администраторы</h2>
        <div className="mb-6 flex flex-col gap-2">
          {items.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <span className="font-semibold text-slate-900">
                {a.username} {a.me && <span className="text-xs font-medium text-slate-500">(это вы)</span>}
              </span>
              {!a.me && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (window.confirm(`Удалить администратора ${a.username}?`))
                      run(() => adminCall('delete_admin', { id: a.id }), 'Администратор удалён');
                  }}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>

        <h3 className="mb-3 font-bold text-slate-900">Добавить администратора</h3>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Логин"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Пароль (от 6 символов)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button
            className="w-fit"
            onClick={() =>
              run(async () => {
                await adminCall('add_admin', form);
                setForm({ username: '', password: '' });
              }, 'Администратор добавлен')
            }
          >
            Добавить
          </Button>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Сменить мой пароль</h2>
        <div className="flex flex-col gap-3">
          <Input
            type="password"
            placeholder="Текущий пароль"
            value={pw.old_password}
            onChange={(e) => setPw({ ...pw, old_password: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Новый пароль (от 6 символов)"
            value={pw.new_password}
            onChange={(e) => setPw({ ...pw, new_password: e.target.value })}
          />
          <Button
            className="w-fit"
            onClick={() =>
              run(async () => {
                await adminCall('change_password', pw);
                setPw({ old_password: '', new_password: '' });
              }, 'Пароль изменён')
            }
          >
            Сменить пароль
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminsTab;
