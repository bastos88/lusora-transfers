const doorIcon = '/assets/icons/door.png';
const handshakeIcon = '/assets/icons/handshake.png';
const offerIcon = '/assets/icons/offer.png';
const timeIcon = '/assets/icons/time.png';
import type { Feature } from '../types/travel';

export const features: Feature[] = [
  {
    id: 'meet-and-greet',
    title: 'Meet & Greet',
    description: 'O motorista espera no ponto combinado e ajuda com a bagagem para começar a viagem sem stress.',
    icon: handshakeIcon,
    iconWidth: 160,
    iconHeight: 160,
  },
  {
    id: 'reliable',
    title: 'Confiável',
    description: 'Acompanhamos o horário do voo para adaptar a recolha a alterações e atrasos inesperados.',
    icon: timeIcon,
    iconWidth: 160,
    iconHeight: 160,
  },
  {
    id: 'door-to-door',
    title: 'Door-to-door',
    description: 'Do aeroporto diretamente ao hotel, alojamento ou endereço indicado na reserva.',
    icon: doorIcon,
    iconWidth: 160,
    iconHeight: 160,
  },
  {
    id: 'value',
    title: 'Value',
    description: 'Serviço privado, preço transparente e uma experiência cuidada em cada deslocação.',
    icon: offerIcon,
    iconWidth: 160,
    iconHeight: 160,
  },
];
