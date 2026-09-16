import {useEffect,useState} from 'react';
type StorageType='local'|'session';
export function useStoredState<T>(key:string,initialValue:T,storageType:StorageType='session',deserialize:(value:unknown)=>T=(value)=>value as T) {
  const [value,setValue]=useState<T>(initialValue);
  const [hydrated,setHydrated]=useState(false);
  useEffect(()=>{
    try { const raw=(storageType==='local'?localStorage:sessionStorage).getItem(key); if(raw) setValue(deserialize(JSON.parse(raw))); }
    catch { /* Invalid drafts are ignored. */ }
    setHydrated(true);
    // Initialization runs once for this storage key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[key,storageType]);
  useEffect(()=>{
    if(!hydrated) return;
    try { (storageType==='local'?localStorage:sessionStorage).setItem(key,JSON.stringify(value)); }
    catch { /* Booking still works without browser storage. */ }
  },[key,storageType,value,hydrated]);
  return [value,setValue] as const;
}
