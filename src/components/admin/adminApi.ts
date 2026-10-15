import { ADMIN_URL } from '@/lib/api';

const TOKEN_KEY = 'admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class AuthError extends Error {}

export async function adminCall<T = any>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Token': getToken() },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && action !== 'login') throw new AuthError(data.error || 'Нужно войти');
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data as T;
}

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
