export class ApiError extends Error {
  constructor(public status: number, message: string, public errors: Record<string,string[]> = {}) { super(message); }
}
let csrfRequest: Promise<void> | null = null;
export async function csrf() {
  csrfRequest ??= fetch('/sanctum/csrf-cookie', { credentials:'include', headers:{Accept:'application/json'} })
    .then(r => { if (!r.ok) throw new ApiError(r.status,'Não foi possível iniciar uma sessão segura.'); })
    .finally(() => { csrfRequest = null; });
  return csrfRequest;
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = options.method ?? 'GET';
  if (!['GET','HEAD'].includes(method)) await csrf();
  const token = typeof document === 'undefined' ? '' : document.cookie.split('; ').find(c=>c.startsWith('XSRF-TOKEN='))?.slice(11);
  const response = await fetch('/api'+path, {
    ...options, credentials:'include', cache:'no-store',
    headers:{Accept:'application/json','Content-Type':'application/json',...(token ? {'X-XSRF-TOKEN':decodeURIComponent(token)} : {}),...options.headers},
  });
  if (response.status === 204) return undefined as T;
  const body = await response.json().catch(()=>({message:'O serviço está temporariamente indisponível.'}));
  if (!response.ok) {
    const errors = body.errors ?? {};
    const first = Object.values(errors).flat()[0];
    throw new ApiError(response.status, typeof first === 'string' ? first : body.message ?? 'O pedido falhou.', errors);
  }
  return body as T;
}
export const json = (value: unknown) => JSON.stringify(value);
