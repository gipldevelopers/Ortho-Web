import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Filter, Grid3X3, LayoutList, Search, SlidersHorizontal, X } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import { featuredProducts } from '../data';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/ortho-website/backend/public/index.php';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
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

    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const response = await fetch(`${API_BASE_URL}?route=products`);
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

  const filters = useMemo(
    () => ({
      bodyPart: ['Knee', 'Ankle', 'Wrist', 'Back', 'Shoulder', 'Elbow', 'Neck', 'Hip'],
      supportLevel: ['Light', 'Moderate', 'Maximum', 'Adjustable'],
      usage: ['Sports', 'Post-Surgical', 'Daily Support', 'Rehabilitation', 'Prevention'],
      category: categoryOptions,
      badge: badgeOptions,
    }),
    [categoryOptions, badgeOptions]
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
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Product Catalogue"
            subtitle="All Products"
          />
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-700"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
              
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

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-medical-600 hover:text-medical-700"
                  >
                    Clear all
                  </button>
                </div>

                {/* Body Part Filter */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Body Part</h4>
                  <div className="space-y-2">
                    {filters.bodyPart.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.bodyPart.includes(option)}
                          onChange={() => toggleFilter('bodyPart', option)}
                          className="w-4 h-4 text-medical-600 border-slate-300 rounded focus:ring-medical-500"
                        />
                        <span className="text-slate-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Category</h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {filters.category.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.category.includes(option)}
                          onChange={() => toggleFilter('category', option)}
                          className="w-4 h-4 text-medical-600 border-slate-300 rounded focus:ring-medical-500"
                        />
                        <span className="text-slate-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Support Level Filter */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Support Level</h4>
                  <div className="space-y-2">
                    {filters.supportLevel.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.supportLevel.includes(option)}
                          onChange={() => toggleFilter('supportLevel', option)}
                          className="w-4 h-4 text-medical-600 border-slate-300 rounded focus:ring-medical-500"
                        />
                        <span className="text-slate-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Usage Filter */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Usage</h4>
                  <div className="space-y-2">
                    {filters.usage.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.usage.includes(option)}
                          onChange={() => toggleFilter('usage', option)}
                          className="w-4 h-4 text-medical-600 border-slate-300 rounded focus:ring-medical-500"
                        />
                        <span className="text-slate-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Badge Filter */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-4">Badge</h4>
                  <div className="space-y-2">
                    {filters.badge.map((option) => (
                      <label key={option} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.badge.includes(option)}
                          onChange={() => toggleFilter('badge', option)}
                          className="w-4 h-4 text-medical-600 border-slate-300 rounded focus:ring-medical-500"
                        />
                        <span className="text-slate-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 lg:hidden"
              >
                <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-lg">Filters</h3>
                      <button onClick={() => setMobileFiltersOpen(false)}>
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    {/* Same filter content */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-4">Body Part</h4>
                        <div className="space-y-2">
                          {filters.bodyPart.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedFilters.bodyPart.includes(option)}
                                onChange={() => toggleFilter('bodyPart', option)}
                                className="w-4 h-4 text-medical-600 border-slate-300 rounded"
                              />
                              <span className="text-slate-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-4">Category</h4>
                        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                          {filters.category.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedFilters.category.includes(option)}
                                onChange={() => toggleFilter('category', option)}
                                className="w-4 h-4 text-medical-600 border-slate-300 rounded"
                              />
                              <span className="text-slate-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                       
                      <div>
                        <h4 className="font-medium text-slate-900 mb-4">Support Level</h4>
                        <div className="space-y-2">
                          {filters.supportLevel.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedFilters.supportLevel.includes(option)}
                                onChange={() => toggleFilter('supportLevel', option)}
                                className="w-4 h-4 text-medical-600 border-slate-300 rounded"
                              />
                              <span className="text-slate-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-slate-900 mb-4">Usage</h4>
                        <div className="space-y-2">
                          {filters.usage.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedFilters.usage.includes(option)}
                                onChange={() => toggleFilter('usage', option)}
                                className="w-4 h-4 text-medical-600 border-slate-300 rounded"
                              />
                              <span className="text-slate-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-4">Badge</h4>
                        <div className="space-y-2">
                          {filters.badge.map((option) => (
                            <label key={option} className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedFilters.badge.includes(option)}
                                onChange={() => toggleFilter('badge', option)}
                                className="w-4 h-4 text-medical-600 border-slate-300 rounded"
                              />
                              <span className="text-slate-600">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={clearFilters}
                      className="w-full mt-8 py-3 border-2 border-slate-200 rounded-xl font-medium text-slate-600"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="py-12 text-center text-slate-500">Loading products...</div>
              ) : (
                <div className={`grid gap-4 sm:gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-2 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                      <p className="text-slate-500">No products found matching your criteria.</p>
                      <button onClick={clearFilters} className="text-medical-600 hover:text-medical-700 font-medium mt-2">
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
