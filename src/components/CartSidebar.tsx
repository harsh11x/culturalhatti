'use client';
import { useCartStore, useUIStore } from '@/store';
import Link from 'next/link';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartSidebar() {
    const { items, total, removeItem, updateQty } = useCartStore();
    const { isCartOpen, closeCart } = useUIStore();
    
    const subtotal = total();
    const FREE_SHIPPING_THRESHOLD = 999;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
    const finalTotal = subtotal + shippingCost;
    const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[450px] sm:max-w-[500px] bg-[#FDFBF7] border-l-4 border-black z-[100] transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)]`}>
                <div className="p-6 md:p-8 border-b-4 border-black flex items-center justify-between bg-primary text-white">
                    <h2 className="text-3xl font-black uppercase tracking-tight">Your Cart</h2>
                    <button onClick={closeCart} className="hover:text-primary transition-colors flex items-center justify-center">
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {items.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                            <ShoppingBag className="w-16 h-16 mb-4" />
                            <p className="text-xl font-bold uppercase tracking-widest">Your bag is empty.</p>
                            <button
                                onClick={closeCart}
                                className="mt-8 px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.product_id} className="flex gap-4 border-2 border-black p-3 bg-white brutalist-shadow">
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover border border-black" />
                                <div className="flex-1 flex flex-col justify-between ml-2">
                                    <div>
                                        <h3 className="font-bold uppercase text-sm leading-tight leading-snug">{item.name}</h3>
                                        <p className="text-gray-500 text-xs font-mono mt-1">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center border border-black">
                                            <button
                                                onClick={() => updateQty(item.product_id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold"
                                            >-</button>
                                            <span className="w-8 h-8 flex items-center justify-center font-bold text-sm border-x border-black bg-gray-50">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.product_id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 font-bold"
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="text-black hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t-3 border-black bg-white">
                        {/* Free Shipping Progress Bar */}
                        {amountToFreeShipping > 0 && (
                            <div className="mb-6 p-4 bg-primary/10 border-2 border-primary">
                                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                                    Add ₹{amountToFreeShipping} more for FREE SHIPPING!
                                </p>
                                <div className="w-full h-2 bg-gray-200 border border-black">
                                    <div 
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                        
                        {amountToFreeShipping === 0 && (
                            <div className="mb-6 p-4 bg-green-50 border-2 border-green-500">
                                <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                                    🎉 You've unlocked FREE SHIPPING!
                                </p>
                            </div>
                        )}
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Subtotal</span>
                                <span className="text-xl font-black">₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Shipping</span>
                                <span className="text-xl font-black">
                                    {shippingCost === 0 ? (
                                        <span className="text-green-600">FREE</span>
                                    ) : (
                                        `₹${shippingCost}`
                                    )}
                                </span>
                            </div>
                            <div className="border-t-2 border-black pt-3 flex justify-between items-end">
                                <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-black tracking-tighter">₹{finalTotal}</span>
                            </div>
                        </div>
                        
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">
                            Taxes calculated at checkout.
                        </p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-black text-white border-2 border-black py-5 font-black uppercase text-xl tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-between px-6 brutalist-shadow hover:brutalist-shadow-hover hover:translate-x-[-2px] hover:translate-y-[-2px]"
                        >
                            <span>Checkout</span>
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
