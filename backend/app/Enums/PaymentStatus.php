<?php
namespace App\Enums;
use Filament\Support\Contracts\{HasColor,HasLabel};
enum PaymentStatus: string implements HasColor,HasLabel {
    case Pending='pending'; case Paid='paid'; case Failed='failed'; case Refunded='refunded';
    public function getLabel(): string { return match($this) { self::Pending=>'Pendente',self::Paid=>'Pago',self::Failed=>'Falhou',self::Refunded=>'Reembolsado' }; }
    public function getColor(): string { return match($this) { self::Pending=>'warning',self::Paid=>'success',self::Failed=>'danger',self::Refunded=>'gray' }; }
}
