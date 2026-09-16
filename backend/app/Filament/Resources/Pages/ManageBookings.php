<?php
namespace App\Filament\Resources\Pages;
use App\Filament\Resources\BookingResource;
use App\Models\{User,Vehicle,TransferService};
use App\Services\{BookingService,PricingService};
use App\Http\Requests\StoreBookingRequest;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\CreateAction;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\CarbonImmutable;
class ManageBookings extends ManageRecords {
 protected static string $resource=BookingResource::class;
 protected function getHeaderActions(): array { return [CreateAction::make()->using(function(array $data) {
    $user=User::findOrFail($data['user_id']);
    $data['vehicle_id']=Vehicle::findOrFail($data['vehicle_id'])->slug;
    $data['service_id']=TransferService::findOrFail($data['transfer_service_id'])->slug;
    $data['pickup_at']=CarbonImmutable::parse($data['pickup_at'],'UTC')->toIso8601String();
    if($data['trip_type']==='round-trip') $data['return_at']=CarbonImmutable::parse($data['return_at'],'UTC')->toIso8601String();
    foreach(['origin','destination'] as $key) $data[$key]=array_merge($data[$key],['id'=>(string)Str::uuid(),'name'=>mb_substr($data[$key]['label'],0,255)]);
    $data['idempotency_key']=(string)Str::uuid();
    $data['expected_total_cents']=app(PricingService::class)->calculate($data)['total_cents'];
    $request=new StoreBookingRequest();$request->merge($data);
    $validator=Validator::make($data,$request->rules());
    foreach($request->after() as $callback) $validator->after($callback);
    return app(BookingService::class)->create($user,$validator->validate());
 })]; }
}
