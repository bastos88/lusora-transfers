<?php
namespace App\Filament\Widgets;
use App\Models\{Booking,User};
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
class BusinessStats extends StatsOverviewWidget {
 protected function getStats(): array {
    $today=now('Europe/Lisbon');
    return [
      Stat::make('Reservas hoje',Booking::whereBetween('pickup_at',[$today->copy()->startOfDay()->utc(),$today->copy()->endOfDay()->utc()])->count()),
      Stat::make('Pendentes',Booking::where('status','pending')->count()),
      Stat::make('Confirmadas',Booking::where('status','confirmed')->count()),
      Stat::make('Recebido (EUR)',number_format(Booking::where('payment_status','paid')->sum('total_cents')/100,2,',','.')),
      Stat::make('Clientes',User::where('role','customer')->count()),
    ];
 }
}
