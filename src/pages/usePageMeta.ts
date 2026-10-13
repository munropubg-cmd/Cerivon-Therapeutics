import { useEffect } from 'react';
import { BRAND } from '../data/site';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = `${title} · ${BRAND}`;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
