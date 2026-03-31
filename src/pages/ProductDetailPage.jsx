import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MessageCircle, Download, Check, Info, FileText, Package, Ruler, Heart, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { featuredProducts } from '../data';
import Button from '../components/Button';
import { useAppContext } from '../context/AppContext';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/ortho-website/backend/public/index.php';

const tabs = [
  { id: 'description', label: 'Description', icon: Info },
  { id: 'features', label: 'Features', icon: Check },
  { id: 'indications', label: 'Indications', icon: FileText },
  { id: 'sizing', label: 'Size Chart', icon: Ruler },
];

const sizeChart = [
  { size: 'XS', measurement: '30-35 cm', fits: 'Small frame' },
  { size: 'S', measurement: '35-40 cm', fits: 'Medium frame' },
  { size: 'M', measurement: '40-45 cm', fits: 'Average frame' },
  { size: 'L', measurement: '45-50 cm', fits: 'Large frame' },
  { size: 'XL', measurement: '50-55 cm', fits: 'Extra large' },
  { size: 'XXL', measurement: '55-60 cm', fits: 'XXL frame' },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { toggleSaved, savedItems, addToEnquiry } = useAppContext();
  
  useEffect(() => {
    let isMounted = true;
    const fallbackProduct = featuredProducts.find((p) => p.id === id) || featuredProducts[0];

    const fetchProduct = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const response = await fetch(`${API_BASE_URL}?route=products/${encodeURIComponent(id)}`);
        const data = await response.json();

        if (!response.ok || !data.success || !data.data) {
          throw new Error(data.message || 'Unable to load product.');
        }

        if (isMounted) {
          setProduct(data.data);
        }
      } catch (err) {
        if (isMounted) {
          setProduct(fallbackProduct);
          setLoadError(err.message || 'Unable to load product.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    setSelectedImage(0);
  }, [id, product?.id]);

  const isSaved = product ? savedItems.includes(product.id) : false;

  if (isLoading && !product) {
    return (
      <div className="min-h-screen pt-28 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-red-600">Product not found.</p>
        </div>
      </div>
    );
  }

  const tabContent = {
    description: (
      <div className="space-y-4">
        <p className="text-slate-600 leading-relaxed">
          The {product.name} is engineered with premium materials and advanced design features 
          to provide optimal support and comfort during recovery. This medical-grade device 
          combines the latest in orthopaedic technology with user-centric design.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Constructed from breathable, moisture-wicking fabric with adjustable compression 
          zones, this product ensures all-day comfort while delivering the therapeutic 
          support you need. The ergonomic design conforms to your body\'s natural contours 
          while maintaining the stability required for effective rehabilitation.
        </p>
        <h4 className="font-semibold text-slate-900 mt-6">Key Benefits</h4>
        <ul className="space-y-2">
          {[
            'Reduces pain and inflammation',
            'Improves circulation and healing',
            'Provides targeted compression',
            'Maintains full range of motion',
            'Breathable for all-day comfort',
          ].map((benefit, i) => (
            <li key={i} className="flex items-center space-x-2 text-slate-600">
              <Check className="w-5 h-5 text-medical-500" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
    features: (
      <div className="grid sm:grid-cols-2 gap-4">
        {product.features?.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl"
          >
            <div className="w-8 h-8 bg-medical-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-medical-600" />
            </div>
            <span className="text-slate-700">{feature}</span>
          </motion.div>
        ))}
        {[
          'Medical-grade materials',
          'Machine washable',
          'Latex-free construction',
          'Antimicrobial treatment',
          'Adjustable fit system',
          'Breathable mesh panels',
        ].map((feature, i) => (
          <motion.div
            key={`extra-${i}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (product.features?.length || 0 + i) * 0.1 }}
            className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl"
          >
            <div className="w-8 h-8 bg-medical-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-medical-600" />
            </div>
            <span className="text-slate-700">{feature}</span>
          </motion.div>
        ))}
      </div>
    ),
    indications: (
      <div className="space-y-4">
        <p className="text-slate-600">
          This product is recommended for the following conditions and uses:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {product.indications?.map((indication, i) => (
            <div key={i} className="flex items-center space-x-3 p-4 bg-medical-50 rounded-xl">
              <div className="w-2 h-2 bg-medical-500 rounded-full" />
              <span className="text-slate-700">{indication}</span>
            </div>
          ))}
          {[
            'Post-surgical recovery',
            'Chronic condition management',
            'Sports injury prevention',
            'Rehabilitation support',
          ].map((indication, i) => (
            <div key={`extra-${i}`} className="flex items-center space-x-3 p-4 bg-medical-50 rounded-xl">
              <div className="w-2 h-2 bg-medical-500 rounded-full" />
              <span className="text-slate-700">{indication}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Always consult with a healthcare professional before using this product. 
              Individual results may vary based on condition severity and proper usage.
            </p>
          </div>
        </div>
      </div>
    ),
    sizing: (
      <div className="space-y-6">
        <p className="text-slate-600">
          Use the chart below to find your perfect fit. Measure around the affected area 
          and match to the corresponding size.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 rounded-tl-lg">Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Measurement</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 rounded-tr-lg">Fits</th>
              </tr>
            </thead>
            <tbody>
              {sizeChart.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.size}</td>
                  <td className="px-4 py-3 text-slate-600">{row.measurement}</td>
                  <td className="px-4 py-3 text-slate-600">{row.fits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
          <Ruler className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600">
            For the most accurate fit, measure in the morning when swelling is minimal. 
            If between sizes, choose the larger size for comfort.
          </p>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-4">
          <Link to="/products" className="flex items-center text-slate-500 hover:text-medical-600 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Products
          </Link>
        </nav>

        {loadError && (
          <div className="mb-4 text-sm text-red-600">
            {loadError} Showing local data.
          </div>
        )}

        {(() => {
          const images = Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [product.image].filter(Boolean);
          const activeImage = images[selectedImage] || images[0] || product.image;

          return (
            <div className="grid lg:grid-cols-12 gap-12">
          {/* Images Section */}
          <div className="lg:col-span-5 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-inner border border-slate-100"
            >
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((imageUrl, i) => (
                  <button
                    key={imageUrl || i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-medical-500 bg-medical-50' : 'border-transparent bg-slate-50'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-medical-100 text-medical-700 text-sm font-medium rounded-full">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                    {product.badge}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              <p className="text-slate-500 mb-6">{product.code}</p>
              
              <p className="text-lg text-slate-600 mb-8">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 text-white">
                <button
                  onClick={() => addToEnquiry(product)}
                  className="flex-1 inline-flex items-center justify-center px-8 py-3 gradient-medical text-white font-medium rounded-lg hover:shadow-lg hover:shadow-medical-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Add to Enquiry
                </button>
                <div className="flex gap-2">
                  <Button 
                    variant={isSaved ? "primary" : "secondary"} 
                    size="lg"
                    onClick={() => toggleSaved(product.id)}
                    className={isSaved ? "bg-medical-500 text-white" : ""}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="secondary" size="lg">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl mb-8">
                <div className="text-center">
                  <Package className="w-6 h-6 text-medical-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Medical Grade</p>
                </div>
                <div className="text-center">
                  <Check className="w-6 h-6 text-medical-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">CE Certified</p>
                </div>
                <div className="text-center">
                  <Download className="w-6 h-6 text-medical-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Datasheet</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
          );
        })()}

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-slate-200">
            <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-medical-500 text-medical-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
