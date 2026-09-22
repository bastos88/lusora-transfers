<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LocationTest extends TestCase
{
    use RefreshDatabase;

    public function test_normalized_queries_share_the_geoapify_cache(): void
    {
        config(['services.geoapify.key' => 'test-key']);
        Http::fake(['geoapify.com/*' => Http::response(['results' => []])]);

        $this->getJson('/api/locations?q=Porto%20%20Centro')->assertOk();
        $this->getJson('/api/locations?q=%20porto%20centro%20')->assertOk();

        Http::assertSentCount(1);
    }

    public function test_geoapify_failure_returns_service_unavailable(): void
    {
        config(['services.geoapify.key' => 'test-key']);
        Http::fake(['geoapify.com/*' => Http::response([], 500)]);

        $this->getJson('/api/locations?q=Porto')->assertServiceUnavailable();
    }
}
