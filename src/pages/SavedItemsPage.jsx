import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { featuredProducts } from '../data';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import { buildApiUrl } from '../config/api';

export default function SavedItemsPage() {
  const { savedItems, toggleSaved } = useAppContext();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSavedProducts() {
      if (savedItems.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // Fetch each saved product from the API, fall back to local data if needed
      const results = await Promise.all(
        savedItems.map(async (id) => {
          try {
            const res = await fetch(buildApiUrl(`products/${encodeURIComponent(id)}`));
            const data = await res.json();
            if (res.ok && data.success && data.data) return data.data;
          } catch (_) {
            // ignore
          }
          // fallback to local static data
          return featuredProducts.find((p) => p.id === id) || null;
        })
      );

      if (isMounted) {
        setProducts(results.filter(Boolean));
        setIsLoading(false);
      }
    }

    fetchSavedProducts();
    return () => { isMounted = false; };
  }, [savedItems]);

  return (
    <div className="min-h-screen pt-32 pb-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Saved Items"
          subtitle="Your Wishlist"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-medical-500 animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
            {products.map((product, index) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} index={index} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSaved(product.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm mt-12"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Save items you're interested in to easily find them later and add them to your enquiry.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-medical-600 text-white font-semibold rounded-xl hover:bg-medical-700 transition-all shadow-lg shadow-medical-500/25"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
