export type TripType = 'one-way' | 'round-trip';

export type BookingField =
  | 'origin'
  | 'destination'
  | 'departureDate'
  | 'departureTime'
  | 'returnDate'
  | 'returnTime'
  | 'passengers';

export interface BookingFormValues {
  tripType: TripType;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  passengers: number;
}

export type BookingFormErrors = Partial<Record<BookingField, string>>;

export interface NavigationItem {
  id: string;
  label: string;
  href: `#${string}`;
}

export interface TrustItem {
  id: string;
  label: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
}

export interface Testimonial {
  id: string;
  name: string;
  source: string;
  text: string;
  initials: string;
  avatarBackground: string;
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  passengers: string;
  luggage: string;
  capacity: number;
  luggageCapacity: number;
  supplement: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
}

export interface TransferService {
  id: string;
  name: string;
  shortName: string;
  description: string;
  badge?: string;
  duration: string;
  basePrice: number;
  includes: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AuthUser {
  name: string;
  email: string;
}

export type AuthMode = 'login' | 'register';

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  flightNumber: string;
  notes: string;
  paymentMethod: 'card-on-arrival' | 'cash';
  acceptTerms: boolean;
}

export type CheckoutField = 'fullName' | 'email' | 'phone' | 'acceptTerms';
export type CheckoutFormErrors = Partial<Record<CheckoutField, string>>;

export interface BookingConfirmation {
  reference: string;
  booking: BookingFormValues;
  serviceId: string;
  vehicleId: string;
  customer: CheckoutFormValues;
  total: number;
  createdAt: string;
}

export interface PricingBreakdown {
  journeys: number;
  servicePrice: number;
  vehicleSupplement: number;
  pricePerJourney: number;
  total: number;
}

export interface NavigateOptions {
  replace?: boolean;
}

export type NavigateFunction = (to: string, options?: NavigateOptions) => void;
