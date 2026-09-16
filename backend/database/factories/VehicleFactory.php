<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class VehicleFactory extends Factory {
 public function definition(): array {return ['slug'=>fake()->unique()->slug(),'name'=>'Standard','description'=>'Private transfer','passenger_capacity'=>3,'luggage_capacity'=>2,'base_price_cents'=>0,'active'=>true,'available'=>true];}
}
