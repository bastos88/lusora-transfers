import type { TransferService } from '../types/travel';

export const transferServices: TransferService[] = [
  {
    id: 'essential',
    name: 'Transfer Essencial',
    shortName: 'Essencial',
    description: 'Uma viagem privada, direta e confortável até ao destino selecionado.',
    duration: 'Trajeto direto',
    basePrice: 32,
    includes: [
      'Recolha no ponto combinado',
      'Acompanhamento do trajeto',
      'Cancelamento gratuito até 24h antes',
    ],
  },
  {
    id: 'meet-and-greet',
    name: 'Meet & Greet',
    shortName: 'Meet & Greet',
    description: 'O motorista acompanha a chegada do voo e espera por si no terminal.',
    badge: 'Mais escolhido',
    duration: '60 min de espera',
    basePrice: 45,
    includes: [
      'Motorista com placa identificativa',
      'Acompanhamento do voo',
      'Ajuda com a bagagem',
      '60 minutos de espera incluídos',
    ],
  },
  {
    id: 'premium',
    name: 'Transfer Premium',
    shortName: 'Premium',
    description: 'Uma experiência superior com prioridade, conforto adicional e mais flexibilidade.',
    duration: '90 min de espera',
    basePrice: 62,
    includes: [
      'Atendimento prioritário',
      'Água e Wi-Fi durante a viagem',
      'Ajuda com a bagagem',
      '90 minutos de espera incluídos',
    ],
  },
];
