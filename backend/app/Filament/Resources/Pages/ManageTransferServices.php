<?php
namespace App\Filament\Resources\Pages;
use App\Filament\Resources\TransferServiceResource;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\CreateAction;
class ManageTransferServices extends ManageRecords {
 protected static string $resource=TransferServiceResource::class;
 protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
