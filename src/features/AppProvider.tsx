'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import type {ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import type {AuthUser,BookingFormValues,NavigateFunction} from '../types/travel';
import type {Catalog,Reservation} from '../types/api';
import {api,ApiError} from '../services/api';
import {useStoredState} from '../hooks/useStoredState';
import {parseStoredBooking} from '../utils/bookingStorage';

const emptyCatalog:Catalog={vehicles:[],transferServices:[],testimonials:[],faqs:[]};
const CatalogContext=createContext<Catalog>(emptyCatalog);
export const useCatalog=()=>useContext(CatalogContext);
function useAppState() {
  const router=useRouter();
  const [user,setUser]=useState<AuthUser|null>(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [authError,setAuthError]=useState('');
  const [booking,setBooking]=useStoredState<BookingFormValues|null>('lusora-draft',null,'session',parseStoredBooking);
  const [serviceId,setServiceId]=useStoredState<string|null>('lusora-service',null);
  const [vehicleId,setVehicleId]=useStoredState<string|null>('lusora-vehicle',null);
  const [confirmation,setConfirmation]=useState<Reservation|null>(null);
  const [returnTo,setReturnTo]=useState('/customer');
  const navigate:NavigateFunction=(to,options)=>{
    const aliases:Record<string,string>={'/conta':'/login','/minha-reserva':'/customer/bookings','/informacoes-pessoais':'/customer/profile','/confirmacao':'/confirmation'};
    const target=aliases[to]??to;
    if (target.startsWith('/') && !target.startsWith('//')) { if(options?.replace) router.replace(target); else router.push(target); }
  };
  async function refreshUser() {
    setAuthLoading(true); setAuthError('');
    try { setUser((await api<{data:AuthUser}>('/user')).data); }
    catch(e) { setUser(null); if (!(e instanceof ApiError && e.status===401)) setAuthError('Não foi possível verificar a sessão. Tente novamente.'); }
    finally { setAuthLoading(false); }
  }
  useEffect(()=>{
    for(const key of ['getting-travel-user','getting-travel-confirmation']) { try { localStorage.removeItem(key); } catch { /* storage may be disabled */ } }
    void refreshUser();
  },[]);
  async function logout() {
    try { await api('/logout',{method:'POST'}); setUser(null); setConfirmation(null); navigate('/login'); }
    catch(e) { setAuthError(e instanceof Error?e.message:'Não foi possível terminar a sessão.'); }
  }
  return {user,setUser,authLoading,authError,refreshUser,booking,setBooking,serviceId,setServiceId,vehicleId,setVehicleId,confirmation,setConfirmation,returnTo,setReturnTo,navigate,logout};
}
type AppState=ReturnType<typeof useAppState>;
const AppContext=createContext<AppState|null>(null);
export function useApp() { const state=useContext(AppContext); if(!state) throw new Error('AppProvider missing'); return state; }
export function AppProvider({catalog,children}:{catalog:Catalog|null;children:ReactNode}) {
  const state=useAppState();
  return <CatalogContext.Provider value={catalog??emptyCatalog}><AppContext.Provider value={state}>
    {!catalog && <div className="app-notice" role="alert">Não foi possível carregar os serviços. <button onClick={()=>window.location.reload()}>Tentar novamente</button></div>}
    {state.authError && <div className="app-notice" role="alert">{state.authError}<button onClick={()=>void state.refreshUser()}>Tentar novamente</button></div>}
    {children}
  </AppContext.Provider></CatalogContext.Provider>;
}
