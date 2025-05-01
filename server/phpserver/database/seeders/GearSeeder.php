<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Gear;

class GearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Gear::truncate();

        $data = json_decode(file_get_contents(database_path('seeders/data/gears.json')), true);

        foreach ($data as $gear) {
            Gear::create($gear);
        }
    }
}
