<?php

namespace App\Services;

use App\Enums\BookingStatus;
use App\Http\Resources\TransferServiceResource;
use App\Http\Resources\VehicleResource;
use App\Models\Booking;
use App\Models\TransferService;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function __construct(private PricingService $pricing) {}

    public function create(User $user, array $data): Booking
    {
        return DB::transaction(function () use ($user, $data) {
            // Bloqueia o utilizador durante a criação da reserva
            User::whereKey($user->id)
                ->lockForUpdate()
                ->firstOrFail();

            // Cria uma assinatura dos dados recebidos
            $hash = hash(
                'sha256',
                json_encode($data, JSON_THROW_ON_ERROR)
            );

            // Verifica se esta reserva já foi criada
            $existing = $user->bookings()
                ->where('idempotency_key', $data['idempotency_key'])
                ->first();

            if ($existing) {
                abort_unless(
                    hash_equals($existing->request_hash, $hash),
                    409,
                    'A chave já foi usada para outra reserva.'
                );

                return $existing;
            }

            // Procura e bloqueia o veículo escolhido
            $vehicle = Vehicle::where('slug', $data['vehicle_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // Procura e bloqueia o serviço escolhido
            $service = TransferService::where('slug', $data['service_id'])
                ->lockForUpdate()
                ->firstOrFail();

            // Calcula novamente o preço no servidor
            $price = $this->pricing->calculate(
                $data,
                $vehicle,
                $service
            );

            // Confirma que o preço enviado pelo frontend continua válido
            if ((int) $data['expected_total_cents'] !== $price['total_cents']) {
                throw ValidationException::withMessages([
                    'expected_total_cents' =>
                    'O preço foi atualizado. Reveja o orçamento antes de confirmar.',
                ]);
            }

            // Cria a reserva
            return Booking::create([
                'user_id' => $user->id,
                'vehicle_id' => $vehicle->id,
                'transfer_service_id' => $service->id,

                'reference' =>
                'LUS-' .
                    now()->year .
                    '-' .
                    strtoupper(bin2hex(random_bytes(6))),

                'idempotency_key' => $data['idempotency_key'],
                'request_hash' => $hash,

                'trip_type' => $data['trip_type'],

                'origin' => $data['origin'],
                'destination' => $data['destination'],

                'pickup_at' =>
                CarbonImmutable::parse($data['pickup_at'])->utc(),

                'return_at' =>
                isset($data['return_at'])
                    ? CarbonImmutable::parse($data['return_at'])->utc()
                    : null,

                'passengers' => $data['passengers'],
                'luggage' => $data['luggage'],

                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'],
                'customer_phone' => $data['customer_phone'],

                'flight_number' => $data['flight_number'] ?? null,
                'notes' => $data['notes'] ?? null,

                'subtotal_cents' => $price['subtotal_cents'],
                'total_cents' => $price['total_cents'],

                'price_breakdown' => $price,

                'catalog_snapshot' => [
                    'vehicle' => (new VehicleResource($vehicle))->resolve(),

                    'service' => (new TransferServiceResource($service))->resolve(),
                ],

                'status' => BookingStatus::Pending,
                'payment_status' => 'pending',
                'payment_method' => $data['payment_method'],

                'terms_accepted_at' => now(),
            ]);
        }, 3);
    }

    public function cancel(Booking $booking, bool $admin = false): Booking
    {
        return DB::transaction(function () use ($booking, $admin) {
            $b = Booking::whereKey($booking->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                (!$admin && !$b->canBeCancelled()) ||
                !$b->status->canTransitionTo(BookingStatus::Cancelled)
            ) {
                throw ValidationException::withMessages([
                    'status' =>
                    'Esta reserva já não pode ser cancelada.',
                ]);
            }

            $b->update([
                'status' => BookingStatus::Cancelled,
            ]);

            return $b;
        });
    }

    public function transition(
        Booking $booking,
        BookingStatus $next
    ): Booking {
        return DB::transaction(function () use ($booking, $next) {
            $b = Booking::whereKey($booking->id)
                ->lockForUpdate()
                ->firstOrFail();

            if (!$b->status->canTransitionTo($next)) {
                throw ValidationException::withMessages([
                    'status' => 'Transição de estado inválida.',
                ]);
            }

            $b->update([
                'status' => $next,
            ]);

            return $b;
        });
    }
}
