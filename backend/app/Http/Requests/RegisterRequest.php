<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
class RegisterRequest extends FormRequest {
    public function authorize(): bool { return true; }
    public function rules(): array { return [
        'name'=>['required','string','min:2','max:255'],'email'=>['required','email','max:255','unique:users'],
        'phone'=>['required','string','min:8','max:40'],'password'=>['required','confirmed',Password::min(8)],'accept_terms'=>['accepted'],
    ]; }
}
