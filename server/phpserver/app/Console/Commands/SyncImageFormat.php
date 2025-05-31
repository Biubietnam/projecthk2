<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pet;
use App\Models\Gear;
use App\Models\Profile;

class SyncImageFormat extends Command
{
    protected $signature = 'sync:image-format';
    protected $description = 'Fix and standardize image fields format for Pet, Gear, and Profile';

    public function handle()
    {
        $this->info("🔄 Syncing Pet images...");
        $this->syncImagesForModel(Pet::all(), 'Pet');

        $this->info("🔄 Syncing Gear images...");
        $this->syncImagesForModel(Gear::all(), 'Gear');

        $this->info("🔄 Syncing Profile avatars...");
        $this->syncAvatars(Profile::all());

        $this->info("✅ DONE: All image fields converted to new format.");
    }

    protected function parseIfStringifiedJson($value)
    {
        if (is_string($value) && str_starts_with($value, '{')) {
            $decoded = json_decode($value, true);
            return is_array($decoded) ? $decoded : ['url' => $value, 'public_id' => null];
        }
        return $value;
    }

    protected function syncImagesForModel($items, $modelName)
    {
        foreach ($items as $item) {
            $updated = false;

            // Fix images array
            $images = $item->images ?? [];
            $newImages = [];

            foreach ($images as $img) {
                if (is_string($img)) {
                    $newImages[] = ['url' => $img, 'public_id' => null];
                    $updated = true;
                } elseif (is_array($img) && isset($img['url'])) {
                    $newImages[] = $img;
                } elseif (is_string($img) && str_starts_with($img, '{')) {
                    $parsed = json_decode($img, true);
                    if (isset($parsed['url'])) {
                        $newImages[] = $parsed;
                        $updated = true;
                    }
                }
            }

            // Fix main_image
            $mainImage = $this->parseIfStringifiedJson($item->main_image);
            if (is_string($mainImage)) {
                $mainImage = ['url' => $mainImage, 'public_id' => null];
                $updated = true;
            }

            if ($updated) {
                $item->images = $newImages;
                $item->main_image = $mainImage;
                $item->save();
                $this->line("✔ Updated $modelName ID: {$item->id}");
            }
        }
    }

    protected function syncAvatars($profiles)
    {
        foreach ($profiles as $profile) {
            $avatar = $this->parseIfStringifiedJson($profile->avatar_url);
            if (is_string($avatar)) {
                $avatar = ['url' => $avatar, 'public_id' => null];
            }

            if (isset($avatar['url'])) {
                $profile->avatar_url = $avatar;
                $profile->save();
                $this->line("✔ Updated Profile ID: {$profile->id}");
            }
        }
    }
}
