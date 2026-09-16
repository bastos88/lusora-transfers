import type { Catalog } from '../types/api';
export async function getCatalog(): Promise<Catalog> {
  const base = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';
  const paths = ['vehicles','services','testimonials','faqs'];
  const values = await Promise.all(paths.map(async path => {
    const response = await fetch(`${base}/api/${path}`,{cache:'no-store',signal:AbortSignal.timeout(5000)});
    if (!response.ok) throw new Error('Catálogo indisponível');
    return (await response.json()).data;
  }));
  return {vehicles:values[0],transferServices:values[1],testimonials:values[2],faqs:values[3]};
}
