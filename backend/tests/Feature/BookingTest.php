<?php
namespace Tests\Feature;
use App\Models\{Booking,User,Vehicle};
use App\Enums\BookingStatus;
use App\Services\BookingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;
class BookingTest extends TestCase {
 use RefreshDatabase;
 protected function setUp(): void { parent::setUp();$this->seed(); }
 private function payload(array $overrides=[]): array {
  return array_replace([
   'vehicle_id'=>'executive','service_id'=>'meet-and-greet','trip_type'=>'round-trip',
   'origin'=>['id'=>'opo','name'=>'Aeroporto','label'=>'Aeroporto do Porto','latitude'=>41.24,'longitude'=>-8.67],
   'destination'=>['id'=>'porto','name'=>'Porto','label'=>'Porto Centro','latitude'=>41.15,'longitude'=>-8.61],
   'pickup_at'=>now()->addDays(5)->toIso8601String(),'return_at'=>now()->addDays(8)->toIso8601String(),
   'passengers'=>2,'luggage'=>2,'customer_name'=>'Ana Silva','customer_email'=>'ana@example.test','customer_phone'=>'912345678',
   'payment_method'=>'cash','accept_terms'=>true,'idempotency_key'=>(string)Str::uuid(),'expected_total_cents'=>12600,
  ],$overrides);
 }
 public function test_booking_is_persisted_with_server_price_and_idempotent_reference(): void {
  $this->actingAs(User::factory()->create());
  $data=$this->payload(['total'=>1,'user_id'=>999,'status'=>'completed','payment_status'=>'paid']);
  $first=$this->postJson('/api/bookings',$data)->assertCreated()->assertJsonPath('data.total',126)->assertJsonPath('data.status','pending')->assertJsonPath('data.paymentStatus','pending');
  $this->assertMatchesRegularExpression('/^LUS-\d{4}-[A-F0-9]{12}$/',$first->json('data.reference'));
  $this->postJson('/api/bookings',$data)->assertOk()->assertJsonPath('data.id',$first->json('data.id'));
  $this->assertDatabaseCount('bookings',1);
  $this->postJson('/api/bookings',array_replace($data,['customer_name'=>'Different Person']))->assertStatus(409);
 }
 public function test_price_changes_require_explicit_review(): void {
  $this->actingAs(User::factory()->create());
  $this->postJson('/api/bookings',$this->payload(['expected_total_cents'=>1]))->assertUnprocessable()->assertJsonValidationErrors('expected_total_cents');
  $this->assertDatabaseCount('bookings',0);
 }
 public function test_capacity_dates_and_inactive_catalog_are_enforced(): void {
  $this->actingAs(User::factory()->create());
  $this->postJson('/api/bookings',$this->payload(['passengers'=>8]))->assertUnprocessable();
  $this->postJson('/api/bookings',$this->payload(['luggage'=>8]))->assertUnprocessable();
  $this->postJson('/api/bookings',$this->payload(['pickup_at'=>now()->subDay()->toIso8601String()]))->assertUnprocessable();
  $this->postJson('/api/bookings',$this->payload(['return_at'=>now()->addDay()->toIso8601String()]))->assertUnprocessable();
  Vehicle::where('slug','executive')->update(['available'=>false]);
  $this->postJson('/api/bookings',$this->payload())->assertUnprocessable();
 }
 public function test_customer_cannot_read_or_cancel_another_customers_booking(): void {
  $owner=User::factory()->create();$other=User::factory()->create();
  $this->actingAs($owner);
  $id=$this->postJson('/api/bookings',$this->payload())->assertCreated()->json('data.id');
  $this->actingAs($other);
  $this->getJson("/api/bookings/$id")->assertForbidden();
  $this->postJson("/api/bookings/$id/cancel")->assertForbidden();
  $this->getJson('/api/bookings')->assertJsonCount(0,'data');
 }
 public function test_cancellation_respects_cutoff_and_terminal_states(): void {
  $this->actingAs(User::factory()->create());
  $id=$this->postJson('/api/bookings',$this->payload())->json('data.id');
  $this->postJson("/api/bookings/$id/cancel")->assertOk()->assertJsonPath('data.status','cancelled');
  $this->postJson("/api/bookings/$id/cancel")->assertForbidden();
  $id=$this->postJson('/api/bookings',$this->payload(['pickup_at'=>now()->addHours(23)->toIso8601String()]))->json('data.id');
  $this->postJson("/api/bookings/$id/cancel")->assertForbidden();
 }
 public function test_snapshot_survives_catalog_changes_and_one_way_ignores_return(): void {
  $this->actingAs(User::factory()->create());
  $id=$this->postJson('/api/bookings',$this->payload(['trip_type'=>'one-way','expected_total_cents'=>6300]))->assertCreated()->json('data.id');
  Vehicle::where('slug','executive')->update(['name'=>'Changed','base_price_cents'=>99999]);
  $this->getJson("/api/bookings/$id")->assertOk()->assertJsonPath('data.vehicle.name','Executivo')->assertJsonPath('data.total',63)->assertJsonPath('data.booking.returnDate','');
 }
 public function test_invalid_admin_transition_is_rejected(): void {
  $user=User::factory()->create();
  $booking=app(BookingService::class)->create($user,$this->payload());
  $this->expectException(\Illuminate\Validation\ValidationException::class);
  app(BookingService::class)->transition($booking,BookingStatus::Completed);
 }
 public function test_admin_can_advance_booking_status(): void {
  $user=User::factory()->create();
  $booking=app(BookingService::class)->create($user,$this->payload());
  app(BookingService::class)->transition($booking,BookingStatus::Confirmed);
  $this->assertSame(BookingStatus::Confirmed,$booking->fresh()->status);
 }
 public function test_guests_cannot_create_or_list_bookings(): void {
  $this->postJson('/api/bookings',$this->payload())->assertUnauthorized();
  $this->getJson('/api/bookings')->assertUnauthorized();
 }
 public function test_quotes_and_public_catalog(): void {
  $this->getJson('/api/vehicles')->assertOk()->assertJsonCount(4,'data');
  $this->postJson('/api/quotes',$this->payload())->assertOk()->assertJsonPath('data.total_cents',12600);
  $this->postJson('/api/quotes',$this->payload(['trip_type'=>'one-way']))->assertOk()->assertJsonPath('data.total_cents',6300);
 }
}
