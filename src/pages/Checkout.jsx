import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { processManualSale } from '../firebase/products';
import Header from '../components/shared/Header';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, Phone, User, ShoppingBag, ShoppingCart } from 'lucide-react';

// Validate Kenyan phone numbers (07xx or 01xx, 10 digits)
const isValidKenyanPhone = (phone) => /^(0[17]\d{8}|254[17]\d{8})$/.test(phone.replace(/\s/g, ''));

const Checkout = () => {
  const { cartItems, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    notes: '',
  });

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-morning text-jade-dark flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-16 h-16 text-jade/20 mb-4" />
        <h2 className="text-2xl font-black mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-jade px-8 py-4 rounded-2xl font-black text-white hover:bg-jade-dark transition shadow-lg shadow-jade/20"
        >
          Go Back to Store
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!isValidKenyanPhone(formData.phone)) {
      toast.error('Please enter a valid Kenyan phone number (e.g. 0712 345 678)');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: 'anonymous',
        email: 'anonymous@customer.com',
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        // Items include buyingPrice snapshot
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          buyingPrice: item.buyingPrice || 0,
          quantity: item.quantity,
        })),
        total: grandTotal,
        customerAction: 'online_order',
        paymentType: 'Cash',
        paymentStatus: 'Unpaid',
      };

      // Use processManualSale so stock is atomically deducted
      await processManualSale(orderData);

      // Notify admin via WhatsApp if number is configured
      notifyAdminWhatsApp(orderData);

      toast.success('Order placed successfully!');
      clearCart();
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-morning text-jade-dark font-poppins">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight uppercase text-jade-dark italic">Secure Checkout</h1>
          <p className="text-pebble font-bold opacity-60 mt-2 uppercase tracking-widest text-xs">Complete your procurement request</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Delivery Info */}
          <div className="space-y-8">
            <div className="bg-white border border-jade/5 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-jade/5 rounded-full blur-3xl" />

              <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter text-jade-dark">
                <MapPin className="text-jade" />
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-pebble mb-3 opacity-60">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jade opacity-40" />
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-morning border border-jade/5 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-jade transition font-bold text-sm text-jade-dark placeholder-jade/30"
                      placeholder="ENTER FULL NAME"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-pebble mb-3 opacity-60">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jade opacity-40" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-morning border border-jade/5 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-jade transition font-bold text-sm text-jade-dark placeholder-jade/30"
                      placeholder="07XX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-pebble mb-3 opacity-60">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-jade opacity-40" />
                    <textarea
                      required
                      rows="3"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-morning border border-jade/5 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-jade transition font-bold text-sm text-jade-dark placeholder-jade/30"
                      placeholder="ESTATE, ROAD, TOWN / CITY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-pebble mb-2 opacity-60">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-morning border border-jade/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-jade transition font-bold text-sm text-jade-dark placeholder-jade/30"
                    placeholder="Any special delivery instructions?"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-jade/5 p-8 rounded-[2.5rem] sticky top-24 shadow-2xl">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter text-jade-dark">
                <ShoppingCart className="text-jade" />
                Order Summary
              </h2>

              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-morning border border-jade/5 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-jade-dark font-bold text-sm truncate">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-pebble text-[10px] font-black uppercase tracking-widest opacity-60">KES {item.price.toLocaleString()}</span>
                        <span className="text-jade text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-jade/5 rounded-lg">QTY: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-jade-dark font-black text-sm italic">KES {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-jade/5 pt-6 space-y-4">
                <div className="flex justify-between text-pebble text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                  <span>Subtotal</span>
                  <span>KES {grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-pebble text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                  <span>Logistics</span>
                  <span className="text-jade">FREE DELIVERY</span>
                </div>
                <div className="border-t-2 border-jade pt-4 flex justify-between items-end">
                  <div>
                    <span className="text-pebble text-[10px] font-black uppercase tracking-[0.2em] block mb-1 opacity-60">Total Amount</span>
                    <span className="text-3xl font-black text-jade-dark italic">
                      <span className="text-jade text-sm mr-1 not-italic">KES</span>
                      {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || cartItems.length === 0}
                className={`w-full mt-8 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${
                  loading || cartItems.length === 0
                    ? 'bg-morning text-pebble cursor-not-allowed'
                    : 'bg-jade hover:bg-jade-dark text-white shadow-lg shadow-jade/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>
                    Place Order
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Sends a WhatsApp message to the admin when an online order is placed.
 */
async function notifyAdminWhatsApp(orderData) {
  try {
    const { getSettings } = await import('../firebase/products');
    const settings = await getSettings();
    const adminNumber = settings?.whatsappNumber;
    if (!adminNumber) return;

    const itemsList = orderData.items
      .map(i => `• ${i.name} x${i.quantity} — KES ${(i.price * i.quantity).toLocaleString()}`)
      .join('\n');

    const message =
      `🛒 *NEW ONLINE ORDER*\n\n` +
      `*Customer:* ${orderData.customerName}\n` +
      `*Phone:* ${orderData.phone}\n` +
      `*Address:* ${orderData.address}\n` +
      (orderData.notes ? `*Notes:* ${orderData.notes}\n` : '') +
      `\n*Items:*\n${itemsList}\n\n` +
      `*TOTAL: KES ${orderData.total.toLocaleString()}*\n\n` +
      `*Riders Gear Nairobi*`;

    window.open(
      `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  } catch (err) {
    console.warn('Admin WhatsApp notification failed:', err);
  }
}

export default Checkout;
