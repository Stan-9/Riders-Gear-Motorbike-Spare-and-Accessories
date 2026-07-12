import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = ({ shopName }) => {
  const displayShopName = shopName || "Riders Gear Nairobi";
  
  return (
    <footer className="border-t border-jade/5 bg-white pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-jade flex items-center justify-center font-black text-white shadow-xl shadow-jade/20 text-2xl">
                {displayShopName.charAt(0)}
              </div>
              <h2 className="text-jade-dark font-black text-xl tracking-tight leading-none">
                {displayShopName}
              </h2>
            </div>
            <p className="text-pebble text-sm font-medium leading-relaxed">
              Premium motorbike gear and accessories for the modern rider. Quality parts engineered for safety and performance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-jade-dark font-black tracking-tight text-lg">Quick Links</h3>
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-pebble hover:text-jade font-medium text-sm transition-colors">Store</Link>
              <Link to="/about" className="text-pebble hover:text-jade font-medium text-sm transition-colors">About Us</Link>
              <Link to="/business" className="text-pebble hover:text-jade font-medium text-sm transition-colors">Business & Wholesale</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="text-jade-dark font-black tracking-tight text-lg">Contact Us</h3>
            <div className="flex flex-col gap-4">
              <a href="mailto:info@ridersgearnairobi.com" className="flex items-center gap-3 text-pebble hover:text-jade font-medium text-sm transition-colors group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                info@ridersgearnairobi.com
              </a>
              <a href="tel:+254716778794" className="flex items-center gap-3 text-pebble hover:text-jade font-medium text-sm transition-colors group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                +254 716 778 794
              </a>
              <div className="flex items-start gap-3 text-pebble font-medium text-sm">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6">
            <h3 className="text-jade-dark font-black tracking-tight text-lg">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-morning flex items-center justify-center text-pebble hover:bg-jade hover:text-white transition-all transform hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-morning flex items-center justify-center text-pebble hover:bg-jade hover:text-white transition-all transform hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-morning flex items-center justify-center text-pebble hover:bg-jade hover:text-white transition-all transform hover:-translate-y-1">
                {/* TikTok SVG Icon since Lucide might not have it or it's not standard */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-jade/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-pebble text-xs font-medium tracking-wider">
            &copy; {new Date().getFullYear()} {displayShopName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-pebble hover:text-jade text-xs font-medium transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-pebble hover:text-jade text-xs font-medium transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
