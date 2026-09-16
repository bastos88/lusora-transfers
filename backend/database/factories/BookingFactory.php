<?php
namespace Database\Factories;
use App\Models\{User,Vehicle,TransferService};
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
class BookingFactory extends Factory {
 public function definition(): array {
  $location=['id'=>'opo','name'=>'Aeroporto','label'=>'Aeroporto do Porto','latitude'=>41.24,'longitude'=>-8.67];
  return ['user_id'=>User::factory(),'vehicle_id'=>Vehicle::factory(),'transfer_service_id'=>TransferService::factory(),
   'reference'=>'LUS-'.now()->year.'-'.strtoupper(bin2hex(random_bytes(6))),'idempotency_key'=>(string)Str::uuid(),'request_hash'=>hash('sha256','fixture'),
   'trip_type'=>'one-way','origin'=>$location,'destination'=>array_replace($location,['id'=>'porto','label'=>'Porto','latitude'=>41.15]),
   'pickup_at'=>now()->addDays(5),'passengers'=>2,'luggage'=>1,'customer_name'=>fake()->name(),'customer_email'=>fake()->safeEmail(),'customer_phone'=>'912345678',
   'subtotal_cents'=>3200,'total_cents'=>3200,'price_breakdown'=>['total_cents'=>3200],
   'catalog_snapshot'=>['vehicle'=>['id'=>'standard','name'=>'Standard'],'service'=>['id'=>'essential','name'=>'Essencial']],
   'status'=>'pending','payment_status'=>'pending','payment_method'=>'cash','terms_accepted_at'=>now()];
 }
}
