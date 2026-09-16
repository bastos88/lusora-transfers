<?php
namespace App\Filament\Resources;
use App\Models\Vehicle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\{TextInput,Textarea,Toggle,TagsInput,FileUpload};
use Filament\Tables\Columns\{TextColumn,IconColumn};
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\{ViewAction,EditAction,DeleteAction};
class VehicleResource extends Resource {
 protected static ?string $model=Vehicle::class;
 protected static ?string $navigationLabel='Viaturas';
 protected static ?string $slug='vehicles';
 public static function canAccess(): bool { return auth()->user()?->role==='admin'; }
 public static function form(Schema $schema): Schema { return $schema->components([TextInput::make('name')->required()->maxLength(255),
TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord:true),
Textarea::make('description')->required(),
TextInput::make('passenger_capacity')->integer()->minValue(1)->maxValue(8)->required(),
TextInput::make('luggage_capacity')->integer()->minValue(0)->maxValue(20)->required(),
TextInput::make('base_price_cents')->label('Suplemento (cêntimos)')->integer()->minValue(0)->required(),
TextInput::make('image')->label('Imagem (URL ou /storage/...)')->maxLength(255),
FileUpload::make('uploaded_image')->label('Carregar imagem')->image()->disk('public')->directory('vehicles'),
Toggle::make('active')->default(true),
Toggle::make('available')->label('Disponível')->default(true)]); }
 public static function table(Table $table): Table { return $table->columns([
 TextColumn::make('name')->searchable()->sortable(),
 IconColumn::make('active')->boolean(),
 ])->filters([TernaryFilter::make('active')])->recordActions([ViewAction::make(),EditAction::make()->mutateDataUsing(fn(array $data)=>static::prepareImage($data))]); }
 
 public static function prepareImage(array $data): array { if(!empty($data['uploaded_image'])) $data['image']='/storage/'.$data['uploaded_image']; unset($data['uploaded_image']); return $data; }
 public static function getPages(): array { return ['index'=>Pages\ManageVehicles::route('/')]; }
}
