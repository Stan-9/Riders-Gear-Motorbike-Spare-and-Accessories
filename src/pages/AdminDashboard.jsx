import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  subscribeProducts,
  deleteProduct,
  updateProductStock,
  updateProduct,
  getSettings,
  updateSettings,
  subscribeOrders,
  subscribeCategories,
  updateCategoriesList,
  updateOrderStatus,
  updateOrderPayment,
} from '../firebase/products';
import ConfirmModal from '../components/shared/ConfirmModal';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  LayoutDashboard,
  ShoppingCart,
  Tags,
  AlertCircle,
  Clock,
  ChevronRight,
  MoreVertical,
  Printer
} from 'lucide-react';
import ProductModal from '../components/admin/ProductModal';
import ManualSaleModal from '../components/admin/ManualSaleModal';
import ReceiptModal from '../components/admin/ReceiptModal';

const NavButton = ({ id, icon: Icon, label, badge = null, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`shrink-0 md:w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium group ${
      activeTab === id 
        ? 'bg-jade/10 text-jade md:shadow-[inset_2px_0_0_0_#2D5A54]' 
        : 'text-pebble hover:bg-jade/5 hover:text-jade'
    }`}
  >
    <div className="flex items-center gap-2 md:gap-3">
      <Icon className={`w-5 h-5 ${activeTab === id ? 'text-jade' : 'group-hover:text-jade'}`} />
      <span className="whitespace-nowrap truncate">{label}</span>
    </div>
    {badge !== null && (
      <span className={`ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${activeTab === id ? 'bg-jade text-white' : 'bg-morning-dark text-pebble group-hover:bg-jade/10 group-hover:text-jade'}`}>
        {badge}
      </span>
    )}
  </button>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, analysis, creditors, settings
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settingsData, setSettingsData] = useState({ shopName: '', whatsappNumber: '' });
  
  // Products Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  // Bulk restock state: { [productId]: inputValue }
  const [restockInputs, setRestockInputs] = useState({});

  // Categories State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const openConfirm = (title, message, onConfirm) =>
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  const closeConfirm = () =>
    setConfirmModal(prev => ({ ...prev, isOpen: false, onConfirm: null }));

  // Overview date range filter
  const [dateRange, setDateRange] = useState('all'); // all | today | week | month

  // Orders tab filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');

  // Print receipt state
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubProducts = subscribeProducts((data) => {
      setProducts(data);
      setLoading(false);
    });

    const unsubOrders = subscribeOrders((data) => {
      setOrders(data);
    });

    const unsubCategories = subscribeCategories((data) => {
      setCategories(data);
    });

    const loadSettings = async () => {
      const data = await getSettings();
      setSettingsData(data);
    };
    loadSettings();

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCategories();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id, name, imageUrl) => {
    openConfirm(
      `Delete "${name}"?`,
      'This action cannot be undone. The product will be permanently removed from your inventory.',
      async () => {
        closeConfirm();
        try {
          await deleteProduct(id, imageUrl);
          toast.success(`${name} deleted`);
        } catch {
          toast.error('Failed to delete product');
        }
      }
    );
  };

  const handleStockUpdate = async (id, currentStock, change) => {
    const newStock = Math.max(0, currentStock + change);
    try {
      await updateProductStock(id, newStock);
      toast.success(`Stock updated`);
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleToggleVisibility = async (product) => {
    try {
      const newVisibility = !(product.isVisible ?? true);
      await updateProduct(product.id, product, { ...product, isVisible: newVisibility });
      toast.success(newVisibility ? 'Product visible on storefront' : 'Product hidden from storefront');
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settingsData);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleUpdateOrderPayment = async (orderId, paymentStatus, paymentType) => {
    try {
      await updateOrderPayment(orderId, paymentStatus, paymentType);
      toast.success('Payment status updated');
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      toast.error("Category already exists");
      return;
    }
    const newList = [...categories, newCategoryName.trim()];
    try {
      const res = await updateCategoriesList(newList);
      if (res.success) {
        setNewCategoryName('');
        toast.success("Category added");
      } else {
        toast.error(res.error || "Failed to add category");
      }
    } catch {
      toast.error("Failed to add category");
    }
  };

  const handleDeleteCategory = (name) => {
    openConfirm(
      `Remove "${name}"?`,
      'Existing products will keep this category tag until you manually update them.',
      async () => {
        closeConfirm();
        const newList = categories.filter(c => c !== name);
        try {
          const res = await updateCategoriesList(newList);
          if (res.success) {
            toast.success('Category removed');
          } else {
            toast.error(res.error || 'Failed to remove category');
          }
        } catch {
          toast.error('Failed to remove category');
        }
      }
    );
  };

  // Bulk restock: set exact stock from the restock input
  const handleBulkRestock = async (product) => {
    const inputVal = parseInt(restockInputs[product.id] || '0', 10);
    if (isNaN(inputVal) || inputVal < 1) {
      toast.error('Enter a valid quantity to add');
      return;
    }
    const newStock = product.stock + inputVal;
    try {
      await updateProductStock(product.id, newStock);
      setRestockInputs(prev => ({ ...prev, [product.id]: '' }));
      toast.success(`Restocked +${inputVal} units (now ${newStock})`);
    } catch {
      toast.error('Failed to update stock');
    }
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Category", "Buying Price", "Selling Price", "Stock", "Total Value (Retail)"];
    const rows = products.map(p => [
      p.name,
      p.category,
      p.buyingPrice || 0,
      p.price,
      p.stock,
      p.price * p.stock
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Riders_Gear_Inventory_${new Date().toLocaleDateString()}.csv`);
    a.click();
    toast.success("Inventory exported!");
  };

  const handlePrintReceipt = (order) => {
    setSelectedOrderForReceipt(order);
    setIsReceiptModalOpen(true);
  };

  // Date-range helper
  const filterByDateRange = useCallback((ordersList) => {
    if (dateRange === 'all') return ordersList;
    const now = new Date();
    return ordersList.filter(o => {
      const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      if (dateRange === 'today') {
        return d.toDateString() === now.toDateString();
      }
      if (dateRange === 'week') {
        const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (dateRange === 'month') {
        const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);
        return d >= monthAgo;
      }
      return true;
    });
  }, [dateRange]);

  // Derived state
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock <= 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;

    // Inventory Valuation
    const inventoryValueRetail = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const inventoryValueCost = products.reduce((acc, p) => acc + ((p.buyingPrice || 0) * p.stock), 0);
    const potentialProfit = inventoryValueRetail - inventoryValueCost;
    const rangedOrders = orders;
    const completedOrders = rangedOrders.filter(o => o.status === 'completed');
    const actualSales = completedOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const actualProfit = completedOrders.reduce((acc, o) => {
      const orderProfit = (o.items || []).reduce((iAcc, item) => {
        return iAcc + ((item.price - (item.buyingPrice || 0)) * item.quantity);
      }, 0);
      return acc + orderProfit;
    }, 0);

    // Most/Least Sold
    const itemSales = {};
    completedOrders.forEach(o => {
      (o.items || []).forEach(item => {
        itemSales[item.name] = (itemSales[item.name] || 0) + (item.quantity || 1);
      });
    });
    const sortedSales = Object.entries(itemSales).sort((a, b) => b[1] - a[1]);
    const topPerformer = sortedSales[0] || ['None', 0];
    const leastPerformer = sortedSales.length > 0 ? sortedSales[sortedSales.length - 1] : ['None', 0];

    return {
      total, inStock, outOfStock, lowStock,
      totalValue: inventoryValueRetail,
      inventoryCost: inventoryValueCost,
      potentialProfit,
      actualSales,
      actualProfit,
      topPerformer,
      leastPerformer
    };
  }, [products, orders]);

  const analysisStats = useMemo(() => {
    const now = new Date();
    const last7Days = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    const last30Days = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const getStats = (ordersList) => {
      const completed = ordersList.filter(o => o.status === 'completed');
      const revenue = completed.reduce((acc, o) => acc + (o.total || 0), 0);
      const profit = completed.reduce((acc, o) => {
        const orderProfit = (o.items || []).reduce((iAcc, item) => {
          return iAcc + ((item.price - (item.buyingPrice || 0)) * item.quantity);
        }, 0);
        return acc + orderProfit;
      }, 0);
      return { revenue, profit, count: completed.length };
    };

    const weekOrders = orders.filter(o => {
      const date = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      return date >= last7Days;
    });

    const monthOrders = orders.filter(o => {
      const date = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      return date >= last30Days;
    });

    return {
      weekly: getStats(weekOrders),
      monthly: getStats(monthOrders)
    };
  }, [orders]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-morning text-jade-dark flex flex-col md:flex-row font-poppins selection:bg-jade/20">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white md:border-r border-b border-jade/5 flex flex-col z-20 sticky top-0 md:h-screen shrink-0 shadow-sm">
        <div className="p-4 md:p-6 border-b border-jade/5 flex justify-between items-center">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-jade flex items-center justify-center font-bold text-white shadow-lg shadow-jade/10">
              R
            </div>
            <div>
              <h1 className="font-bold text-lg text-jade-dark leading-tight">Riders Gear</h1>
              <p className="text-[10px] text-pebble font-bold uppercase tracking-widest">Admin Control</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center justify-center p-2 rounded-xl text-red-500 hover:bg-red-50 transition border border-red-100"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex md:flex-col p-2 md:p-4 gap-2 md:gap-0 md:space-y-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:flex-1">
          <NavButton id="overview" icon={LayoutDashboard} label="Overview" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavButton id="products" icon={Package} label="Inventory" badge={products.length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavButton id="orders" icon={ShoppingCart} label="Orders Log" badge={orders.length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavButton id="analysis" icon={TrendingUp} label="Business Analysis" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavButton 
            id="creditors" 
            icon={TrendingDown} 
            label="Creditors" 
            badge={orders.filter(o => o.paymentType === 'Credit' && o.paymentStatus === 'Unpaid').length} 
            activeTab={activeTab} setActiveTab={setActiveTab}
          />
          <NavButton id="settings" icon={Settings} label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>

        <div className="hidden md:block p-4 border-t border-jade/5 bg-morning-dark/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition font-bold uppercase text-[10px] tracking-widest border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden min-h-screen">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-jade-dark mb-4 border-b border-jade/5 pb-4 flex items-center gap-3">
              Store Performance
              <LayoutDashboard className="w-6 h-6 text-jade opacity-50" />
            </h2>


            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="col-span-1 lg:col-span-4 bg-gradient-to-r from-jade/5 to-transparent border border-jade/5 p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="border-b md:border-b-0 md:border-r border-jade/5 pb-6 md:pb-0 md:pr-8">
                    <span className="text-jade font-bold uppercase tracking-widest text-[10px] mb-2 block">Warehouse Value (Cost)</span>
                    <h3 className="text-3xl font-black text-jade-dark tracking-tight">
                      <span className="text-jade text-lg mr-2 font-bold italic">KES</span>
                      {stats.inventoryCost.toLocaleString()}
                    </h3>
                    <p className="text-pebble mt-1 text-[10px] font-bold uppercase tracking-wider">Total investment in inventory</p>
                  </div>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-5 text-jade">
                  <TrendingUp className="w-64 h-64 rotate-12" />
                </div>
              </div>

              {[
                { label: 'Total Revenue', value: stats.actualSales, icon: ShoppingCart, color: 'text-jade', bg: 'bg-jade/5' },
                { label: 'Most Sold Item', value: stats.topPerformer[0], sub: `${stats.topPerformer[1]} units`, icon: TrendingUp, color: 'text-jade', bg: 'bg-jade/5' },
                { label: 'Least Sold Item', value: stats.leastPerformer[0], sub: `${stats.leastPerformer[1]} units`, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50/50' },
                { label: 'Low Stock Level', value: stats.lowStock, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-jade/5 p-6 rounded-2xl relative overflow-hidden group hover:border-jade/20 transition-all shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-jade-dark tabular-nums truncate max-w-[120px]">{stat.value.toLocaleString()}</h3>
                      <p className="text-[10px] text-pebble font-bold uppercase tracking-widest">{stat.label}</p>
                      {stat.sub && <p className="text-[9px] text-pebble font-medium italic mt-0.5">{stat.sub}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-jade/5 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-jade-dark flex items-center gap-2">
                    <Clock className="w-5 h-5 text-jade" />
                    Latest Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-jade text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-morning rounded-xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 opacity-30 italic text-sm text-pebble">No orders logged yet</div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 4).map(order => (
                      <div key={order.id} className="flex items-center gap-4 p-4 rounded-2xl bg-morning/50 border border-jade/5 hover:border-jade/10 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-pebble group-hover:bg-jade group-hover:text-white transition-colors shadow-sm">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-pebble font-bold">{new Date(order.createdAt?.toDate()).toLocaleDateString()}</p>
                          <h4 className="text-sm font-bold text-jade-dark truncate">{order.customerName || `${order.items.length} items ordered`}</h4>
                          <p className="text-[10px] text-pebble truncate">{order.items.map(i => i.name).join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-jade-dark italic">KES {order.total?.toLocaleString() || '0'}</p>
                          <p className={`text-[10px] uppercase font-bold ${order.status === 'completed' ? 'text-jade' : order.status === 'pending' ? 'text-amber-600' : 'text-red-500'}`}>
                            {order.status || 'pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-jade/5 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-jade-dark flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Low Stock Alert
                  </h3>
                </div>
                <div className="space-y-4">
                  {products.filter(p => p.stock > 0 && p.stock < 5).slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm overflow-hidden shrink-0 border border-jade/5">
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-jade-dark truncate">{p.name}</h4>
                        <div className={`text-[10px] font-bold uppercase mt-1 text-amber-600`}>
                           Only {p.stock} units left
                        </div>
                      </div>
                      <button onClick={() => handleEditProduct(p)} className="p-2 bg-white rounded-lg hover:bg-jade/5 transition-colors border border-jade/5 shadow-sm">
                        <Plus className="w-4 h-4 text-jade" />
                      </button>
                    </div>
                  ))}
                  {products.filter(p => p.stock > 0 && p.stock < 5).length === 0 && (
                    <div className="text-center py-10 opacity-30 italic text-sm text-pebble">Inventory levels are healthy</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:h-[calc(100vh-80px)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-3xl font-black text-jade-dark">Inventory Management</h2>
              
              <div className="flex gap-3">
                <button
                  onClick={handleExportCSV}
                  className="bg-white hover:bg-morning text-pebble font-bold py-2.5 px-5 rounded-xl border border-jade/5 transition flex items-center gap-2 shadow-sm"
                >
                  Export CSV
                </button>
                <button
                  onClick={handleAddProduct}
                  className="bg-jade hover:bg-jade-dark text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-jade/20 transition flex items-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add Product
                </button>
              </div>
            </div>

            <div className="mb-6 relative max-w-md shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pebble w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-jade/5 rounded-xl pl-10 pr-4 py-3 text-jade-dark focus:outline-none focus:border-jade transition focus:ring-1 focus:ring-jade/20 shadow-sm"
              />
            </div>

            <div className="bg-white border border-jade/5 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm">
              <div className="overflow-x-auto flex-1 md:h-0">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-900/90 backdrop-blur sticky top-0 z-10 font-bold border-b border-gray-800 text-gray-400 text-sm tracking-wider uppercase">
                    <tr>
                      <th className="p-4 w-16 text-center">Image</th>
                      <th className="p-4">Name/Category</th>
                      <th className="p-4">Cost (Buying)</th>
                      <th className="p-4">Retail (Selling)</th>
                      <th className="p-4">Total Profit (Est)</th>
                      <th className="p-4 w-40">Stock Check</th>
                      <th className="p-4 w-36">Restock</th>
                      <th className="p-4 text-center">Storefront</th>
                      <th className="p-4 text-center w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-jade/5">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="p-4"><div className="w-12 h-12 bg-morning-dark rounded-lg"></div></td>
                          <td className="p-4"><div className="h-4 bg-morning-dark rounded w-3/4"></div></td>
                          <td className="p-4"><div className="h-4 bg-morning-dark rounded w-1/2"></div></td>
                          <td className="p-4"><div className="h-4 bg-morning-dark rounded w-1/3"></div></td>
                          <td className="p-4"><div className="h-4 bg-morning-dark rounded w-1/2"></div></td>
                          <td className="p-4"><div className="h-8 bg-morning-dark rounded w-full"></div></td>
                          <td className="p-4"><div className="h-8 bg-morning-dark rounded w-full"></div></td>
                        </tr>
                      ))
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-pebble">
                          No products found matching your search.
                        </td>
                      </tr>
                    ) : (
                       filteredProducts.map((p) => (
                        <tr key={p.id} className={`transition group border-b border-jade/5 hover:bg-morning/50 ${p.stock > 0 && p.stock < 5 ? 'bg-amber-50/30' : ''}`}>
                          <td className="p-4">
                            <div className="w-12 h-12 rounded-lg bg-white border border-jade/5 overflow-hidden flex items-center justify-center relative shadow-sm">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                              ) : (
                                <span className="text-[10px] text-pebble">No img</span>
                              )}
                              {p.stock > 0 && p.stock < 5 && (
                                <div className="absolute top-0 right-0 p-0.5 bg-amber-500 rounded-bl-lg animate-pulse">
                                  <AlertCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-jade-dark font-bold truncate max-w-[180px]">{p.name}</span>
                              <span className="text-[10px] text-pebble font-bold uppercase tracking-widest">{p.category}</span>
                            </div>
                          </td>
                          <td className="p-4 tabular-nums text-pebble font-medium">
                            KES {(p.buyingPrice || 0).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className="tabular-nums text-jade font-black italic whitespace-nowrap">
                              KES {p.price.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              {p.price > 0 && (p.buyingPrice || 0) > 0 ? (
                                <>
                                  <span className={`tabular-nums font-black whitespace-nowrap ${p.price > (p.buyingPrice || 0) ? 'text-jade' : 'text-red-500'}`}>
                                    KES {((p.price - (p.buyingPrice || 0)) * p.stock).toLocaleString()}
                                  </span>
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${p.price > (p.buyingPrice || 0) ? 'text-jade/70' : 'text-red-500/70'}`}>
                                    {(((p.price - (p.buyingPrice || 0)) / p.price) * 100).toFixed(1)}% Margin
                                  </span>
                                </>
                              ) : (
                                <span className="text-pebble text-sm italic">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={`flex items-center gap-2 border rounded-xl p-1 w-max transition-colors ${p.stock > 0 && p.stock < 5 ? 'bg-amber-50 border-amber-200' : 'bg-white border-jade/5 shadow-sm'}`}>
                              <button 
                                onClick={() => handleStockUpdate(p.id, p.stock, -1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-morning text-pebble hover:text-jade hover:bg-jade/5 transition"
                              >
                                -
                              </button>
                              <input 
                                type="number"
                                value={p.stock}
                                onChange={(e) => handleStockUpdate(p.id, 0, parseInt(e.target.value) || 0)}
                                className={`w-12 text-center font-bold text-sm bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${p.stock <= 0 ? 'text-red-500' : p.stock < 5 ? 'text-amber-600' : 'text-jade-dark'}`}
                              />
                              <button 
                                onClick={() => handleStockUpdate(p.id, p.stock, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-morning text-pebble hover:text-jade hover:bg-jade/5 transition"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                placeholder="+qty"
                                value={restockInputs[p.id] || ''}
                                onChange={e => setRestockInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                                className="w-16 text-center text-sm bg-white border border-jade/5 rounded-lg py-1 focus:outline-none focus:border-jade text-jade-dark shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                onClick={() => handleBulkRestock(p)}
                                className="px-2 py-1 bg-jade/10 text-jade border border-jade/20 rounded-lg text-[10px] font-bold uppercase hover:bg-jade hover:text-white transition"
                              >
                                Add
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleToggleVisibility(p)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                p.isVisible !== false 
                                  ? 'bg-jade/10 text-jade border border-jade/20' 
                                  : 'bg-morning text-pebble border border-jade/5'
                              }`}
                            >
                              {p.isVisible !== false ? 'Visible' : 'Hidden'}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleEditProduct(p)}
                                className="p-2 bg-white text-pebble hover:text-jade hover:bg-jade/5 border border-jade/5 rounded-lg transition shadow-sm"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, p.name, p.imageUrl)}
                                className="p-2 bg-white text-pebble hover:text-red-500 hover:bg-red-50 border border-jade/5 rounded-lg transition shadow-sm"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS LOG TAB */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:h-[calc(100vh-80px)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-3xl font-black text-jade-dark border-b border-jade/5 pb-4">Customer Orders Log</h2>
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="bg-jade hover:bg-jade-dark text-white font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-jade/20 transition flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Record Physical Sale
              </button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pebble w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer or item..."
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  className="w-full bg-white border border-jade/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                />
              </div>
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-jade/5 rounded-xl px-3 py-2.5 text-sm text-pebble focus:outline-none focus:border-jade shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={orderPaymentFilter}
                onChange={e => setOrderPaymentFilter(e.target.value)}
                className="bg-white border border-jade/5 rounded-xl px-3 py-2.5 text-sm text-pebble focus:outline-none focus:border-jade shadow-sm"
              >
                <option value="all">All Payments</option>
                <option value="Cash">Cash / Mpesa</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            
            <div className="bg-white border border-jade/5 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm">
              <div className="overflow-x-auto flex-1 md:h-0">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-morning/90 backdrop-blur sticky top-0 z-10 font-bold border-b border-jade/5 text-pebble text-[10px] tracking-widest uppercase">
                    <tr>
                      <th className="p-4">Time</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Grand Total</th>
                      <th className="p-4">Action</th>
                      <th className="p-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-jade/5">
                    {(() => {
                      const filtered = orders.filter(o => {
                        const matchSearch = !orderSearch ||
                          (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
                          (o.items || []).some(i => i.name?.toLowerCase().includes(orderSearch.toLowerCase()));
                        const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                        const matchPayment = orderPaymentFilter === 'all' || o.paymentType === orderPaymentFilter;
                        return matchSearch && matchStatus && matchPayment;
                      });
                      if (filtered.length === 0) return (
                        <tr><td colSpan="6" className="p-12 text-center text-pebble italic">No orders match your filters.</td></tr>
                      );
                      return filtered.map((order) => (
                        <tr key={order.id} className="hover:bg-morning/50 transition group">
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-jade-dark font-bold">
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Processing...'}
                              </span>
                              <span className="text-xs text-pebble">
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleTimeString() : ''}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-jade-dark">{order.customerName || '—'}</span>
                              {order.phone && <span className="text-[10px] text-pebble">{order.phone}</span>}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="text-xs text-pebble font-medium">
                                  <span className="text-jade font-bold">{(item.quantity || 1)}x</span> {item.name || 'Unknown Item'}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-black text-jade-dark italic">KES {(order.total || 0).toLocaleString()}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-[10px] font-bold uppercase px-2 py-1 rounded border transition ${
                                  order.status === 'completed' ? 'bg-jade/10 border-jade/20 text-jade' :
                                  order.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-500' :
                                  'bg-amber-50 border-amber-100 text-amber-600'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              <select
                                value={order.paymentType || 'Cash'}
                                onChange={(e) => {
                                  const newType = e.target.value;
                                  handleUpdateOrderPayment(order.id, newType === 'Credit' ? 'Unpaid' : 'Paid', newType);
                                }}
                                className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-morning border border-jade/5 text-pebble"
                              >
                                <option value="Cash">Cash/Mpesa</option>
                                <option value="Credit">Credit</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handlePrintReceipt(order)}
                              className="p-2 bg-white text-pebble hover:text-jade hover:bg-jade/5 border border-jade/5 hover:border-jade/20 rounded-lg transition shadow-sm"
                              title="Print Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-jade-dark mb-8 border-b border-jade/5 pb-4 flex items-center gap-3">
              Business Performance Analysis
              <TrendingUp className="w-6 h-6 text-jade opacity-50" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Weekly Stats */}
              <div className="bg-white border border-jade/5 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-jade/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-jade/10 transition-colors" />
                <span className="inline-block px-3 py-1 bg-jade/10 text-jade text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">Last 7 Days</span>
                <h3 className="text-xl font-bold text-pebble mb-8">Weekly Summary</h3>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pebble mb-1">Total Revenue</p>
                    <p className="text-4xl font-black text-jade-dark tracking-tighter">
                      <span className="text-jade text-lg mr-2 font-medium italic">KES</span>
                      {analysisStats.weekly.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jade mb-1">Total Profit</p>
                    <p className="text-4xl font-black text-jade-dark tracking-tighter">
                      <span className="text-jade text-lg mr-2 font-medium italic">KES</span>
                      {analysisStats.weekly.profit.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-jade/5 flex justify-between items-center text-xs font-bold text-pebble">
                    <span>Total Sales Made</span>
                    <span className="text-jade-dark">{analysisStats.weekly.count} orders</span>
                  </div>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="bg-white border border-jade/5 rounded-3xl p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-jade/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-jade/10 transition-colors" />
                <span className="inline-block px-3 py-1 bg-jade/10 text-jade text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">Last 30 Days</span>
                <h3 className="text-xl font-bold text-pebble mb-8">Monthly Summary</h3>
                
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pebble mb-1">Total Revenue</p>
                    <p className="text-4xl font-black text-jade-dark tracking-tighter">
                      <span className="text-jade text-lg mr-2 font-medium italic">KES</span>
                      {analysisStats.monthly.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-jade mb-1">Total Profit</p>
                    <p className="text-4xl font-black text-jade-dark tracking-tighter">
                      <span className="text-jade text-lg mr-2 font-medium italic">KES</span>
                      {analysisStats.monthly.profit.toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-jade/5 flex justify-between items-center text-xs font-bold text-pebble">
                    <span>Total Sales Made</span>
                    <span className="text-jade-dark">{analysisStats.monthly.count} orders</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-morning/30 border border-jade/5 rounded-2xl p-6">
               <p className="text-pebble text-xs italic">
                 Note: Profit is calculated based on the buying price recorded at the time of each product entry.
                 Only completed orders are included in these statistics.
               </p>
            </div>
          </div>
        )}

        {/* CREDITORS TAB */}
        {activeTab === 'creditors' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:h-[calc(100vh-80px)]">
            <h2 className="text-3xl font-black text-jade-dark mb-8 border-b border-jade/5 pb-4 flex items-center gap-3">
              Creditors Tracker
              <TrendingDown className="w-6 h-6 text-red-500 opacity-50" />
            </h2>
            
            <div className="bg-white border border-jade/5 rounded-2xl overflow-hidden flex-1 flex flex-col shadow-sm">
              <div className="overflow-x-auto flex-1 md:h-0">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-morning/90 backdrop-blur sticky top-0 z-10 font-bold border-b border-jade/5 text-pebble text-[10px] tracking-widest uppercase">
                    <tr>
                      <th className="p-4">Customer/Time</th>
                      <th className="p-4">Amount Owed</th>
                      <th className="p-4">Credit Age</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-jade/5">
                    {orders.filter(o => o.paymentType === 'Credit' && o.paymentStatus === 'Unpaid').length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-pebble italic">
                          No outstanding debts found. Good job!
                        </td>
                      </tr>
                    ) : (
                      orders.filter(o => o.paymentType === 'Credit' && o.paymentStatus === 'Unpaid').map((order) => {
                        const ageInDays = Math.floor((new Date() - order.createdAt?.toDate()) / (1000 * 60 * 60 * 24));
                        const isOverdue = ageInDays >= 2;
                        
                        return (
                          <tr key={order.id} className={`transition group ${isOverdue ? 'bg-red-50' : 'hover:bg-morning/50'}`}>
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-jade-dark font-bold">{order.customerName || 'WhatsApp Customer'}</span>
                                <span className="text-[10px] text-pebble">{new Date(order.createdAt?.toDate()).toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`font-black italic ${isOverdue ? 'text-red-600' : 'text-jade-dark'}`}>KES {order.total.toLocaleString()}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${isOverdue ? 'bg-red-500 text-white animate-pulse' : 'bg-morning text-pebble'}`}>
                                  {ageInDays} Days Old
                                </span>
                                {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" title="Overdue Alert!" />}
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => handleUpdateOrderPayment(order.id, 'Paid', 'Credit')}
                                className="px-4 py-2 bg-jade text-white rounded-xl text-xs font-bold uppercase hover:bg-jade-dark transition shadow-lg shadow-jade/20"
                              >
                                Mark as Paid
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h2 className="text-3xl font-black text-jade-dark mb-8 border-b border-jade/5 pb-4">Store Settings</h2>

            <form onSubmit={handleSaveSettings} className="bg-white border border-jade/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <label className="block text-sm font-bold text-pebble mb-2">Display Shop Name</label>
                <input
                  type="text"
                  value={settingsData.shopName}
                  onChange={(e) => setSettingsData({...settingsData, shopName: e.target.value})}
                  className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-3 text-jade-dark focus:outline-none focus:border-jade focus:ring-1 focus:ring-jade/20 transition-all font-medium"
                  placeholder="e.g. Riders Gear Nairobi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-pebble mb-2">WhatsApp Number</label>
                <p className="text-xs text-pebble mb-3 leading-relaxed">
                  Include the country code without the '+' sign. For Example: <span className="text-jade font-mono">254712345678</span>.
                  Customer orders will be sent here directly.
                </p>
                <input
                  type="text"
                  value={settingsData.whatsappNumber}
                  onChange={(e) => setSettingsData({...settingsData, whatsappNumber: e.target.value})}
                  className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-3 text-jade-dark focus:outline-none focus:border-jade focus:ring-1 focus:ring-jade/20 transition-all font-mono"
                  placeholder="254700000000"
                  required
                />
              </div>

              <div className="pt-6 mt-6 border-t border-jade/5">
                <label className="block text-sm font-bold text-pebble mb-4 flex items-center gap-2">
                  <Tags className="w-4 h-4 text-jade" />
                  Product Categories
                </label>
                
                <div className="flex flex-wrap gap-2 mb-6 min-h-12 bg-morning p-4 rounded-2xl border border-jade/5">
                  {categories.map((cat, i) => (
                    <div key={i} className="group flex items-center gap-2 bg-white text-jade-dark px-4 py-1.5 rounded-full text-xs font-bold border border-jade/5 hover:border-jade transition-colors shadow-sm">
                      {cat}
                      <button 
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-pebble hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && <span className="text-pebble text-xs italic">No custom categories yet. Add some below!</span>}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name..."
                    className="flex-1 bg-morning border border-jade/5 rounded-xl px-4 py-3 text-jade-dark focus:outline-none focus:ring-1 focus:ring-jade/20 text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-6 bg-white text-jade font-bold rounded-xl hover:bg-jade/5 border border-jade/5 transition shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-jade/5">
                <button
                  type="submit"
                  className="bg-jade hover:bg-jade-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-jade/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Settings className="w-5 h-5 animate-[spin_3s_linear_infinite]" />
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Modals */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
      />

      <ManualSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        products={products}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        order={selectedOrderForReceipt}
        settings={settingsData}
      />
    </div>
  );
};

export default AdminDashboard;
