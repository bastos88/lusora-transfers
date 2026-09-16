<?php
namespace App\Http\Requests;
use Illuminate\Validation\Rule;
class StoreBookingRequest extends QuoteRequest {
    public function authorize(): bool { return $this->user()!==null; }
    public function rules(): array { return parent::rules()+[
        'idempotency_key'=>['required','uuid'],'customer_name'=>['required','string','min:2','max:255'],
        'customer_email'=>['required','email','max:255'],'customer_phone'=>['required','string','min:8','max:40'],
        'flight_number'=>['nullable','string','max:40'],'notes'=>['nullable','string','max:3000'],
        'payment_method'=>['required',Rule::in(['cash','card-on-arrival'])],'accept_terms'=>['accepted'],
        'expected_total_cents'=>['required','integer','min:0'],
    ]; }
}
