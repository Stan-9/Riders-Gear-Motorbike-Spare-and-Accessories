import { useState, useEffect, useMemo } from 'react';
import Header from '../components/shared/Header';
import CartDrawer from '../components/shared/CartDrawer';
import SkeletonCard from '../components/shared/SkeletonCard';
import { subscribeProducts, subscribeSettings } from '../firebase/products';
import { useCart } from '../context/CartContext';
import { Search, Info, Plus, ShoppingCart, Settings } from 'lucide-react';

const StoreFront = () => {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ shopName: '', whatsappNumber: '' });
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const unsubProducts = subscribeProducts((data) => {
      setProducts(data);
      setLoading(false);
    });

    const unsubSettings = subscribeSettings((data) => {
      setSettings(data);
    });

    return () => {
      unsubProducts();
      unsubSettings();
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.category))];
    return ['All', ...uniqueCats.filter(Boolean).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory = activeCategory === 'All' || p.category === activeCategory;
      const isVisible = p.isVisible !== false;
      return matchSearch && matchCategory && isVisible;
    });
  }, [products, searchQuery, activeCategory]);

  const ProductCard = ({ product, index }) => {
    const isOutOfStock = product.stock <= 0;
    const cartItem = cartItems.find(item => item.id === product.id);
    const inCartQty = cartItem ? cartItem.quantity : 0;
    const maxReached = inCartQty >= product.stock;

    return (
      <div 
        className="bg-white rounded-3xl overflow-hidden border border-jade/5 hover:border-jade/20 transition-all duration-500 hover:shadow-2xl hover:shadow-jade/5 flex flex-col group relative"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* SKU Label */}
        <div className="absolute top-4 left-4 z-30 bg-jade/10 backdrop-blur-md text-[10px] font-bold px-2 py-1 text-jade rounded-lg uppercase">
          SKU-{product.id.slice(0, 6)}
        </div>

        {inCartQty > 0 && (
          <div className="absolute top-4 right-4 z-20 bg-jade text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 animate-pulse">
            {inCartQty} IN CART
          </div>
        )}

        <div className="relative h-64 bg-morning overflow-hidden flex items-center justify-center border-b border-jade/5">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-20">
              <Settings className="w-16 h-16 animate-spin-slow text-jade" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-jade">No Image</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-jade/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-between items-center z-10">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-jade-dark border border-jade/5 uppercase tracking-wider">
              {product.category || 'Gear'}
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-2 uppercase tracking-wider ${
              isOutOfStock ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-jade/10 text-jade border border-jade/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-jade'}`} />
              {isOutOfStock ? 'Sold Out' : 'Available'}
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1 relative">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-jade-dark group-hover:text-jade transition-colors duration-300 leading-tight tracking-tight">
              {product.name}
            </h3>
            
            {product.description && (
              <p className="text-pebble text-sm mt-4 line-clamp-2 leading-relaxed font-medium">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between pt-6">
            <div>
              <span className="text-[10px] text-pebble uppercase font-bold block tracking-widest mb-1">Price</span>
              <span className="text-2xl font-black text-jade-dark">
                <span className="text-jade text-sm font-bold mr-1">KES</span>
                {product.price.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isOutOfStock ? 'text-red-400' : 'text-pebble'}`}>
                {isOutOfStock ? 'Waitlist' : `Stock: ${product.stock}`}
              </span>
            </div>
          </div>

          <button
            disabled={isOutOfStock || maxReached}
            onClick={() => addToCart(product)}
            className={`mt-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest w-full flex justify-center items-center gap-3 transition-all duration-300 ${
              isOutOfStock 
                ? 'bg-pebble/10 text-pebble cursor-not-allowed'
                : maxReached
                  ? 'bg-jade/10 text-jade cursor-not-allowed'
                  : 'bg-jade hover:bg-jade-dark text-white shadow-xl shadow-jade/20 transform hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isOutOfStock 
              ? 'OUT OF STOCK' 
              : maxReached 
                ? 'LIMIT REACHED' 
                : (
                  <>
                    Add to Cart
                    <Plus className="w-4 h-4" />
                  </>
                )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-morning text-jade-dark flex flex-col font-poppins selection:bg-jade/20">
      <Header shopName={settings?.shopName} />
      <CartDrawer whatsappNumber={settings?.whatsappNumber} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32 border-b border-jade/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-jade/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pebble/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Background Grid Lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#2D5A54 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[2px] w-12 bg-jade" />
              <span className="text-jade text-xs font-bold uppercase tracking-[0.4em]">
                Premium Riders Supply
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-jade-dark leading-[0.95] mb-12 tracking-tight">
              Ride with <br /> <span className="text-jade">Distinction.</span>
            </h1>
            
            <p className="text-pebble-dark text-lg md:text-xl font-medium max-w-2xl mb-12 leading-relaxed">
              Premium motorbike gear and accessories for the modern rider. <br className="hidden md:block" /> 
              Quality parts engineered for safety and performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-1 max-w-lg">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                  <Search className="w-4 h-4 text-pebble" />
                </div>
                <input
                  type="text"
                  placeholder="Search gear catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-jade/10 rounded-2xl py-5 pl-12 pr-6 text-jade-dark placeholder-pebble/50 focus:outline-none focus:ring-4 focus:ring-jade/5 focus:border-jade transition-all text-sm font-medium shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-20 max-w-7xl">
        {/* Filter Section */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-jade/10 pb-12">
          <div>
            <h2 className="text-3xl font-black text-jade-dark tracking-tight mb-2">Curated Collection</h2>
            <p className="text-pebble font-bold text-xs uppercase tracking-widest">Available Items: {products.length}</p>
          </div>

          <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar scroll-smooth">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
                  activeCategory === category
                    ? 'bg-jade text-white border-jade shadow-lg shadow-jade/20'
                    : 'bg-white text-pebble border-jade/10 hover:border-jade hover:text-jade'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white border-2 border-dashed border-jade/10 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-24 h-24 bg-jade/5 flex items-center justify-center mb-10 rounded-3xl border border-jade/5 rotate-12">
              <Search className="w-10 h-10 text-jade -rotate-12" />
            </div>
            <h2 className="text-3xl font-black text-jade-dark tracking-tight mb-4">No results found</h2>
            <p className="text-pebble max-w-sm mx-auto font-medium text-sm mb-12 px-6">
              Try refining your search or exploring a different category.
            </p>
            {(searchQuery || activeCategory !== 'All') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="bg-white border border-jade text-jade hover:bg-jade hover:text-white px-12 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-jade/5 py-20 bg-white text-center mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-jade flex items-center justify-center font-black text-white shadow-xl shadow-jade/20 text-3xl">
              {settings?.shopName ? settings.shopName.charAt(0) : 'R'}
            </div>
            <h2 className="text-jade-dark font-black text-2xl tracking-tight">
              {settings.shopName || "Riders Gear Nairobi"}
            </h2>
            <div className="h-[2px] w-12 bg-jade/20" />
            <p className="text-pebble text-xs font-medium tracking-wider">
              &copy; {new Date().getFullYear()} {settings.shopName || "Riders Gear Nairobi"} • Premium Gear & Accessories
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreFront;
