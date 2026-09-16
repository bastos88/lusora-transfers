<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case Card = 'card';
    case MbWay = 'mb_way';
    case BankTransfer = 'bank_transfer';

    public function label(): string
    {
        return match ($this) {
            self::Cash => 'Dinheiro',
            self::Card => 'Cartão',
            self::MbWay => 'MB Way',
            self::BankTransfer => 'Transferência bancária',
        };
    }
}
