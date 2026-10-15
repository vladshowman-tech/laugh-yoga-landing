import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AuthError, adminCall, clearToken, getToken, setToken } from '@/components/admin/adminApi';
import ContentTab from '@/components/admin/ContentTab';
import BookingsTab from '@/components/admin/BookingsTab';
import AdminsTab from '@/components/admin/AdminsTab';

const TABS = [
  { key: 'content', title: 'Содержимое сайта', icon: 'FileText' },
  { key: 'bookings', title: 'Заявки', icon: 'Inbox' },
  { key: 'admins', title: 'Администраторы', icon: 'Users' },
];

const Login = ({ onDone }: { onDone: () => void }) => {
  const { toast } = useToast();
  const [form, setForm] = useState({ username: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await adminCall<{ token: string }>('login', form);
      setToken(r.token);
      onDone();
    } catch (err) {
      toast({ title: 'Не удалось войти', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-theme flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-2xl font-bold text-slate-900">Вход в админку</h1>
        <p className="mb-6 text-sm text-slate-500">ХО-ХО-ХА-ХА · йога смеха</p>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Логин"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Пароль"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" disabled={busy || !form.username || !form.password}>
            {busy ? 'Входим...' : 'Войти'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const Admin = () => {
  const [auth, setAuth] = useState<'checking' | 'in' | 'out'>(getToken() ? 'checking' : 'out');
  const [username, setUsername] = useState('');
  const [tab, setTab] = useState('content');

  const check = () =>
    adminCall<{ username: string }>('me')
      .then((r) => {
        setUsername(r.username);
        setAuth('in');
      })
      .catch((e) => {
        if (e instanceof AuthError) clearToken();
        setAuth('out');
      });

  useEffect(() => {
    if (getToken()) check();
  }, []);

  const logout = async () => {
    await adminCall('logout').catch(() => null);
    clearToken();
    setAuth('out');
  };

  if (auth === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500">Загружаю...</div>;
  }

  if (auth === 'out') {
    return <Login onDone={() => { setAuth('checking'); check(); }} />;
  }

  return (
    <div className="admin-theme min-h-screen bg-slate-100 font-body text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-slate-900">Админка</span>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-semibold text-blue-700">
              <Icon name="ExternalLink" size={14} />
              Открыть сайт
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{username}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-3">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                tab === t.key ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon name={t.icon} fallback="Circle" size={16} />
              {t.title}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        {tab === 'content' && <ContentTab />}
        {tab === 'bookings' && <BookingsTab />}
        {tab === 'admins' && <AdminsTab />}
      </main>
    </div>
  );
};

export default Admin;