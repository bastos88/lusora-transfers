<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Testimonial extends Model { use HasFactory; protected $guarded=['id']; protected function casts(): array { return ['active'=>'boolean']; } }
