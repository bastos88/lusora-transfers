import { useEffect, useState } from 'react';
import { transferServices } from './data/transferServices';
import { vehicles } from './data/vehicles';
import { useAppRouter } from './hooks/useAppRouter';
import { useStoredState } from './hooks/useStoredState';
import { AuthPage } from './pages/AuthPage/AuthPage';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage/ConfirmationPage';
import { HomePage } from './pages/HomePage/HomePage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { TransfersPage } from './pages/TransfersPage/TransfersPage';
import type {
  AuthUser,
  BookingConfirmation,
  BookingFormValues,
  CheckoutFormValues,
  NavigateFunction,
} from './types/travel';
import { calculatePricing } from './utils/pricing';

const pageTitles: Record<string, string> = {
  '/': 'Getting Travel | Transfer privado no Porto',
  '/conta': 'Área do cliente | Getting Travel',
  '/transfers': 'Escolher transfer e veículo | Getting Travel',
  '/checkout': 'Checkout | Getting Travel',
  '/confirmacao': 'Reserva confirmada | Getting Travel',
};

function createReference(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(2, 10).replaceAll('-', '');
  const uniquePart = date.getTime().toString(36).slice(-5).toUpperCase();
  return `GT-${datePart}-${uniquePart}`;
}

export default function App() {
  const { pathname, navigate } = useAppRouter();
  const [booking, setBooking] = useStoredState<BookingFormValues | null>('getting-travel-booking', null);
  const [selectedServiceId, setSelectedServiceId] = useStoredState<string | null>('getting-travel-service', null);
  const [selectedVehicleId, setSelectedVehicleId] = useStoredState<string | null>('getting-travel-vehicle', null);
  const [confirmation, setConfirmation] = useStoredState<BookingConfirmation | null>('getting-travel-confirmation', null);
  const [user, setUser] = useStoredState<AuthUser | null>('getting-travel-user', null, 'local');
  const [authReturnPath, setAuthReturnPath] = useState('/');

  useEffect(() => {
    document.title = pageTitles[pathname] ?? 'Getting Travel';
  }, [pathname]);

  const handleNavigate: NavigateFunction = (to, options) => {
    if (to.startsWith('/conta') && pathname !== '/conta') {
      setAuthReturnPath(pathname);
    }

    navigate(to, options);
  };

  const handleBookingSubmit = (values: BookingFormValues) => {
    const firstAvailableVehicle = vehicles.find((vehicle) => vehicle.capacity >= values.passengers);

    setBooking(values);
    setSelectedServiceId(null);
    setSelectedVehicleId(firstAvailableVehicle?.id ?? null);
    setConfirmation(null);
    navigate('/transfers');
  };

  const handleServiceSelect = (serviceId: string) => setSelectedServiceId(serviceId);

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find((item) => item.id === vehicleId);

    if (!vehicle || !booking || vehicle.capacity < booking.passengers) {
      return;
    }

    setSelectedVehicleId(vehicleId);
  };

  const handleContinueToCheckout = () => {
    if (booking && selectedServiceId && selectedVehicleId) {
      navigate('/checkout');
    }
  };

  const handleCheckoutSubmit = (values: CheckoutFormValues) => {
    const service = transferServices.find((item) => item.id === selectedServiceId);
    const vehicle = vehicles.find((item) => item.id === selectedVehicleId);

    if (!booking || !service || !vehicle) {
      navigate('/transfers');
      return;
    }

    const pricing = calculatePricing(booking, service, vehicle);
    setConfirmation({
      reference: createReference(),
      booking,
      serviceId: service.id,
      vehicleId: vehicle.id,
      customer: values,
      total: pricing.total,
      createdAt: new Date().toISOString(),
    });
    navigate('/confirmacao');
  };

  const handleAuthenticated = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    navigate(authReturnPath || '/');
    setAuthReturnPath('/');
  };

  const handleLogout = () => setUser(null);

  const handleNewBooking = () => {
    setBooking(null);
    setSelectedServiceId(null);
    setSelectedVehicleId(null);
    setConfirmation(null);
    navigate('/#reserva');
  };

  const selectedService = transferServices.find((service) => service.id === selectedServiceId) ?? null;
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null;

  switch (pathname) {
    case '/':
      return (
        <HomePage
          user={user}
          onBookingSubmit={handleBookingSubmit}
          onNavigate={handleNavigate}
        />
      );
    case '/conta':
      return (
        <AuthPage
          user={user}
          onAuthenticated={handleAuthenticated}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      );
    case '/transfers':
      return (
        <TransfersPage
          user={user}
          booking={booking}
          selectedServiceId={selectedServiceId}
          selectedVehicleId={selectedVehicleId}
          onServiceSelect={handleServiceSelect}
          onVehicleSelect={handleVehicleSelect}
          onContinue={handleContinueToCheckout}
          onNavigate={handleNavigate}
        />
      );
    case '/checkout':
      return (
        <CheckoutPage
          user={user}
          booking={booking}
          service={selectedService}
          vehicle={selectedVehicle}
          onSubmit={handleCheckoutSubmit}
          onNavigate={handleNavigate}
        />
      );
    case '/confirmacao':
      return (
        <ConfirmationPage
          user={user}
          confirmation={confirmation}
          onNewBooking={handleNewBooking}
          onNavigate={handleNavigate}
        />
      );
    default:
      return <NotFoundPage user={user} onNavigate={handleNavigate} />;
  }
}
