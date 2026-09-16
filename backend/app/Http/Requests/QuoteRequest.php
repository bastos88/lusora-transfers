<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class QuoteRequest extends FormRequest {
    public function authorize(): bool { return true; }
    public function rules(): array {
        $rules=[
            'vehicle_id'=>['required','string',Rule::exists('vehicles','slug')->where('active',true)->where('available',true)],
            'service_id'=>['required','string',Rule::exists('transfer_services','slug')->where('active',true)],
            'trip_type'=>['required',Rule::in(['one-way','round-trip'])],
            'pickup_at'=>['required','date_format:Y-m-d\TH:i:sP','after:now'],
            'return_at'=>['exclude_unless:trip_type,round-trip','required','date_format:Y-m-d\TH:i:sP','after:pickup_at'],
            'passengers'=>['required','integer','min:1','max:8'],'luggage'=>['required','integer','min:0','max:20'],
        ];
        foreach(['origin','destination'] as $f) {
            $rules[$f]=['required','array:id,label,name,city,postcode,country,countryCode,latitude,longitude,resultType'];
            $rules["$f.id"]=['required','string','max:500']; $rules["$f.label"]=['required','string','max:500'];
            $rules["$f.name"]=['required','string','max:255'];
            $rules["$f.latitude"]=['required','numeric','between:-90,90']; $rules["$f.longitude"]=['required','numeric','between:-180,180'];
            foreach(['city','postcode','country','countryCode','resultType'] as $part) $rules["$f.$part"]=['sometimes','string','max:255'];
        }
        return $rules;
    }
    public function after(): array { return [function($v) {
        if($this->input('origin.latitude')!==null && $this->input('origin.latitude')==$this->input('destination.latitude') && $this->input('origin.longitude')==$this->input('destination.longitude')) $v->errors()->add('destination','O destino deve ser diferente da origem.');
    }]; }
}
