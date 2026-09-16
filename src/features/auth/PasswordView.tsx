'use client';
import {useState} from 'react';
import type {FormEvent} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {PageShell} from '../../components/PageShell/PageShell';
import {useApp} from '../AppProvider';
import {api,json} from '../../services/api';
export function PasswordView({reset=false}:{reset?:boolean}) {
 const a=useApp(),params=useSearchParams();
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>) {
   e.preventDefault();setBusy(true);setError('');setMessage('');
   const form=Object.fromEntries(new FormData(e.currentTarget));
   try{const r=await api<{message:string}>(reset?'/reset-password':'/forgot-password',{method:'POST',body:json({...form,token:params.get('token')})});setMessage(r.message);}
   catch(e){setError(e instanceof Error?e.message:'O pedido falhou.');}finally{setBusy(false);}
 }
 return <PageShell onNavigate={a.navigate}><section className="app-panel"><h1>{reset?'Nova palavra-passe':'Recuperar palavra-passe'}</h1>
 <form className="app-form" onSubmit={submit}><label>Email<input name="email" type="email" defaultValue={params.get('email')??''} required autoComplete="email"/></label>
 {reset&&<><label>Nova palavra-passe<input name="password" type="password" minLength={8} required autoComplete="new-password"/></label><label>Confirmar palavra-passe<input name="password_confirmation" type="password" minLength={8} required autoComplete="new-password"/></label></>}
 {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}<button disabled={busy}>{busy?'A enviar…':reset?'Guardar palavra-passe':'Enviar link de recuperação'}</button>
 <Link href="/login">Voltar ao login</Link></form></section></PageShell>;
}
