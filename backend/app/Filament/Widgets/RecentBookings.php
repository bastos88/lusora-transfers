<?php
namespace App\Filament\Widgets;
use App\Models\Booking;
use Filament\Widgets\TableWidget;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
class RecentBookings extends TableWidget {
 protected int|string|array $columnSpan='full';
 public function table(Table $table): Table { return $table->heading('Reservas recentes')->query(Booking::query()->latest()->limit(10))->paginated(false)->columns([
    TextColumn::make('reference'),TextColumn::make('customer_name'),TextColumn::make('pickup_at')->dateTime('d/m/Y H:i','Europe/Lisbon'),
    TextColumn::make('status')->badge(),TextColumn::make('total_cents')->money('EUR',divideBy:100),
 ]); }
}
