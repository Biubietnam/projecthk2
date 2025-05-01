<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\AdminOnly;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        $this->routes(function () {
            // API routes: tất cả URI trong routes/api.php đều mặc định có prefix /api,
            // và nhóm middleware 'api'
            Route::prefix('api')
                ->middleware('api')
                ->group(base_path('routes/api.php'));

            // Web routes: session, CSRF, cookie… trả về view hoặc Inertia/Blade
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::aliasMiddleware('admin', AdminOnly::class);
        });
    }
}
