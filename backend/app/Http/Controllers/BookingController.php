<?php
namespace App\Http\Controllers;
use App\Http\Requests\{QuoteRequest,StoreBookingRequest};
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\{BookingService,PricingService};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
class BookingController extends Controller {
    public function quote(QuoteRequest $r,PricingService $service) { return response()->json(['data'=>$service->calculate($r->validated())]); }
    public function index(Request $r) { return BookingResource::collection($r->user()->bookings()->latest()->paginate(10)); }
    public function store(StoreBookingRequest $r,BookingService $service) {
        $booking=$service->create($r->user(),$r->validated());
        return (new BookingResource($booking))->response()->setStatusCode($booking->wasRecentlyCreated?201:200);
    }
    public function show(Booking $booking) { Gate::authorize('view',$booking); return new BookingResource($booking); }
    public function cancel(Booking $booking,BookingService $service) {
        Gate::authorize('cancel',$booking); return new BookingResource($service->cancel($booking));
    }
}
