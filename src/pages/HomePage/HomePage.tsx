import { useState } from 'react';
import { vehicles } from '../../data/vehicles';
import { Faq } from '../../sections/Faq/Faq';
import { Features } from '../../sections/Features/Features';
import { Fleet } from '../../sections/Fleet/Fleet';
import { Footer } from '../../sections/Footer/Footer';
import { Hero } from '../../sections/Hero/Hero';
import { Testimonials } from '../../sections/Testimonials/Testimonials';
import { TrustBar } from '../../sections/TrustBar/TrustBar';
import type { AuthUser, BookingFormValues, NavigateFunction } from '../../types/travel';

interface HomePageProps {
  user: AuthUser | null;
  booking: BookingFormValues | null;
  onBookingSubmit: (values: BookingFormValues) => void;
  onNavigate: NavigateFunction;
}

export function HomePage({ user, booking, onBookingSubmit, onNavigate }: HomePageProps) {
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id ?? 'standard');

  const handleVehicleSelect = (vehicleId: string) => setSelectedVehicleId(vehicleId);

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Saltar para o conteúdo
      </a>
      <Hero booking={booking} onBookingSubmit={onBookingSubmit} onNavigate={onNavigate} user={user} />
      <TrustBar />
      <main id="conteudo-principal">
        <Features />
        <Testimonials />
        <Fleet selectedVehicleId={selectedVehicleId} onVehicleSelect={handleVehicleSelect} />
        <Faq />
      </main>
      <Footer onNavigate={onNavigate} isAuthenticated={Boolean(user)} />
    </>
  );
}
