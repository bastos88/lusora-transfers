<?php
namespace App\Http\Controllers;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,Password,Hash};
use Illuminate\Support\Str;
use Illuminate\Validation\{Rule,ValidationException};
use Illuminate\Auth\Events\{Registered,PasswordReset};
class AuthController extends Controller {
    public function register(RegisterRequest $r) {
        $user=User::create($r->safe()->only(['name','email','phone','password']));
        event(new Registered($user)); Auth::guard('web')->login($user); $r->session()->regenerate();
        return response()->json(['data'=>$user],201);
    }
    public function login(Request $r) {
        $credentials=$r->validate(['email'=>['required','email'],'password'=>['required','string']]);
        if(!Auth::guard('web')->attempt($credentials)) throw ValidationException::withMessages(['email'=>'Email ou palavra-passe incorretos.']);
        $r->session()->regenerate(); return response()->json(['data'=>Auth::guard('web')->user()]);
    }
    public function logout(Request $r) { Auth::guard('web')->logout(); $r->session()->invalidate(); $r->session()->regenerateToken(); return response()->noContent(); }
    public function me(Request $r) { return response()->json(['data'=>$r->user()]); }
    public function profile(Request $r) {
        $data=$r->validate(['name'=>['required','string','min:2','max:255'],'phone'=>['required','string','min:8','max:40'],
            'email'=>['required','email','max:255',Rule::unique('users')->ignore($r->user()->id)]]);
        if($data['email']!==$r->user()->email) $r->user()->email_verified_at=null;
        $r->user()->fill($data)->save(); return response()->json(['data'=>$r->user()]);
    }
    public function forgot(Request $r) {
        $r->validate(['email'=>['required','email']]); Password::sendResetLink($r->only('email'));
        return response()->json(['message'=>'Se a conta existir, receberá um link de recuperação.']);
    }
    public function reset(Request $r) {
        $data=$r->validate(['token'=>['required','string'],'email'=>['required','email'],
            'password'=>['required','confirmed',\Illuminate\Validation\Rules\Password::min(8)]]);
        $status=Password::reset($data,function(User $user,string $password) {
            $user->forceFill(['password'=>Hash::make($password),'remember_token'=>Str::random(60)])->save();
            \Illuminate\Support\Facades\DB::table('sessions')->where('user_id',$user->id)->delete();
            event(new PasswordReset($user));
        });
        if($status!==Password::PasswordReset) throw ValidationException::withMessages(['email'=>__($status)]);
        return response()->json(['message'=>'Palavra-passe atualizada.']);
    }
}
