import type { FaqItem } from '../types/travel';

export const faqs: FaqItem[] = [
  {
    id: 'flight-delay',
    question: 'O que acontece se o voo atrasar?',
    answer: 'O horário do voo pode ser acompanhado para ajustar a recolha. Confirme os detalhes e as condições aplicáveis antes de concluir a reserva.',
  },
  {
    id: 'meeting-point',
    question: 'Onde encontro o motorista no aeroporto?',
    answer: 'O ponto de encontro e as instruções de identificação são enviados na confirmação da reserva.',
  },
  {
    id: 'child-seat',
    question: 'É possível pedir cadeira para criança?',
    answer: 'Indique essa necessidade ao solicitar o transfer para que a disponibilidade seja confirmada antes da viagem.',
  },
  {
    id: 'cancellation',
    question: 'Posso cancelar ou alterar a reserva?',
    answer: 'Consulte as condições apresentadas no momento da reserva antes de confirmar o serviço.',
  },
];
