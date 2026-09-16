<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class VehicleResource extends JsonResource {
    public function toArray(Request $request): array { return [
        'id'=>$this->slug,'name'=>$this->name,'description'=>$this->description,
        'capacity'=>$this->passenger_capacity,'luggageCapacity'=>$this->luggage_capacity,
        'passengers'=>"1–{$this->passenger_capacity} passageiros",'luggage'=>"{$this->luggage_capacity} malas",
        'supplement'=>$this->base_price_cents/100,'image'=>$this->image,
        'imageWidth'=>$this->image_width,'imageHeight'=>$this->image_height,
    ]; }
}
