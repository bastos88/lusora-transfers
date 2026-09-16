<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class TransferServiceResource extends JsonResource {
    public function toArray(Request $request): array { return [
        'id'=>$this->slug,'name'=>$this->name,'shortName'=>$this->short_name,'description'=>$this->description,
        'badge'=>$this->badge,'duration'=>$this->duration,'basePrice'=>$this->base_price_cents/100,'includes'=>$this->includes,
    ]; }
}
