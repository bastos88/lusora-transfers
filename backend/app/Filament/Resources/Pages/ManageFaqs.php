<?php
namespace App\Filament\Resources\Pages;
use App\Filament\Resources\FaqResource;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\CreateAction;
class ManageFaqs extends ManageRecords {
 protected static string $resource=FaqResource::class;
 protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
