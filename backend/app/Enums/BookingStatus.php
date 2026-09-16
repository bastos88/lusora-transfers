<?php

namespace App\Enums;

use Filament\Support\Contracts\{HasColor, HasLabel};

enum BookingStatus: string implements HasColor, HasLabel
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'Pendente',
            self::Confirmed => 'Confirmada',
            self::InProgress => 'Em curso',
            self::Completed => 'Concluída',
            self::Cancelled => 'Cancelada'
        };
    }
    public function getColor(): string
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Confirmed => 'success',
            self::InProgress => 'info',
            self::Completed => 'gray',
            self::Cancelled => 'danger'
        };
    }
    public function canTransitionTo(self $next): bool
    {
        return $this === $next
            || in_array($next, $this->allowedTransitions(), true);
    }
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Pending => [
                self::Confirmed,
                self::Cancelled,
            ],

            self::Confirmed => [
                self::InProgress,
                self::Cancelled,
            ],

            self::InProgress => [
                self::Completed,
            ],

            self::Completed,
            self::Cancelled => [],
        };
    }
}
