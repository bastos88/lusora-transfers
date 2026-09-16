<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Cache,Http};
class LocationController extends Controller {
    public function __invoke(Request $r) {
        $q=$r->validate(['q'=>['required','string','min:3','max:200']])['q'];
        abort_unless(config('services.geoapify.key'),503,'A pesquisa de localidades está temporariamente indisponível.');
        $data=Cache::remember('locations:'.hash('sha256',mb_strtolower(trim($q))),now()->addMinutes(30),function() use($q) {
            $response=Http::timeout(8)->get('https://api.geoapify.com/v1/geocode/autocomplete',[
                'text'=>$q,'format'=>'json','lang'=>'pt','limit'=>6,'filter'=>'countrycode:pt',
                'bias'=>'proximity:-8.6291,41.1579','apiKey'=>config('services.geoapify.key'),
            ]);
            abort_unless($response->successful(),503,'Não foi possível pesquisar localidades. Tente novamente.');
            return $response->json();
        });
        return response()->json($data);
    }
}
