import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Filter, Grid3X3, LayoutList, Search, SlidersHorizontal, X } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import { featuredProducts } from '../data';
import { buildApiUrl } from '../config/api';

const defaultBodyParts = ['Knee', 'Ankle', 'Wrist', 'Back', 'Shoulder', 'Elbow', 'Neck', 'Hip'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [bodyPartOptions, setBodyPartOptions] = useState(defaultBodyParts);
  const [bodyParts, setBodyParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    bodyPart: [],
    category: [],
    supportLevel: [],
    usage: [],
    badge: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await fetch(buildApiUrl('categories'));
        const data = await response.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const response = await fetch(buildApiUrl('products'));
        const data = await response.json();

        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Unable to load products.');
        }

        if (isMounted) {
          setProducts(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setProducts(featuredProducts);
          setLoadError(err.message || 'Unable to load products.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchBodyParts = async () => {
      try {
        const response = await fetch(buildApiUrl('body-parts'));
        const data = await response.json();

        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Unable to load body parts.');
        }

        if (isMounted) {
          setBodyParts(data.data);
          const names = data.data.map((item) => item.name).filter(Boolean);
          if (names.length > 0) {
            setBodyPartOptions(names);
          }
        }
      } catch (err) {
        // Keep defaults on failure.
      }
    };

    fetchBodyParts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchActivities = async () => {
      try {
        const response = await fetch(buildApiUrl('activities'));
        const data = await response.json();

        if (isMounted && data.success && Array.isArray(data.data)) {
          setActivities(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      }
    };

    fetchActivities();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bodyPartParam = params.get('bodyPart');
    const usageParam = params.get('usage');
    const categoryParam = params.get('category');
    const badgeParam = params.get('badge');
    const searchParam = params.get('search');

    if (searchParam) setSearchQuery(searchParam);

    setSelectedFilters({
      bodyPart: bodyPartParam ? [bodyPartParam] : [],
      category: categoryParam ? [categoryParam] : [],
      supportLevel: [],
      usage: usageParam ? [usageParam] : [],
      badge: badgeParam ? [badgeParam] : [],
    });
  }, [location]);

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );

  const badgeOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.badge).filter(Boolean))).sort(),
    [products]
  );

  const activeCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const urlTitle = params.get('title');

    // Priority 1: Category
    if (selectedFilters.category.length === 1) {
      const catName = selectedFilters.category[0];
      const cat = categories.find(c => c.name === catName);
      return cat ? { ...cat, name: urlTitle || cat.name, type: 'Category' } : { name: urlTitle || catName, type: 'Category' };
    }
    // Priority 2: Body Part
    if (selectedFilters.bodyPart.length === 1) {
      const bpName = selectedFilters.bodyPart[0];
      const bp = bodyParts.find(b => b.name === bpName);
      
      return bp ? { ...bp, name: urlTitle || bp.name, type: 'Body Part' } : { name: urlTitle || bpName, type: 'Body Part' };
    }
    // Priority 3: Usage/Activity
    if (selectedFilters.usage.length === 1) {
      const usageName = selectedFilters.usage[0];
      const activity = activities.find(a => a.name === usageName);
      
      return activity ? { ...activity, name: urlTitle || activity.name, type: 'Activity' } : { name: urlTitle || usageName, type: 'Activity' };
    }
    return null;
  }, [selectedFilters, categories, bodyParts, activities, location.search]);

  const filters = useMemo(
    () => ({
      bodyPart: bodyPartOptions,
      supportLevel: ['Light', 'Moderate', 'Maximum', 'Adjustable'],
      usage: ['Sports', 'Post-Surgical', 'Daily Support', 'Rehabilitation', 'Prevention'],
      category: categoryOptions,
      badge: badgeOptions,
    }),
    [bodyPartOptions, categoryOptions, badgeOptions]
  );

  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      bodyPart: [],
      category: [],
      supportLevel: [],
      usage: [],
      badge: [],
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBodyPart = selectedFilters.bodyPart.length === 0 || 
                           selectedFilters.bodyPart.includes(product.bodyPart);
    
    const matchesCategory =
      selectedFilters.category.length === 0 ||
      selectedFilters.category.includes(product.category);

    const matchesUsage = selectedFilters.usage.length === 0 || 
                        selectedFilters.usage.includes(product.usage);

    const matchesBadge = !selectedFilters.badge || selectedFilters.badge.length === 0 || 
                        selectedFilters.badge.includes(product.badge);

    return (
      matchesSearch &&
      matchesBodyPart &&
      matchesCategory &&
      matchesUsage &&
      matchesBadge
    );
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-24 lg:pt-[124px] pb-12 sm:pb-16 gradient-bg relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-medical-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {activeCategory ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
            >
              {activeCategory.imageUrl && (
                <div className="w-full md:w-1/3 aspect-[4/3] rounded-3xl overflow-hidden card-shadow-hover relative group">
                  <img 
                    src={activeCategory.imageUrl} 
                    alt={activeCategory.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-1.5 bg-medical-100 text-medical-700 rounded-full text-sm font-semibold mb-4">
                  {activeCategory.type || 'Category'}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                  {activeCategory.name}
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                  {activeCategory.description || `Discover our professional range of ${activeCategory.name.toLowerCase()} designed for optimal support and recovery.`}
                </p>
                
                {/* Quick stats for category */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 text-sm">
                    <span className="font-bold text-medical-600">{filteredProducts.length}</span> Products
                  </div>
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 text-sm">
                    Medical Grade
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              <SectionTitle
                title="Product Catalogue"
                subtitle={searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
              />
            </div>
          )}
          
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-slate-500">
                {isLoading ? 'Loading products...' : `Showing ${filteredProducts.length} products`}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-medical-600' : 'text-slate-500'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-medical-600' : 'text-slate-500'}`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {loadError && (
            <div className="mb-6 text-sm text-red-600">
              {loadError} Showing local data.
            </div>
          )}

          {/* Product Grid */}
          <div className="w-full">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500">Loading products...</div>
            ) : (
              <div className={`grid gap-6 sm:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-slate-500">No products found matching your criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
