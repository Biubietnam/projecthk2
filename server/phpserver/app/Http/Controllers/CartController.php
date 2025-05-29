<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Gear;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function show()
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $items = $cart->items()->with('gear')->get();

        return response()->json([
            'cart_id' => $cart->id,
            'items' => $items,
            'total_amount' => $cart->total_amount,
        ]);
    }

    public function add(Request $request, $gearId)
    {
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $gear = Gear::findOrFail($gearId);
        $quantity = $request->input('quantity', 1);

        $item = $cart->items()->where('gear_id', $gear->id)->first();

        $currentQtyInCart = $item ? $item->quantity : 0;
        $newTotalQuantity = $currentQtyInCart + $quantity;

        if ($newTotalQuantity > $gear->stock) {
            return response()->json([
                'error' => 'Quantity exceeds available stock. Only ' . ($gear->stock - $currentQtyInCart) . ' more can be added.'
            ], 400);
        }

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            $item = $cart->items()->create([
                'gear_id' => $gear->id,
                'price' => $gear->price,
                'quantity' => $quantity
            ]);
        }

        return response()->json([
            'message' => 'Item added to cart',
            'item' => $item->load('gear')
        ], 201);
    }

    public function update(Request $request, $itemId)
    {
        $item = CartItem::findOrFail($itemId);
        $newQty = $request->input('quantity');

        if ($newQty > $item->gear->stock) {
            return response()->json([
                'error' => 'Quantity exceeds available stock.'
            ], 400);
        }

        $item->update([
            'quantity' => $newQty
        ]);

        return response()->json([
            'message' => 'Cart item updated',
            'item' => $item
        ]);
    }

    public function remove($itemId)
    {
        $item = CartItem::findOrFail($itemId);
        $item->delete();

        return response()->json([
            'message' => 'Item removed from cart'
        ]);
    }
}
