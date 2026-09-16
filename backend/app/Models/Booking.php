<?php

namespace App\Models;

use App\Enums\{BookingStatus, PaymentStatus};
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected function casts(): array
    {
        return [
            'origin' => 'array',
            'destination' => 'array',
            'price_breakdown' => 'array',
            'catalog_snapshot' => 'array',
            'pickup_at' => 'immutable_datetime',
            'return_at' => 'immutable_datetime',
            'terms_accepted_at' => 'immutable_datetime',
            'status' => BookingStatus::class,
            'payment_status' => PaymentStatus::class,
        ];
    }
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
    public function transferService(): BelongsTo
    {
        return $this->belongsTo(TransferService::class);
    }
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed], true) && $this->pickup_at->isAfter(now()->addHours(24));
    }
}
