<?php
namespace App\Filament\Resources;
use App\Models\Faq;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\{TextInput,Textarea,Toggle,TagsInput,FileUpload};
use Filament\Tables\Columns\{TextColumn,IconColumn};
use Filament\Tables\Filters\TernaryFilter;
use Filament\Actions\{ViewAction,EditAction,DeleteAction};
class FaqResource extends Resource {
 protected static ?string $model=Faq::class;
 protected static ?string $navigationLabel='Perguntas frequentes';
 protected static ?string $slug='faqs';
 public static function canAccess(): bool { return auth()->user()?->role==='admin'; }
 public static function form(Schema $schema): Schema { return $schema->components([TextInput::make('question')->required()->maxLength(255),
TextInput::make('slug')->required()->alphaDash()->unique(ignoreRecord:true),
Textarea::make('answer')->required(),
TextInput::make('sort_order')->integer()->minValue(0)->default(0)->required(),
Toggle::make('active')->default(true)]); }
 public static function table(Table $table): Table { return $table->columns([
 TextColumn::make('question')->searchable()->sortable(),
 IconColumn::make('active')->boolean(),
 ])->filters([TernaryFilter::make('active')])->recordActions([ViewAction::make(),EditAction::make(),DeleteAction::make()]); }
 
 public static function getPages(): array { return ['index'=>Pages\ManageFaqs::route('/')]; }
}
