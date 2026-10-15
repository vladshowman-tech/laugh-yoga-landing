import { useQuery } from '@tanstack/react-query';
import { CONTENT_URL } from '@/lib/api';

export type Section = any;
export type SiteContent = Record<string, Section>;

export const useSiteContent = () =>
  useQuery<SiteContent>({
    queryKey: ['site-content'],
    queryFn: async () => {
      const res = await fetch(CONTENT_URL);
      if (!res.ok) throw new Error('content failed');
      return res.json();
    },
    staleTime: 60_000,
  });
