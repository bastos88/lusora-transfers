<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            // Reserva relacionada ao pagamento
            $table->foreignId('booking_id')
                ->constrained()
                ->cascadeOnDelete();

            // Ex: stripe
            $table->string('provider')
                ->nullable();

            // ID fornecido pelo Stripe/outro gateway
            $table->string('provider_payment_id')
                ->nullable()
                ->unique();

            // Valor em cêntimos
            // Ex: 4500 = €45,00
            $table->unsignedInteger('amount_cents');

            // Moeda
            $table->string('currency', 3)
                ->default('EUR');

            // pending, paid, failed, refunded
            $table->string('status')
                ->default('pending');

            // card, cash, bank_transfer...
            $table->string('payment_method')
                ->nullable();

            // Quando foi pago
            $table->timestamp('paid_at')
                ->nullable();

            // Quando foi reembolsado
            $table->timestamp('refunded_at')
                ->nullable();

            // Informações extras do gateway
            $table->json('metadata')
                ->nullable();

            $table->timestamps();
        });
    }

    /**
     * Desfaz a migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
