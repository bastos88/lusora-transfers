'use client';
import {useEffect,useRef,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useApp,useCatalog} from '../AppProvider';
import {HomePage} from '../../views/HomePage/HomePage';
import {TransfersPage} from '../../views/TransfersPage/TransfersPage';
import {CheckoutPage} from '../../views/CheckoutPage/CheckoutPage';
import {ConfirmationPage} from '../../views/ConfirmationPage/ConfirmationPage';
import {AuthPage} from '../../views/AuthPage/AuthPage';
import type {AuthUser,CheckoutFormValues,PricingBreakdown} from '../../types/travel';
import type {Quote,Reservation} from '../../types/api';
import {api,json} from '../../services/api';
import {tripPayload} from './payload';
export function HomeView() {
 const a=useApp();
 return <HomePage user={a.user} booking={a.booking} onNavigate={a.navigate} onBookingSubmit={values=>{
   a.setBooking(values);a.setServiceId(null);a.setVehicleId(null);a.navigate('/transfers');
 }}/>;
}
export function TransfersView() {
 const a=useApp();
 return <TransfersPage user={a.user} booking={a.booking} selectedServiceId={a.serviceId} selectedVehicleId={a.vehicleId}
 onServiceSelect={a.setServiceId} onVehicleSelect={a.setVehicleId} onNavigate={a.navigate}
 onContinue={()=>{a.setReturnTo('/checkout');a.navigate(a.user?'/checkout':'/login');}}/>;
}
export function AuthView({mode='login'}:{mode?:'login'|'register'}) {
 const a=useApp();
 return <AuthPage initialMode={mode} user={a.user} onNavigate={a.navigate} onLogout={()=>void a.logout()}
 onAuthenticated={(user:AuthUser)=>{a.setUser(user);a.navigate(a.returnTo);}}/>;
}
export function CheckoutView() {
 const a=useApp(),catalog=useCatalog();
 const [quote,setQuote]=useState<Quote|null>(null),[error,setError]=useState(''),[version,setVersion]=useState(0);
 const key=useRef<string|null>(null),requestHash=useRef('');
 const vehicle=catalog.vehicles.find(v=>v.id===a.vehicleId)??null;
 const service=catalog.transferServices.find(s=>s.id===a.serviceId)??null;
 useEffect(()=>{
   if(!a.authLoading && !a.user) {a.setReturnTo('/checkout');a.navigate('/login',{replace:true});}
   // Router callbacks are intentionally omitted: the guard follows authentication state.
   // eslint-disable-next-line react-hooks/exhaustive-deps
 },[a.authLoading,a.user]);
 useEffect(()=>{
   setQuote(null);setError('');
   if(!a.booking||!a.serviceId||!a.vehicleId) return;
   let active=true;
   try {
     const payload=tripPayload(a.booking,a.serviceId,a.vehicleId);
     void api<{data:Quote}>('/quotes',{method:'POST',body:json(payload)}).then(r=>{if(active)setQuote(r.data);}).catch(e=>{if(active)setError(e.message);});
   }catch(e){setError(e instanceof Error?e.message:'Data inválida.');}
   return ()=>{active=false;};
 },[a.booking,a.serviceId,a.vehicleId,version]);
 async function submit(values:CheckoutFormValues) {
   if(!a.booking||!service||!vehicle||!quote||!a.user) throw new Error('Aguarde pelo orçamento e inicie sessão.');
   const payload={...tripPayload(a.booking,service.id,vehicle.id),customer_name:values.fullName,customer_email:values.email,
     customer_phone:values.phone,flight_number:values.flightNumber,notes:values.notes,payment_method:values.paymentMethod,
     accept_terms:values.acceptTerms,expected_total_cents:quote.total_cents};
   const hash=json(payload);
   if(hash!==requestHash.current){key.current=crypto.randomUUID();requestHash.current=hash;}
   const result=await api<{data:Reservation}>('/bookings',{method:'POST',body:json({...payload,idempotency_key:key.current})});
   a.setConfirmation(result.data);a.navigate('/confirmation?id='+result.data.id);
 }
 const pricing:PricingBreakdown|null=quote?{journeys:quote.journeys,servicePrice:quote.service_price_cents/100,
 vehicleSupplement:quote.vehicle_supplement_cents/100,pricePerJourney:quote.price_per_journey_cents/100,total:quote.total_cents/100}:null;
 if(a.authLoading||!a.user) return <main className="app-panel" role="status">A verificar a sessão…</main>;
 return <>{error&&<div className="app-notice" role="alert">{error}<button onClick={()=>setVersion(v=>v+1)}>Atualizar orçamento</button></div>}
 <CheckoutPage user={a.user} booking={a.booking} service={service} vehicle={vehicle} onSubmit={submit} onNavigate={a.navigate} serverPricing={pricing}/></>;
}
export function ConfirmationView() {
 const a=useApp(),params=useSearchParams(),id=params.get('id');
 const [record,setRecord]=useState<Reservation|null>(null),[error,setError]=useState('');
 useEffect(()=>{
   if(!id)return;
   let active=true;setRecord(null);setError('');
   void api<{data:Reservation}>('/bookings/'+encodeURIComponent(id)).then(r=>{if(active)setRecord(r.data);}).catch(e=>{if(active)setError(e.message);});
   return()=>{active=false;};
 },[id]);
 const confirmation=id?record:a.confirmation;
 if(error)return <main className="app-panel" role="alert">{error}<button onClick={()=>a.navigate('/customer/bookings')}>Minhas reservas</button></main>;
 if(id&&!record)return <main className="app-panel" role="status">A carregar a reserva…</main>;
 return <ConfirmationPage user={a.user} confirmation={confirmation} onNavigate={a.navigate}
 onNewBooking={()=>{a.setBooking(null);a.setServiceId(null);a.setVehicleId(null);a.navigate('/#reserva');}}/>;
}
