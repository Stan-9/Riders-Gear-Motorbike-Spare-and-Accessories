import { ShoppingCart, User, LogOut, Briefcase } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const Header = ({ shopName }) => {
  const { totalItems, grandTotal, toggleDrawer } = useCart();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-morning/95 backdrop-blur-md border-b border-jade/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl shrink-0 bg-jade flex items-center justify-center font-black text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
              {shopName ? shopName.charAt(0) : 'R'}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-jade-dark hidden sm:block">
              {shopName || "Riders Gear"}
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-xs font-semibold uppercase tracking-widest text-pebble hover:text-jade transition-colors">Shop</Link>
            <Link to="/business" className="text-xs font-semibold uppercase tracking-widest text-pebble hover:text-jade transition-colors">Business</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3 bg-jade/5 p-1.5 pr-4 rounded-xl border border-jade/10">
              <div className="w-8 h-8 rounded-lg bg-jade/10 flex items-center justify-center">
                <User className="w-4 h-4 text-jade" />
              </div>
              <span className="text-[10px] font-bold text-pebble-dark uppercase tracking-wider truncate max-w-[80px]">
                {user.email.split('@')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-pebble hover:text-jade-dark transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="h-8 w-px bg-jade/10 mx-2" />

          <button 
            onClick={toggleDrawer}
            className="relative group p-2.5 rounded-xl flex items-center justify-center focus:outline-none transition-all duration-300 hover:bg-jade/5 active:scale-95 border border-pebble/20 hover:border-jade"
          >
            <div className="flex items-center gap-3">
              {totalItems > 0 && (
                <span className="hidden md:block text-xs font-bold text-jade">
                  KES {grandTotal.toLocaleString()}
                </span>
              )}
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-jade transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute -top-3 -right-3 bg-jade-dark text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border border-morning">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

