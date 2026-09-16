<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class BookingResource extends JsonResource {
    public function toArray(Request $request): array {
        $pickup=$this->pickup_at->setTimezone('Europe/Lisbon'); $return=$this->return_at?->setTimezone('Europe/Lisbon');
        return [
            'id'=>$this->id,'reference'=>$this->reference,'status'=>$this->status->value,'statusLabel'=>$this->status->getLabel(),
            'paymentStatus'=>$this->payment_status->value,'paymentStatusLabel'=>$this->payment_status->getLabel(),
            'canCancel'=>$this->canBeCancelled(),'total'=>$this->total_cents/100,'totalCents'=>$this->total_cents,
            'createdAt'=>$this->created_at->toIso8601String(),'serviceId'=>$this->catalog_snapshot['service']['id'],
            'vehicleId'=>$this->catalog_snapshot['vehicle']['id'],'service'=>$this->catalog_snapshot['service'],'vehicle'=>$this->catalog_snapshot['vehicle'],
            'booking'=>['tripType'=>$this->trip_type,'origin'=>$this->origin,'destination'=>$this->destination,
                'departureDate'=>$pickup->format('Y-m-d'),'departureTime'=>$pickup->format('H:i'),
                'returnDate'=>$return?->format('Y-m-d')??'','returnTime'=>$return?->format('H:i')??'',
                'passengers'=>$this->passengers,'luggage'=>$this->luggage],
            'customer'=>['fullName'=>$this->customer_name,'email'=>$this->customer_email,'phone'=>$this->customer_phone,
                'flightNumber'=>$this->flight_number??'','notes'=>$this->notes??'','paymentMethod'=>$this->payment_method,'acceptTerms'=>true],
        ];
    }
}
