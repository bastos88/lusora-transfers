<?php
namespace App\Http\Controllers;
use App\Models\{Vehicle,TransferService,Testimonial,Faq};
use App\Http\Resources\{VehicleResource,TransferServiceResource};
class CatalogController extends Controller {
    public function vehicles() { return VehicleResource::collection(Vehicle::where('active',true)->where('available',true)->orderBy('id')->get()); }
    public function services() { return TransferServiceResource::collection(TransferService::where('active',true)->orderBy('id')->get()); }
    public function testimonials() { return response()->json(['data'=>Testimonial::where('active',true)->orderBy('id')->get()->map(fn($t)=>[
        'id'=>$t->slug,'name'=>$t->name,'source'=>$t->source,'text'=>$t->content,'avatar'=>$t->avatar,
        'initials'=>collect(explode(' ',$t->name))->map(fn($n)=>mb_substr($n,0,1))->take(2)->join(''),
        'avatarBackground'=>$t->avatar_background,
    ])]); }
    public function faqs() { return response()->json(['data'=>Faq::where('active',true)->orderBy('sort_order')->get()->map(fn($f)=>['id'=>$f->slug,'question'=>$f->question,'answer'=>$f->answer])]); }
}
