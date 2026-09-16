<?php
namespace App\Filament\Resources\Pages;
use App\Filament\Resources\TestimonialResource;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\CreateAction;
class ManageTestimonials extends ManageRecords {
 protected static string $resource=TestimonialResource::class;
 protected function getHeaderActions(): array { return [CreateAction::make()]; }
}
