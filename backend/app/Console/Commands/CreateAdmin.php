<?php
namespace App\Console\Commands;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
class CreateAdmin extends Command {
 protected $signature='lusora:create-admin {email}';
 protected $description='Criar um administrador sem palavra-passe predefinida';
 public function handle(): int {
    $data=['email'=>$this->argument('email'),'name'=>$this->ask('Nome'),'password'=>$this->secret('Palavra-passe (mínimo 12 caracteres)')];
    $v=Validator::make($data,['email'=>'required|email|unique:users','name'=>'required|string|max:255','password'=>'required|string|min:12']);
    if($v->fails()){$this->error($v->errors()->first());return self::FAILURE;}
    $user=new User($data);$user->role='admin';$user->save();$this->info('Administrador criado.');return self::SUCCESS;
 }
}
