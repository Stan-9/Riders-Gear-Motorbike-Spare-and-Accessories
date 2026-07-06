import { Printer, X } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, order, settings }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-dark/60 backdrop-blur-sm">
      <div className="bg-white text-black w-full max-w-md rounded-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-jade/5 no-print bg-jade text-white">
          <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Receipt Preview
          </h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 print-only bg-white text-black font-mono text-sm leading-tight">
          {/* Receipt Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-black uppercase tracking-widest mb-1">{settings?.shopName || 'RIDERS GEAR NAIROBI'}</h1>
            <p className="text-[10px] uppercase font-bold text-pebble mb-2">Motorbike Spare Parts & Accessories</p>
            <div className="border-t border-b border-jade/10 py-2 my-2 space-y-1">
              <p className="flex justify-between"><span>DATE:</span> <span>{new Date(order.createdAt?.toDate ? order.createdAt.toDate() : order.createdAt).toLocaleString()}</span></p>
              <p className="flex justify-between"><span>ORDER ID:</span> <span className="font-bold">#{order.id.slice(-6).toUpperCase()}</span></p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6 space-y-1 border-b border-jade/10 pb-4">
            <p className="font-bold uppercase">CUSTOMER: {order.customerName || 'N/A'}</p>
            <p className="text-[10px] uppercase">PHONE: {order.phone || 'N/A'}</p>
            {order.address && <p className="text-[10px] uppercase">ADDR: {order.address}</p>}
          </div>

          {/* Items */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between font-bold border-b border-black pb-1 text-[10px]">
              <span className="w-2/3">DESCRIPTION</span>
              <span className="w-1/6 text-center">QTY</span>
              <span className="w-1/6 text-right">PRICE</span>
            </div>
            {order.items?.map((item, idx) => {
              const itemPrice = item.final_price ?? item.price;
              const hasItemDisc = item.discount_amount && item.discount_amount > 0;
              return (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[11px] gap-2">
                    <span className="w-2/3 uppercase truncate">{item.name}</span>
                    <span className="w-1/6 text-center">{item.quantity}</span>
                    <span className="w-1/6 text-right">{(itemPrice * item.quantity).toLocaleString()}</span>
                  </div>
                  {hasItemDisc && (
                    <div className="flex justify-between text-[9px] text-green-700 font-bold pl-2">
                      <span>* MANUAL DISCOUNT Applied</span>
                      <span>- KES {(item.discount_amount * item.quantity).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t-2 border-black pt-4 space-y-2">
            {order.has_discount && (
              <>
                <div className="flex justify-between text-xs font-bold text-pebble">
                  <span>SUBTOTAL</span>
                  <span>KES {order.subtotal_original?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-green-700">
                  <span>DISCOUNT (SAVINGS)</span>
                  <span>- KES {order.total_discount?.toLocaleString()}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg font-black">
              <span>{order.has_discount ? 'NET TOTAL' : 'TOTAL'}</span>
              <span>KES {order.total?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span>PAYMENT TYPE</span>
              <span className="uppercase">{order.paymentType || 'CASH'}</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold">
              <span>STATUS</span>
              <span className="uppercase">{order.paymentStatus || 'PAID'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-6 border-t border-dashed border-jade/20">
            <p className="font-bold mb-1 italic">THANK YOU FOR YOUR BUSINESS!</p>
            <p className="text-[10px] uppercase tracking-widest opacity-60">Parts sold are not returnable once fitted.</p>
            <p className="text-[9px] mt-4 opacity-40">System Powered by Riders Gear</p>
          </div>
        </div>

        <div className="p-4 bg-morning no-print border-t border-jade/5">
          <button
            onClick={handlePrint}
            className="w-full bg-jade hover:bg-jade-dark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition shadow-lg shadow-jade/20 uppercase tracking-widest text-xs"
          >
            <Printer className="w-5 h-5" />
            Print Official Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
