<?php
namespace App\Policies;
use App\Models\{Booking,User};
class BookingPolicy {
    public function viewAny(User $u): bool { return true; }
    public function view(User $u,Booking $b): bool { return $u->role==='admin' || $b->user_id===$u->id; }
    public function create(User $u): bool { return true; }
    public function update(User $u,Booking $b): bool { return $u->role==='admin'; }
    public function cancel(User $u,Booking $b): bool { return $b->user_id===$u->id && $b->canBeCancelled(); }
    public function delete(User $u,Booking $b): bool { return false; }
}
