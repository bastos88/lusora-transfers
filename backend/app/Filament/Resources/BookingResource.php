<?php

namespace App\Filament\Resources;

use App\Models\{Booking, User, Vehicle, TransferService};
use App\Enums\{BookingStatus, PaymentStatus, PaymentMethod};
use App\Services\{BookingService, PricingService};
use App\Services\PaymentService;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\Forms\Components\{TextInput, Textarea, Select, DateTimePicker, DatePicker, Toggle};
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\{SelectFilter, Filter};
use Filament\Actions\{Action, ViewAction, EditAction};
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class BookingResource extends Resource
{
  protected static ?string $model = Booking::class;
  protected static ?string $navigationLabel = 'Reservas';
  public static function canAccess(): bool
  {
    return Auth::user()?->role === 'admin';
  }
  public static function form(Schema $schema): Schema
  {
    $fields = [
      Select::make('user_id')->relationship('user', 'email')->searchable()->preload()->required()->disabledOn('edit'),
      Select::make('vehicle_id')->options(Vehicle::where('active', true)->where('available', true)->pluck('name', 'id'))->required()->disabledOn('edit'),
      Select::make('transfer_service_id')->options(TransferService::where('active', true)->pluck('name', 'id'))->required()->disabledOn('edit'),
      Select::make('trip_type')->options(['one-way' => 'Ida', 'round-trip' => 'Ida e volta'])->default('one-way')->required()->live()->disabledOn('edit'),
      DateTimePicker::make('pickup_at')->timezone('Europe/Lisbon')->required()->disabledOn('edit'),
      DateTimePicker::make('return_at')->timezone('Europe/Lisbon')->required(fn($get) => $get('trip_type') === 'round-trip')->disabledOn('edit'),
      TextInput::make('passengers')->integer()->minValue(1)->maxValue(8)->required()->disabledOn('edit'),
      TextInput::make('luggage')->integer()->minValue(0)->maxValue(20)->default(0)->required()->disabledOn('edit'),
    ];
    foreach (['origin' => 'Origem', 'destination' => 'Destino'] as $key => $label) {
      $fields[] = TextInput::make("$key.label")->label($label)->maxLength(500)->required()->disabledOn('edit');
      $fields[] = TextInput::make("$key.latitude")->label("$label latitude")->numeric()->minValue(-90)->maxValue(90)->required()->disabledOn('edit');
      $fields[] = TextInput::make("$key.longitude")->label("$label longitude")->numeric()->minValue(-180)->maxValue(180)->required()->disabledOn('edit');
    }
    return $schema->components([
      ...$fields,
      TextInput::make('customer_name')->required()->minLength(2)->maxLength(255),
      TextInput::make('customer_email')->email()->required()->maxLength(255),
      TextInput::make('customer_phone')->required()->minLength(8)->maxLength(40),
      TextInput::make('flight_number')->maxLength(40),
      Textarea::make('notes')->maxLength(3000),
      Select::make('payment_method')->options(['cash' => 'Dinheiro à chegada', 'card-on-arrival' => 'Cartão à chegada'])->default('cash')->required()->disabledOn('edit'),
      Toggle::make('accept_terms')->label('Cliente aceitou as condições')->accepted()->visibleOn('create'),
      TextInput::make('reference')->disabled()->visibleOn('edit'),
      TextInput::make('total_cents')->label('Total (cêntimos)')->disabled()->visibleOn('edit'),
      Select::make('status')->options(BookingStatus::class)->disabled()->visibleOn('edit'),
      Select::make('payment_status')->options(PaymentStatus::class)->disabled()->visibleOn('edit'),
    ]);
  }
  public static function table(Table $table): Table
  {
    return $table->defaultSort('created_at', 'desc')->columns([
      TextColumn::make('reference')->searchable(),
      TextColumn::make('customer_name')->searchable(),
      TextColumn::make('pickup_at')->dateTime('d/m/Y H:i', 'Europe/Lisbon')->sortable(),
      TextColumn::make('vehicle.name'),
      TextColumn::make('total_cents')->money('EUR', divideBy: 100),
      TextColumn::make('status')->badge(),
      TextColumn::make('payment_status')->badge(),
    ])->filters([
      SelectFilter::make('status')->options(BookingStatus::class),
      SelectFilter::make('payment_status')->options(PaymentStatus::class),
      SelectFilter::make('vehicle_id')->relationship('vehicle', 'name'),
      SelectFilter::make('user_id')->relationship('user', 'email')->searchable(),
      Filter::make('pickup')->schema([DatePicker::make('from'), DatePicker::make('until')])->query(fn(Builder $q, array $data) => $q
        ->when($data['from'] ?? null, fn($q, $d) => $q->where('pickup_at', '>=', \Carbon\CarbonImmutable::parse($d, 'Europe/Lisbon')->startOfDay()->utc()))
        ->when($data['until'] ?? null, fn($q, $d) => $q->where('pickup_at', '<=', \Carbon\CarbonImmutable::parse($d, 'Europe/Lisbon')->endOfDay()->utc()))),
    ])->recordActions([
      ViewAction::make(),

      EditAction::make(),

      // Alterar o estado da viagem
      Action::make('estado')
        ->label('Alterar estado')
        ->icon('heroicon-o-arrow-path')
        ->visible(fn(Booking $record) => $record->status->allowedTransitions() !== [])
        ->schema([
          Select::make('status')
            ->label('Novo estado')
            ->options(fn(Booking $record): array => collect($record->status->allowedTransitions())
              ->mapWithKeys(fn(BookingStatus $status): array => [$status->value => $status->getLabel()])
              ->all())
            ->required(),
        ])
        ->action(
          fn(Booking $record, array $data) =>
          app(BookingService::class)->transition(
            $record,
            BookingStatus::from($data['status'])
          )
        ),

      // Cancelar reserva
      Action::make('cancelar')
        ->label('Cancelar reserva')
        ->icon('heroicon-o-x-circle')
        ->color('danger')
        ->requiresConfirmation()
        ->visible(
          fn(Booking $record) =>
          in_array(
            $record->status,
            [
              BookingStatus::Pending,
              BookingStatus::Confirmed,
            ],
            true
          )
        )
        ->action(
          fn(Booking $record) =>
          app(BookingService::class)->cancel(
            $record,
            true
          )
        ),

      // Alterar pagamento manualmente
      Action::make('registrarPagamento')
        ->label('Registrar pagamento')
        ->icon('heroicon-o-banknotes')
        ->color('success')

        ->visible(
          fn(Booking $record) =>
          $record->payment_status === PaymentStatus::Pending
            && $record->status !== BookingStatus::Cancelled
        )

        ->schema([
          Select::make('payment_method')
            ->label('Método de pagamento')
            ->options([
              PaymentMethod::Cash->value =>
              PaymentMethod::Cash->label(),

              PaymentMethod::Card->value =>
              PaymentMethod::Card->label(),

              PaymentMethod::MbWay->value =>
              PaymentMethod::MbWay->label(),

              PaymentMethod::BankTransfer->value =>
              PaymentMethod::BankTransfer->label(),
            ])
            ->required(),
        ])

        ->requiresConfirmation()

        ->action(
          fn(Booking $record, array $data) =>
          app(PaymentService::class)->registerPayment(
            $record,
            PaymentMethod::from($data['payment_method'])
          )
        ),
    ]);
  }
  public static function getPages(): array
  {
    return ['index' => Pages\ManageBookings::route('/')];
  }
}
