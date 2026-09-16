<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class FaqFactory extends Factory {public function definition(): array {return ['slug'=>fake()->unique()->slug(),'question'=>fake()->sentence(),'answer'=>fake()->paragraph(),'sort_order'=>0,'active'=>true];}}
