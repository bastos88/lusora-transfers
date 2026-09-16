<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('users', function(Blueprint $t) { $t->string('phone',40)->nullable(); $t->string('role')->default('customer')->index(); });
        Schema::create('vehicles', function(Blueprint $t) {
            $t->id(); $t->string('slug')->unique(); $t->string('name'); $t->text('description');
            $t->unsignedTinyInteger('passenger_capacity'); $t->unsignedTinyInteger('luggage_capacity');
            $t->string('image')->nullable(); $t->unsignedInteger('base_price_cents')->default(0);
            $t->unsignedInteger('image_width')->default(510); $t->unsignedInteger('image_height')->default(240);
            $t->boolean('active')->default(true); $t->boolean('available')->default(true); $t->timestamps();
        });
        Schema::create('transfer_services', function(Blueprint $t) {
            $t->id(); $t->string('slug')->unique(); $t->string('name'); $t->string('short_name');
            $t->text('description'); $t->string('image')->nullable(); $t->string('badge')->nullable();
            $t->string('duration'); $t->json('includes'); $t->unsignedInteger('base_price_cents');
            $t->boolean('active')->default(true); $t->timestamps();
        });
        Schema::create('bookings', function(Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->constrained()->restrictOnDelete();
            $t->foreignId('vehicle_id')->constrained()->restrictOnDelete();
            $t->foreignId('transfer_service_id')->constrained()->restrictOnDelete();
            $t->string('reference',40)->unique(); $t->uuid('idempotency_key'); $t->string('request_hash',64);
            $t->unique(['user_id','idempotency_key']); $t->string('trip_type');
            $t->json('origin'); $t->json('destination'); $t->dateTime('pickup_at')->index(); $t->dateTime('return_at')->nullable();
            $t->unsignedTinyInteger('passengers'); $t->unsignedTinyInteger('luggage')->default(0);
            $t->string('customer_name'); $t->string('customer_email'); $t->string('customer_phone',40);
            $t->string('flight_number',40)->nullable(); $t->text('notes')->nullable();
            $t->decimal('distance_km',10,2)->nullable(); $t->unsignedInteger('duration_minutes')->nullable();
            $t->unsignedInteger('subtotal_cents'); $t->unsignedInteger('total_cents'); $t->char('currency',3)->default('EUR');
            $t->json('price_breakdown'); $t->json('catalog_snapshot');
            $t->string('status')->default('pending')->index(); $t->string('payment_status')->default('pending')->index();
            $t->string('payment_method'); $t->dateTime('terms_accepted_at'); $t->timestamps();
        });
        Schema::create('testimonials', function(Blueprint $t) {
            $t->id(); $t->string('slug')->unique(); $t->string('name'); $t->string('country')->nullable();
            $t->string('source')->default('Testemunho demonstrativo'); $t->text('content');
            $t->unsignedTinyInteger('rating')->default(5); $t->string('avatar')->nullable();
            $t->string('avatar_background')->default('#e0e7ff'); $t->boolean('active')->default(true); $t->timestamps();
        });
        Schema::create('faqs', function(Blueprint $t) {
            $t->id(); $t->string('slug')->unique(); $t->string('question'); $t->text('answer');
            $t->unsignedInteger('sort_order')->default(0); $t->boolean('active')->default(true); $t->timestamps();
        });
    }
    public function down(): void {
        foreach(['faqs','testimonials','bookings','transfer_services','vehicles'] as $table) Schema::dropIfExists($table);
        Schema::table('users', fn(Blueprint $t) => $t->dropColumn(['phone','role']));
    }
};
