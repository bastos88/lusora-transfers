<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class LocationController extends Controller
{
    public function __invoke(Request $r)
    {
        $q = $r->validate(['q' => ['required', 'string', 'min:3', 'max:200']])['q'];
        abort_unless(config('services.geoapify.key'), 503, 'A pesquisa de localidades está temporariamente indisponível.');
        $query = mb_strtolower(Str::squish($q));
        $data = Cache::flexible('locations:pt:'.hash('sha256', $query), [now()->addMinutes(30), now()->addDay()], function () use ($query) {
            try {
                $response = Http::connectTimeout(2)->timeout(5)->get('https://api.geoapify.com/v1/geocode/autocomplete', [
                    'text' => $query, 'format' => 'json', 'lang' => 'pt', 'limit' => 6, 'filter' => 'countrycode:pt',
                    'bias' => 'proximity:-8.6291,41.1579', 'apiKey' => config('services.geoapify.key'),
                ]);
            } catch (ConnectionException) {
                abort(503, 'Não foi possível pesquisar localidades. Tente novamente.');
            }
            abort_unless($response->successful(), 503, 'Não foi possível pesquisar localidades. Tente novamente.');

            return $response->json();
        });

        return response()->json($data);
    }
}
