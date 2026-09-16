<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class TransferServiceFactory extends Factory {
 public function definition(): array {return ['slug'=>fake()->unique()->slug(),'name'=>'Essencial','short_name'=>'Essencial','description'=>'Private transfer','duration'=>'Trajeto direto','includes'=>['Recolha'],'base_price_cents'=>3200,'active'=>true];}
}
