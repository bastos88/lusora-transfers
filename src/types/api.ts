import type { BookingConfirmation, Vehicle, TransferService, Testimonial, FaqItem } from './travel';
export interface Catalog { vehicles:Vehicle[]; transferServices:TransferService[]; testimonials:Testimonial[]; faqs:FaqItem[]; }
export interface Reservation extends BookingConfirmation {
  id:number; status:string; statusLabel:string; paymentStatus:string; paymentStatusLabel:string;
  canCancel:boolean; totalCents:number; vehicle:Vehicle; service:TransferService;
}
export interface Quote {
  journeys:number; service_price_cents:number; vehicle_supplement_cents:number;
  price_per_journey_cents:number; total_cents:number; currency:string;
}
export interface Paginated<T> { data:T[]; meta:{ current_page:number; last_page:number }; }
