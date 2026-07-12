import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import StoreFront from './pages/StoreFront';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import Business from './pages/Business';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

// The single authorised admin email — set in .env as VITE_ADMIN_EMAIL
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

const Spinner = () => (
  <div className="min-h-screen bg-morning text-jade-dark flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-jade shadow-xl shadow-jade/10" />
  </div>
);

// Admin route — only allows the specific admin email
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Spinner />;

  // Must be logged in AND be the designated admin email
  if (!user) return <Navigate to="/admin/login" replace />;
  if (ADMIN_EMAIL && user.email !== ADMIN_EMAIL) {
    auth.signOut();
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};



function App() {
  return (
    <ErrorBoundary>
      <Router>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'font-bold uppercase tracking-widest text-[10px]',
              style: { 
                background: '#113D3D', 
                color: '#F9FAFB',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '16px 24px'
              },
              success: { 
                iconTheme: { primary: '#113D3D', secondary: '#F9FAFB' },
                style: { background: '#F9FAFB', color: '#113D3D', border: '1px solid #113D3D' }
              },
            }}
          />
          <Routes>
            <Route path="/" element={<StoreFront />} />
            <Route path="/business" element={<Business />} />
            <Route path="/about" element={<About />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
