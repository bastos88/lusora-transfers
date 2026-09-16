<?php
namespace Tests\Feature;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{Hash,Notification};
use Illuminate\Auth\Notifications\ResetPassword;
use Tests\TestCase;
class AuthTest extends TestCase {
 use RefreshDatabase;
 protected function setUp(): void {parent::setUp();$this->withHeader('Origin','http://localhost:3000');}
 public function test_register_login_logout_and_mass_assignment_protection(): void {
  $this->postJson('/api/register',['name'=>'Ana Silva','email'=>'ana@example.test','phone'=>'912345678',
   'password'=>'secure-password','password_confirmation'=>'secure-password','accept_terms'=>true,'role'=>'admin'])
   ->assertCreated()->assertJsonMissingPath('data.password')->assertJsonPath('data.name','Ana Silva');
  $this->assertDatabaseHas('users',['email'=>'ana@example.test','role'=>'customer']);
  $this->assertTrue(Hash::check('secure-password',User::first()->password));
  $this->getJson('/api/user')->assertOk();
  $this->postJson('/api/logout')->assertNoContent();
  $this->postJson('/api/login',['email'=>'ana@example.test','password'=>'wrong'])->assertUnprocessable();
  $this->postJson('/api/login',['email'=>'ana@example.test','password'=>'secure-password'])->assertOk();
 }
 public function test_profile_cannot_promote_customer(): void {
  $user=User::factory()->create();
  $this->actingAs($user)->patchJson('/api/user',['name'=>'Updated','email'=>$user->email,'phone'=>'912345678','role'=>'admin'])->assertOk();
  $this->assertSame('customer',$user->fresh()->role);
 }
 public function test_customer_cannot_access_any_admin_resource(): void {
  $this->actingAs(User::factory()->create());
  foreach(['/admin','/admin/bookings','/admin/vehicles','/admin/users'] as $url) $this->get($url)->assertForbidden();
 }
 public function test_password_reset_uses_token_and_changes_password(): void {
  Notification::fake();$user=User::factory()->create();
  $this->postJson('/api/forgot-password',['email'=>$user->email])->assertOk();
  $token=null;
  Notification::assertSentTo($user,ResetPassword::class,function($notification)use(&$token){$token=$notification->token;return true;});
  $this->postJson('/api/reset-password',['email'=>$user->email,'token'=>$token,'password'=>'new-password','password_confirmation'=>'new-password'])->assertOk();
  $this->assertTrue(Hash::check('new-password',$user->fresh()->password));
 }
 public function test_admin_pages_render(): void {
  $this->seed();$user=User::factory()->create();$user->role='admin';$user->save();$this->actingAs($user);
  foreach(['/admin','/admin/bookings','/admin/vehicles','/admin/transfer-services','/admin/testimonials','/admin/faqs','/admin/users'] as $url) $this->get($url)->assertOk();
 }
}
