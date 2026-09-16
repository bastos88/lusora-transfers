<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class TestimonialFactory extends Factory {public function definition(): array {return ['slug'=>fake()->unique()->slug(),'name'=>fake()->name(),'content'=>fake()->paragraph(),'rating'=>5,'active'=>true];}}
