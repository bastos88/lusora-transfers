'use client';
import {useEffect,useState} from 'react';
import type {FormEvent} from 'react';
import Link from 'next/link';
import {useApp} from '../AppProvider';
import {PageShell} from '../../components/PageShell/PageShell';
import {TripSummary} from '../../components/TripSummary/TripSummary';
import type {Paginated,Reservation} from '../../types/api';
import type {AuthUser} from '../../types/travel';
import {api,json} from '../../services/api';
import {formatCurrency} from '../../utils/pricing';
import styles from '../../views/CustomerAreaPage/CustomerAreaPage.module.css';
export function CustomerView({view='bookings',id}:{view?:'bookings'|'profile';id?:string}) {
 const a=useApp();
 const [records,setRecords]=useState<Reservation[]>([]),[page,setPage]=useState(1),[lastPage,setLastPage]=useState(1);
 const [loading,setLoading]=useState(true),[error,setError]=useState(''),[busy,setBusy]=useState(false),[notice,setNotice]=useState(''),[version,setVersion]=useState(0);
 useEffect(()=>{
   if(!a.authLoading&&!a.user){a.setReturnTo(view==='profile'?'/customer/profile':'/customer/bookings');a.navigate('/login',{replace:true});}
   // eslint-disable-next-line react-hooks/exhaustive-deps
 },[a.authLoading,a.user,view]);
 useEffect(()=>{
   if(!a.user||view==='profile'){setLoading(false);return;}
   let active=true;setLoading(true);setError('');
   const request=id?api<{data:Reservation}>('/bookings/'+encodeURIComponent(id)).then(r=>({data:[r.data],meta:{last_page:1}})):api<Paginated<Reservation>>('/bookings?page='+page);
   void request.then(r=>{if(active){setRecords(r.data);setLastPage(r.meta.last_page);}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
   return()=>{active=false;};
 },[a.user,view,id,page,version]);
 async function cancel(record:Reservation) {
   if(!window.confirm('Cancelar a reserva '+record.reference+'?'))return;
   setBusy(true);setError('');
   try {const r=await api<{data:Reservation}>('/bookings/'+record.id+'/cancel',{method:'POST'});setRecords(items=>items.map(item=>item.id===record.id?r.data:item));}
   catch(e){setError(e instanceof Error?e.message:'Não foi possível cancelar.');}finally{setBusy(false);}
 }
 async function profile(event:FormEvent<HTMLFormElement>) {
   event.preventDefault();setBusy(true);setError('');setNotice('');
   const form=new FormData(event.currentTarget);
   try {const r=await api<{data:AuthUser}>('/user',{method:'PATCH',body:json(Object.fromEntries(form))});a.setUser(r.data);setNotice('Perfil atualizado.');}
   catch(e){setError(e instanceof Error?e.message:'Não foi possível guardar.');}finally{setBusy(false);}
 }
 if(!a.user)return <main className="app-panel" role="status">A verificar a sessão…</main>;
 return <PageShell onNavigate={a.navigate} accountLabel={'Olá, '+a.user.name.split(' ')[0]} isAuthenticated>
 <section className={styles.pageHero}><div><p>Área do cliente</p><h1>Olá, {a.user.name.split(' ')[0]}.</h1><span>Consulte as suas reservas e atualize os dados pessoais.</span></div></section>
 <div className={styles.layout}><aside className={styles.sidebar}><nav aria-label="Área do cliente">
 <Link href="/customer/bookings" aria-current={view==='bookings'?'page':undefined}>Minhas reservas</Link>
 <Link href="/customer/profile" aria-current={view==='profile'?'page':undefined}>Informações pessoais</Link>
 </nav><button className={styles.logoutButton} onClick={()=>void a.logout()}>Terminar sessão</button></aside>
 <section className={styles.content}>
 {error&&<div role="alert">{error} <button onClick={()=>setVersion(v=>v+1)}>Tentar novamente</button></div>}
 {notice&&<p role="status">{notice}</p>}
 {view==='profile'?<form className="app-form" onSubmit={profile}><h2>Informações pessoais</h2>
 <label>Nome completo<input name="name" defaultValue={a.user.name} required minLength={2} maxLength={255} autoComplete="name"/></label>
 <label>Email<input name="email" type="email" defaultValue={a.user.email} required maxLength={255} autoComplete="email"/></label>
 <label>Telefone<input name="phone" type="tel" defaultValue={a.user.phone??''} required minLength={8} maxLength={40} autoComplete="tel"/></label>
 <button disabled={busy}>{busy?'A guardar…':'Guardar alterações'}</button></form>:<>
 <h2>{id?'Detalhes da reserva':'Minhas reservas'}</h2>
 {loading?<p role="status">A carregar reservas…</p>:records.length===0&&!error?<div className={styles.emptyState}><h3>Ainda não tem reservas.</h3><Link href="/booking">Fazer uma reserva</Link></div>:records.map(record=>
 <article key={record.id} className={styles.bookingContent}>
 <div className={styles.referenceCard}><Link href={'/customer/bookings/'+record.id}><strong>{record.reference}</strong></Link>
 <span>{record.statusLabel} · Pagamento: {record.paymentStatusLabel}</span></div>
 <TripSummary booking={record.booking} onNavigate={a.navigate} compact editable={false}/>
 <div className={styles.detailCard}><h3>{record.vehicle.name} · {record.service.name}</h3><p>Total: {formatCurrency(record.total)}</p>
 <p>{record.customer.fullName} · {record.customer.phone}</p><p>Bagagem: {record.booking.luggage??0} malas</p>
 {id&&<><p>Voo: {record.customer.flightNumber||'Não indicado'}</p><p>{record.customer.notes}</p></>}
 {record.canCancel&&<button disabled={busy} className={styles.primaryButton} onClick={()=>void cancel(record)}>Cancelar reserva</button>}</div>
 </article>)}
 {!id&&lastPage>1&&<nav aria-label="Paginação"><button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Anterior</button><span> {page} / {lastPage} </span><button disabled={page===lastPage} onClick={()=>setPage(p=>p+1)}>Seguinte</button></nav>}
 </>}
 </section></div></PageShell>;
}
