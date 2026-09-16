<?php
namespace App\Filament\Resources;
use App\Models\User;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\{TextInput,Textarea,Toggle,TagsInput,FileUpload};
use Filament\Tables\Columns\{TextColumn,IconColumn};
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\{ViewAction,EditAction,DeleteAction};
class UserResource extends Resource {
 protected static ?string $model=User::class;
 protected static ?string $navigationLabel='Clientes';
 protected static ?string $slug='users';
 public static function canAccess(): bool { return auth()->user()?->role==='admin'; }
 public static function form(Schema $schema): Schema { return $schema->components([TextInput::make('name')->required()->maxLength(255),
TextInput::make('email')->email()->required()->unique(ignoreRecord:true)->maxLength(255),
TextInput::make('phone')->tel()->maxLength(40),
TextInput::make('password')->password()->minLength(8)->required(fn(string $operation)=>$operation==='create')->dehydrated(fn($state)=>filled($state))->afterStateHydrated(fn($component)=>$component->state(null))]); }
 public static function table(Table $table): Table { return $table->columns([
 TextColumn::make('name')->searchable()->sortable(),
 TextColumn::make('email')->searchable(),TextColumn::make('phone'),
 ])->filters([])->recordActions([ViewAction::make(),EditAction::make()]); }
 public static function getEloquentQuery(): \Illuminate\Database\Eloquent\Builder { return parent::getEloquentQuery()->where('role','customer'); }
 public static function getPages(): array { return ['index'=>Pages\ManageUsers::route('/')]; }
}
