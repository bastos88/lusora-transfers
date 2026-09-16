<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\ResetPassword;
class AppServiceProvider extends ServiceProvider {
    public function register(): void {}
    public function boot(): void {
        ResetPassword::createUrlUsing(fn($user,$token)=>rtrim(config('app.frontend_url'),'/').'/reset-password?token='.urlencode($token).'&email='.urlencode($user->email));
    }
}
