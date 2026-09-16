<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
class TransferService extends Model {
    use HasFactory;
    protected $guarded=['id'];
    protected function casts(): array { return ['includes'=>'array','active'=>'boolean']; }
    public function bookings(): HasMany { return $this->hasMany(Booking::class); }
}
