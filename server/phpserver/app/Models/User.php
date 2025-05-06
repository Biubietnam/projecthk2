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

    /**
     * Các trường được phép mass assign.
     *
     * @var array<int,string>
     */
    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'role_id',
        // nếu bạn có các trường profile khác:
        // 'username', 'phone', 'avatar', 'bio', …
    ];

    /**
     * Các trường ẩn khi serialize sang JSON.
     *
     * @var array<int,string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        // nếu dùng 2FA:
        // 'two_factor_recovery_codes',
        // 'two_factor_secret',
    ];

    /**
     * Các kiểu dữ liệu cần cast.
     *
     * @var array<string,string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'deleted_at'        => 'datetime',
    ];

    /**
     * Các attribute thêm vào JSON (nếu bạn có accessor).
     *
     * @var array<int,string>
     */
    protected $appends = [
        // 'profile_photo_url', // nếu bạn xài Laravel Jetstream
    ];

    /**
     * Mutator: tự hash password khi gán.
     */
    public function setPasswordAttribute($value)
    {
        // Chỉ hash nếu giá trị thay đổi
        if ($value && Hash::needsRehash($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    | Ví dụ quan hệ với Role hoặc Profile nếu có:
    */

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    /*
    |--------------------------------------------------------------------------
    | API Resources / Helpers
    |--------------------------------------------------------------------------
    */

    /**
     * Kiểm tra user có role nào không.
     */
    public function hasRole(string $roleName): bool
    {
        return $this->role && $this->role->name === $roleName;
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
