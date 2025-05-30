<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;      // nếu muốn xóa mềm
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\Profile;

class User extends Authenticatable implements MustVerifyEmail
{

    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'email_verified_at' => 'datetime',
        'deleted_at'        => 'datetime',
    ];
    protected $appends = [
        // 'profile_photo_url', // nếu bạn xài Laravel Jetstream
    ];

    public function setPasswordAttribute($value)
    {
        if ($value && Hash::needsRehash($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function hasRole(string $roleName): bool
    {
        return $this->role && $this->role->name === $roleName;
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function pets()
    {
        return $this->hasMany(UserPet::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function hasAdoptionRequestForPet($petId)
    {
        return $this->hasMany(AdoptionRequest::class)
            ->where('pet_id', $petId)
            ->where('status', 'pending')
            ->exists();
    }

    public function favoritePets()
    {
        return $this->belongsToMany(Pet::class, 'favorite_pets')->withTimestamps();
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
}
