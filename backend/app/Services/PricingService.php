<?php
namespace App\Services;
use App\Models\{Vehicle,TransferService};
use Illuminate\Validation\ValidationException;
/** Monetary values are integer cents. Future routing/surcharge/discount rules belong here. */
class PricingService {
    public function calculate(array $data,?Vehicle $vehicle=null,?TransferService $service=null): array {
        $vehicle ??= Vehicle::where('slug',$data['vehicle_id'])->firstOrFail();
        $service ??= TransferService::where('slug',$data['service_id'])->firstOrFail();
        if(!$vehicle->active || !$vehicle->available || !$service->active) throw ValidationException::withMessages(['vehicle_id'=>'Serviço ou veículo indisponível.']);
        if($data['passengers']>$vehicle->passenger_capacity || $data['luggage']>$vehicle->luggage_capacity) throw ValidationException::withMessages(['passengers'=>'A capacidade do veículo não permite estes passageiros ou bagagem.']);
        $journeys=$data['trip_type']==='round-trip'?2:1;
        $perJourney=$service->base_price_cents+$vehicle->base_price_cents;
        return ['currency'=>'EUR','journeys'=>$journeys,'service_price_cents'=>$service->base_price_cents,
            'vehicle_supplement_cents'=>$vehicle->base_price_cents,'price_per_journey_cents'=>$perJourney,
            'subtotal_cents'=>$perJourney*$journeys,'total_cents'=>$perJourney*$journeys,'rule_version'=>'flat-v1'];
    }
}
