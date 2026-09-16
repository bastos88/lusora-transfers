<?php
namespace App\Filament\Resources;
use App\Models\TransferService;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\{TextInput,Textarea,Toggle,TagsInput,FileUpload};
use Filament\Tables\Columns\{TextColumn,IconColumn};
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\{ViewAction,EditAction,DeleteAction};
class TransferServiceResource extends Resource {
 protected static ?string $model=TransferService::class;
 protected static ?string $navigationLabel='Serviços';
 protected static ?string $slug='transfer-services';
 public static function canAccess(): bool { return auth()->user()?->role==='admin'; }
 public static function form(Schema $schema): Schema { return $schema->components([TextInput::make('name')->required()->maxLength(255),
TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord:true),
TextInput::make('short_name')->required()->maxLength(255),
Textarea::make('description')->required(),
TextInput::make('duration')->required()->maxLength(255),
TextInput::make('badge')->maxLength(255),
TextInput::make('image')->maxLength(255),
TextInput::make('base_price_cents')->label('Preço base (cêntimos)')->integer()->minValue(0)->required(),
TagsInput::make('includes')->required(),
Toggle::make('active')->default(true)]); }
 public static function table(Table $table): Table { return $table->columns([
 TextColumn::make('name')->searchable()->sortable(),
 IconColumn::make('active')->boolean(),
 ])->filters([TernaryFilter::make('active')])->recordActions([ViewAction::make(),EditAction::make()]); }
 
 public static function getPages(): array { return ['index'=>Pages\ManageTransferServices::route('/')]; }
}
