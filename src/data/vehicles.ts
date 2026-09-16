const executiveImage = '/assets/vehicles/executive.webp';
const minivanExecutiveImage = '/assets/vehicles/minivan-executive.webp';
const minivanImage = '/assets/vehicles/minivan.webp';
const standardImage = '/assets/vehicles/standard.webp';
import type { Vehicle } from '../types/travel';

export const vehicles: Vehicle[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Conforto e economia para deslocações individuais ou em casal.',
    passengers: '1–3 passageiros',
    luggage: '2 malas',
    capacity: 3,
    luggageCapacity: 2,
    supplement: 0,
    image: standardImage,
    imageWidth: 510,
    imageHeight: 240,
  },
  {
    id: 'executive',
    name: 'Executivo',
    description: 'Mais espaço, acabamento premium e uma viagem ainda mais confortável.',
    passengers: '1–3 passageiros',
    luggage: '3 malas',
    capacity: 3,
    luggageCapacity: 3,
    supplement: 18,
    image: executiveImage,
    imageWidth: 512,
    imageHeight: 230,
  },
  {
    id: 'minivan',
    name: 'Minivan',
    description: 'A opção ideal para famílias e pequenos grupos com mais bagagem.',
    passengers: '4–7 passageiros',
    luggage: '6 malas',
    capacity: 7,
    luggageCapacity: 6,
    supplement: 32,
    image: minivanImage,
    imageWidth: 992,
    imageHeight: 558,
  },
  {
    id: 'minivan-executive',
    name: 'Minivan Executivo',
    description: 'Espaço para grupos com um nível superior de conforto e apresentação.',
    passengers: '4–8 passageiros',
    luggage: '7 malas',
    capacity: 8,
    luggageCapacity: 7,
    supplement: 55,
    image: minivanExecutiveImage,
    imageWidth: 533,
    imageHeight: 374,
  },
];
