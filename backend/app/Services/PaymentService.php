<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    /**
     * Registra um pagamento realizado no carro.
     */
    public function registerPayment(
        Booking $booking,
        PaymentMethod $method
    ): Payment {
        return DB::transaction(function () use ($booking, $method) {

            // Bloqueia a reserva durante a operação
            $booking = Booking::query()
                ->lockForUpdate()
                ->findOrFail($booking->id);

            // Não permite pagamento de reserva cancelada
            if ($booking->status === BookingStatus::Cancelled) {
                throw ValidationException::withMessages([
                    'payment' => 'Não é possível registrar pagamento de uma reserva cancelada.',
                ]);
            }

            // Impede pagamento duplicado
            if ($booking->payment_status === PaymentStatus::Paid) {
                throw ValidationException::withMessages([
                    'payment' => 'Esta reserva já está paga.',
                ]);
            }

            // Cria o registro financeiro
            $payment = Payment::create([
                'booking_id' => $booking->id,

                // Pagamento registrado manualmente
                'provider' => 'manual',

                // Valor oficial da reserva
                'amount_cents' => $booking->total_cents,

                'currency' => 'EUR',

                'status' => PaymentStatus::Paid,

                'payment_method' => $method,

                'paid_at' => now(),
            ]);

            // Atualiza apenas o estado financeiro da reserva
            $booking->update([
                'payment_status' => PaymentStatus::Paid,
            ]);

            return $payment->refresh();
        });
    }
}
