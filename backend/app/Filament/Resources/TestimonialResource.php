<?php
namespace App\Filament\Resources;
use App\Models\Testimonial;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\{TextInput,Textarea,Toggle,TagsInput,FileUpload};
use Filament\Tables\Columns\{TextColumn,IconColumn};
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\{ViewAction,EditAction,DeleteAction};
class TestimonialResource extends Resource {
 protected static ?string $model=Testimonial::class;
 protected static ?string $navigationLabel='Testemunhos';
 protected static ?string $slug='testimonials';
 public static function canAccess(): bool { return auth()->user()?->role==='admin'; }
 public static function form(Schema $schema): Schema { return $schema->components([TextInput::make('name')->required()->maxLength(255),
TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord:true),
TextInput::make('country')->maxLength(255),
TextInput::make('source')->required()->default('Testemunho demonstrativo')->maxLength(255),
Textarea::make('content')->required(),
TextInput::make('rating')->integer()->minValue(1)->maxValue(5)->default(5)->required(),
TextInput::make('avatar')->maxLength(255),
TextInput::make('avatar_background')->default('#e0e7ff')->maxLength(255),
Toggle::make('active')->default(true)]); }
 public static function table(Table $table): Table { return $table->columns([
 TextColumn::make('name')->searchable()->sortable(),
 IconColumn::make('active')->boolean(),
 ])->filters([TernaryFilter::make('active')])->recordActions([ViewAction::make(),EditAction::make(),DeleteAction::make()]); }
 
 public static function getPages(): array { return ['index'=>Pages\ManageTestimonials::route('/')]; }
}
