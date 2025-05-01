<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pet;

class PetSeeder extends Seeder
{
    public function run()
    {
        Pet::truncate();

        $data = json_decode(file_get_contents(database_path('seeders/data/pets.json')), true);

        foreach ($data as $pet) {
            Pet::create($pet);
        }
    }
}

