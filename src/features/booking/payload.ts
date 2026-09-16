import type {BookingFormValues} from '../../types/travel';
// Interpret the form's wall clock in Portugal, irrespective of the customer's browser timezone.
export function lisbonDateTime(date:string,time:string):string {
  const wall=Date.parse(`${date}T${time}:00Z`);
  if(!Number.isFinite(wall)) throw new Error('Data inválida.');
  let instant=wall;
  for(let i=0;i<3;i++) {
    const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(instant));
    const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    const rendered=Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    const correction=wall-rendered;
    if(!correction) return new Date(instant).toISOString().replace('.000Z','+00:00');
    instant+=correction;
  }
  throw new Error('Esta hora não existe devido à mudança de horário. Escolha outra hora.');
}
export function tripPayload(booking:BookingFormValues,serviceId:string,vehicleId:string) {
 return {service_id:serviceId,vehicle_id:vehicleId,trip_type:booking.tripType,
 origin:booking.origin,destination:booking.destination,passengers:booking.passengers,luggage:booking.luggage??0,
 pickup_at:lisbonDateTime(booking.departureDate,booking.departureTime),
 ...(booking.tripType==='round-trip'?{return_at:lisbonDateTime(booking.returnDate,booking.returnTime)}:{})};
}
