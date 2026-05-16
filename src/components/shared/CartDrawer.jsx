import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

import { logOrder } from '../../firebase/products';

import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = ({ whatsappNumber }) => {
  const { 
    cartItems, 
    isDrawerOpen, 
    closeDrawer, 
    removeFromCart, 
    updateQuantity, 
    grandTotal 
  } = useCart();
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleWhatsAppCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty!');
      return;
    }

    if (!whatsappNumber) {
      toast.error('Store WhatsApp number not configured!');
      return;
    }

    // Prepare order data for Firestore
    const orderData = {
      customerName: 'WhatsApp Customer',
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: grandTotal,
      customerAction: 'whatsapp_redirect'
    };

    // Log the order silently
    await logOrder(orderData);

    let message = "Hello! I'd like to order the following parts from Riders Gear:\n\n🛒 ORDER:\n";
    
    cartItems.forEach(item => {
      const lineTotal = item.price * item.quantity;
      message += `• ${item.name} x${item.quantity} — KES ${lineTotal.toLocaleString()}\n`;
    });

    message += `\n💰 TOTAL: KES ${grandTotal.toLocaleString()}\n\nPlease confirm and advise on delivery. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    toast.success('Opening WhatsApp...');
    window.open(url, '_blank');
  };


  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-jade-dark/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-jade/5 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-jade/5 shrink-0 bg-morning/50">
          <h2 className="text-xl font-black flex items-center text-jade-dark">
            Your Cart
          </h2>
          <button 
            onClick={closeDrawer}
            className="p-2 text-pebble hover:text-jade-dark rounded-full hover:bg-morning transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 px-6">
              <div className="w-24 h-24 bg-morning rounded-full flex items-center justify-center relative shadow-sm border border-jade/5">
                <ShoppingCart className="w-12 h-12 text-pebble opacity-20" />
                <div className="absolute top-0 right-0 w-4 h-4 bg-jade/20 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="text-lg font-black text-jade-dark">Your cart is empty</h3>
                <p className="text-pebble mt-2 text-sm leading-relaxed">
                  Looks like you haven't added anything to your cart yet. Let's find some premium gear!
                </p>
              </div>
              <button 
                onClick={closeDrawer}
                className="bg-jade hover:bg-jade-dark text-white px-8 py-3 rounded-2xl transition-all font-bold shadow-lg shadow-jade/20"
              >
                Go Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="group relative flex gap-4 p-4 rounded-[2rem] bg-morning/30 border border-jade/5 hover:border-jade/10 hover:bg-morning/50 transition-all duration-300">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-jade/5 shrink-0 overflow-hidden flex items-center justify-center shadow-sm group-hover:shadow-jade/5">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <span className="text-pebble text-[10px] uppercase font-bold tracking-widest opacity-40">No Image</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-sm text-jade-dark truncate pr-2 group-hover:text-jade transition-colors">
                          {item.name}
                        </h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-pebble hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-jade font-black text-sm mt-0.5 italic">
                        KES {item.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between mt-auto gap-2">
                      <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-jade/5 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.stock)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-pebble hover:text-jade-dark hover:bg-morning rounded-lg disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold w-10 text-center text-jade-dark tabular-nums">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.stock)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center text-pebble hover:text-jade-dark hover:bg-morning rounded-lg disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[10px] text-pebble uppercase font-black block tracking-tighter opacity-60">Line Total</span>
                        <span className="text-jade-dark font-black text-sm">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-jade/5 bg-morning/50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] relative z-10">
            <div className="space-y-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-pebble text-sm font-bold">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-jade-dark">KES {grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-pebble text-sm font-bold">
                  <span>Estimated Delivery</span>
                  <span className="text-jade">Calculated at checkout</span>
                </div>
                <div className="h-px bg-jade/5 my-1" />
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-pebble uppercase font-black block tracking-widest mb-0.5 opacity-60">Total Amount</span>
                    <span className="text-2xl font-black text-jade-dark leading-none">KES {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckoutRedirect}
                className="w-full bg-jade hover:bg-jade-dark text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-jade/20"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={handleWhatsAppCheckout}
                className="w-full bg-white hover:bg-morning text-jade font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all border border-jade/5 shadow-sm"
              >
                Order via WhatsApp
              </button>
            </div>

            <p className="text-[10px] text-pebble text-center mt-4 uppercase tracking-[0.2em] font-bold leading-relaxed opacity-60">
              Fast delivery across all regions
            </p>
          </div>
        )}
      </div>
    </>
  );
};


export default CartDrawer;
