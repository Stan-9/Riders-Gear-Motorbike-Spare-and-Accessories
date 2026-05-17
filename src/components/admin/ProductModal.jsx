import { useState, useEffect } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { addProduct, updateProduct } from '../../firebase/products';
import toast from 'react-hot-toast';

const ProductModal = ({ isOpen, onClose, product = null, categories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    buyingPrice: '',
    minSellingPrice: '',
    stock: '',
    description: '',
    isVisible: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        buyingPrice: product.buyingPrice || '',
        minSellingPrice: product.minSellingPrice || '',
        stock: product.stock || '',
        description: product.description || '',
        isVisible: product.isVisible ?? true,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      setFormData({ name: '', category: '', price: '', buyingPrice: '', minSellingPrice: '', stock: '', description: '', imageUrl: '', isVisible: true });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [product, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // create preview url
      setImagePreview(URL.createObjectURL(file));
      // clear the manual image URL when a file is picked
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url || null);
    setImageFile(null); // clear file when URL is manually entered
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price || formData.stock === '') {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Use the manual URL if provided, otherwise the file will be uploaded
      const finalFormData = { ...formData };
      
      if (product) {
        // Edit mode
        await updateProduct(product.id, product, finalFormData, imageFile);
        toast.success("Product updated successfully");
      } else {
        // Add mode
        await addProduct(finalFormData, imageFile);
        toast.success("Product added successfully");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-dark/60 backdrop-blur-sm">
      <div className="bg-white border border-jade/5 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-6 py-4 border-b border-jade/5 flex justify-between items-center">
          <h2 className="text-xl font-black text-jade-dark">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="text-pebble hover:text-jade-dark p-2 rounded-full hover:bg-morning transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Image Upload Area */}
            <div className="w-full md:w-1/3 space-y-3">
              <label className="block text-sm font-bold text-pebble">Product Image</label>
              
              <div 
                className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden h-48 relative transition ${
                  imagePreview ? 'border-jade/10 bg-morning' : 'border-jade/10 hover:border-jade/30 bg-morning/50'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-jade-dark/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                      <span className="text-white font-bold text-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center p-4 text-center">
                    <Upload className="w-8 h-8 text-pebble mb-2" />
                    <span className="text-sm font-bold text-pebble">Click to upload</span>
                    <span className="text-xs text-pebble mt-1 opacity-60">PNG, JPG up to 5MB</span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <span className="text-[10px] text-pebble uppercase font-black">OR</span>
                </div>
                <input 
                  type="text"
                  placeholder="Paste Image URL here..."
                  value={formData.imageUrl || ''}
                  onChange={handleImageUrlChange}
                  className="w-full bg-morning border border-jade/5 rounded-xl pl-10 pr-4 py-2 text-xs text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                />
              </div>
            </div>

            {/* Inputs Area */}
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <label className="block text-sm font-bold text-pebble mb-1">Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                  placeholder="e.g. Brake Pads set"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-pebble mb-1">Category *</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition appearance-none shadow-sm"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                    {categories.length === 0 && (
                      <option disabled>No categories found. Add them in Settings!</option>
                    )}
                  </select>
                </div>
                
                 <div>
                  <label className="block text-sm font-bold text-pebble mb-1">Buying Price (Cost) *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.buyingPrice}
                    onChange={e => setFormData({...formData, buyingPrice: e.target.value})}
                    className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                    placeholder="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-pebble mb-1">Selling Price (Retail) *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-pebble mb-1">Min Sell Price (Manager Limit) *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.minSellingPrice}
                    onChange={e => setFormData({...formData, minSellingPrice: e.target.value})}
                    className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-pebble mb-1">Stock Quantity *</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition shadow-sm"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-pebble mb-1">Description (Optional)</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-morning border border-jade/5 rounded-xl px-4 py-2 text-jade-dark focus:outline-none focus:border-jade transition h-24 resize-none shadow-sm"
              placeholder="Add product details here..."
            />
          </div>

          <div className="flex items-center gap-3 bg-morning p-4 rounded-2xl border border-jade/5 shadow-sm">
            <input 
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={e => setFormData({...formData, isVisible: e.target.checked})}
              className="w-5 h-5 accent-jade bg-white border-jade/5 rounded focus:ring-jade/20"
            />
            <label htmlFor="isVisible" className="flex flex-col cursor-pointer">
              <span className="text-sm font-bold text-jade-dark">Visible to Customers</span>
              <span className="text-[10px] text-pebble uppercase font-bold tracking-widest opacity-70">
                If off, this item will be hidden from the storefront
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-jade/5 flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur py-4 px-1">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-pebble hover:bg-morning transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2.5 bg-jade hover:bg-jade-dark rounded-xl font-bold text-white shadow-lg shadow-jade/20 transition flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
