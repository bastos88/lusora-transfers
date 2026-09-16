<?php
namespace App\Filament\Resources\Pages;
use App\Filament\Resources\UserResource;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\CreateAction;
class ManageUsers extends ManageRecords {
 protected static string $resource=UserResource::class;
 protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
