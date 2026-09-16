<?php
namespace App\Filament\Resources\Pages;
use App\Filament\Resources\VehicleResource;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\CreateAction;
class ManageVehicles extends ManageRecords {
 protected static string $resource=VehicleResource::class;
 protected function getHeaderActions(): array { return [CreateAction::make()->mutateDataUsing(fn(array $data)=>VehicleResource::prepareImage($data))]; }
}
