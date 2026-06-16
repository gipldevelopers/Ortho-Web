import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MessageCircle, Check, Info, FileText, Ruler, Heart, Share2, PlayCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { featuredProducts } from '../data';
import { useAppContext } from '../context/AppContext';
import { buildApiUrl } from '../config/api';

const tabs = [
  { id: 'description',  label: 'Detail Description', icon: Info },
  { id: 'features',     label: 'Features',            icon: Check },
  { id: 'indications',  label: 'Indications',         icon: FileText },
  { id: 'how-to-wear',  label: 'How to Wear',         icon: Info },
  { id: 'measurement',  label: 'Measurement',         icon: Ruler },
  { id: 'sizing',       label: 'Size Chart',          icon: Ruler },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isThumbDragging, setIsThumbDragging] = useState(false);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { toggleSaved, savedItems, addToEnquiry } = useAppContext();
  const thumbTrackRef = useRef(null);
  const thumbDragRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });
  
  useEffect(() => {
    let isMounted = true;
    const fallbackProduct = featuredProducts.find((p) => p.id === id) || featuredProducts[0];

    // Reset state for new product
    setProduct(null);
    setIsLoading(true);
    setLoadError('');
    setActiveTab('description');
    setSelectedImage(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchProduct = async () => {
      try {
        const response = await fetch(buildApiUrl(`products/${encodeURIComponent(id)}`));
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-medical-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-600">Product not found.</p>
      </div>
    );
  }

  // ── helper: which tabs have content ──────────────────────────────────────
  const visibleTabs = tabs.filter(({ id: tabId }) => {
    if (tabId === 'description')  return !!product.detailDescription || !!product.description;
    if (tabId === 'features')     return Array.isArray(product.features) && product.features.length > 0;
    if (tabId === 'indications')  return Array.isArray(product.indications) && product.indications.length > 0;
    if (tabId === 'how-to-wear')  return !!product.howToWear;
    if (tabId === 'measurement')  return !!product.measurement;
    if (tabId === 'sizing')       return product.sizeChart?.columns?.length > 0 && product.sizeChart?.rows?.length > 0;
    return false;
  });

  const tabContent = {
    // ── Detail Description ──────────────────────────────────────────────────
    description: (
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base">
        {product.detailDescription || product.description}
      </div>
    ),

    // ── Features ────────────────────────────────────────────────────────────
    features: (
      <div className="grid sm:grid-cols-2 gap-3">
        {(product.features || []).map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
          >
            <div className="w-7 h-7 bg-medical-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-medical-600" />
            </div>
            <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
          </motion.div>
        ))}
      </div>
    ),

    // ── Indications ─────────────────────────────────────────────────────────
    indications: (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {(product.indications || []).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-medical-50 rounded-xl border border-medical-100">
              <div className="w-2 h-2 bg-medical-500 rounded-full flex-shrink-0" />
              <span className="text-slate-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Always consult with a healthcare professional before using this product.
          </p>
        </div>
      </div>
    ),

    // ── How to Wear ─────────────────────────────────────────────────────────
    'how-to-wear': (
      <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base">
        {product.howToWear}
      </div>
    ),

    // ── Measurement ─────────────────────────────────────────────────────────
    measurement: (
      <div className="space-y-5">
        {(product.measurement || '').split(/\n\s*\n/).filter(g => g.trim()).map((group, gi) => {
          const lines = group.split('\n').map(l => l.trim()).filter(Boolean);
          return (
            <div key={gi} className="rounded-xl border border-slate-200 overflow-hidden">
              {lines.map((line, li) => (
                <div
                  key={li}
                  className={`px-5 py-3 text-sm border-b border-slate-100 last:border-0 ${
                    li === 0
                      ? 'bg-medical-500 text-white font-semibold'
                      : 'bg-white text-slate-700 font-medium'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    ),

    // ── Size Chart ──────────────────────────────────────────────────────────
    sizing: product.sizeChart?.columns?.length > 0 ? (
      <div className="space-y-5">
        <p className="text-slate-500 text-sm">
          Measure around the affected area and match to the corresponding size.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-medical-500 text-white">
                {product.sizeChart.columns.map((col, i) => (
                  <th key={i} className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.sizeChart.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {product.sizeChart.columns.map((_, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-5 py-3 border-b border-slate-100 ${
                        colIdx === 0 ? 'font-semibold text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {row[colIdx] ?? ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
          <Ruler className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-500">
            For the most accurate fit, measure in the morning when swelling is minimal.
            If between sizes, choose the larger size for comfort.
          </p>
        </div>
      </div>
    ) : null,
  };

  return (
    <div className="min-h-screen pt-0 pb-16 bg-white">
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
          const videos = Array.isArray(product.videos) && product.videos.length > 0
            ? product.videos
            : [product.video || product.videoUrl].filter(Boolean);
          const mediaItems = [
            ...images.map((url, index) => ({
              key: `image-${index}-${url}`,
              type: 'image',
              url,
            })),
            ...videos.map((url, index) => ({
              key: `video-${index}-${url}`,
              type: 'video',
              url,
            })),
          ];
          const activeMedia = mediaItems[selectedImage] || mediaItems[0] || null;
          const hasMultipleMedia = mediaItems.length > 1;
          const goToPreviousMedia = () => {
            setSelectedImage((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
          };
          const goToNextMedia = () => {
            setSelectedImage((prev) => (prev + 1) % mediaItems.length);
          };
          const handleMediaTouchStart = (event) => {
            const touchX = event.changedTouches?.[0]?.clientX;
            setTouchStartX(typeof touchX === 'number' ? touchX : null);
          };
          const handleMediaTouchEnd = (event) => {
            if (touchStartX === null || mediaItems.length <= 1) return;
            const touchEndX = event.changedTouches?.[0]?.clientX;
            if (typeof touchEndX !== 'number') return;
            const delta = touchEndX - touchStartX;
            if (Math.abs(delta) < 40) return;
            if (delta < 0) {
              goToNextMedia();
            } else {
              goToPreviousMedia();
            }
            setTouchStartX(null);
          };
          const handleThumbMouseDown = (event) => {
            if (!thumbTrackRef.current) return;
            thumbDragRef.current.isDragging = true;
            thumbDragRef.current.startX = event.pageX - thumbTrackRef.current.offsetLeft;
            thumbDragRef.current.scrollLeft = thumbTrackRef.current.scrollLeft;
            setIsThumbDragging(true);
          };
          const handleThumbMouseMove = (event) => {
            if (!thumbDragRef.current.isDragging || !thumbTrackRef.current) return;
            event.preventDefault();
            const x = event.pageX - thumbTrackRef.current.offsetLeft;
            const walk = (x - thumbDragRef.current.startX) * 1.2;
            thumbTrackRef.current.scrollLeft = thumbDragRef.current.scrollLeft - walk;
          };
          const stopThumbDragging = () => {
            thumbDragRef.current.isDragging = false;
            setIsThumbDragging(false);
          };

          return (
            <div className="grid lg:grid-cols-12 gap-8">

          {/* ── Images Section ─────────────────────────────────────────── */}
          <div className="lg:col-span-4">
            {/* Desktop: thumbnails left + main image right */}
            <div className="flex gap-3">

              {/* Vertical thumbnail strip — hidden on mobile */}
              {mediaItems.length > 1 && (
                <div
                  ref={thumbTrackRef}
                  className={`hidden sm:flex flex-col gap-2 flex-shrink-0 select-none ${
                    isThumbDragging ? 'cursor-grabbing' : 'cursor-default'
                  }`}
                  onMouseDown={handleThumbMouseDown}
                  onMouseMove={handleThumbMouseMove}
                  onMouseUp={stopThumbDragging}
                  onMouseLeave={stopThumbDragging}
                >
                  {mediaItems.map((mediaItem, i) => (
                    <button
                      key={mediaItem.key}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? 'border-medical-500 shadow-md'
                          : 'border-slate-200 hover:border-medical-300'
                      }`}
                    >
                      {mediaItem.type === 'video' ? (
                        <>
                          <video src={mediaItem.url} preload="metadata" muted className="w-full h-full object-cover" />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <PlayCircle className="w-5 h-5 text-white drop-shadow" />
                          </span>
                        </>
                      ) : (
                        <img src={mediaItem.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200"
                  onTouchStart={handleMediaTouchStart}
                  onTouchEnd={handleMediaTouchEnd}
                >
                  {activeMedia?.type === 'video' ? (
                    <video src={activeMedia.url} controls preload="metadata" className="w-full h-full object-cover" />
                  ) : (
                    <img src={activeMedia?.url || product.image} alt={product.name} className="w-full h-full object-cover" />
                  )}

                  {hasMultipleMedia && (
                    <>
                      <button
                        type="button"
                        onClick={goToPreviousMedia}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-700 shadow flex items-center justify-center hover:bg-white transition"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNextMedia}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 text-slate-700 shadow flex items-center justify-center hover:bg-white transition"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </motion.div>

                {/* Mobile: horizontal thumbnail strip */}
                {mediaItems.length > 1 && (
                  <div className="sm:hidden flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1">
                    {mediaItems.map((mediaItem, i) => (
                      <button
                        key={mediaItem.key}
                        type="button"
                        onClick={() => setSelectedImage(i)}
                        className={`relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === i ? 'border-medical-500' : 'border-slate-200'
                        }`}
                      >
                        {mediaItem.type === 'video' ? (
                          <>
                            <video src={mediaItem.url} preload="metadata" muted className="w-full h-full object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <PlayCircle className="w-4 h-4 text-white" />
                            </span>
                          </>
                        ) : (
                          <img src={mediaItem.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-8">
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

              {/* Price & MRP */}
              {product.mrp && (
                <div className="mb-6">
                  {product.discount > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-4xl font-bold text-slate-900">
                          ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-lg text-slate-400 line-through">
                          ₹{Number(product.mrp).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-sm font-bold text-white bg-green-500 px-3 py-1 rounded-full">
                          {product.discount}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        MRP: <span className="line-through">₹{Number(product.mrp).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        {product.priceNote && <span> ({product.priceNote})</span>}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        ₹{Number(product.mrp).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                      {product.priceNote && (
                        <p className="text-sm text-slate-500">MRP ({product.priceNote})</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-lg text-slate-600 mb-5">
                {product.description}
              </p>

              {/* Color Variants */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Colors</p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, i) => {
                      const isActive = !color.productId || color.productId === id;
                      const hasLink = color.productId && color.productId.trim() !== '' && color.productId !== id;
                      const swatch = (
                        <span
                          className={`w-9 h-9 rounded-full border-2 transition-all shadow-sm block ${
                            isActive
                              ? 'border-slate-900 scale-110 shadow-md'
                              : 'border-slate-200 group-hover:border-slate-400 group-hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex || '#cccccc' }}
                        />
                      );
                      return (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          {hasLink ? (
                            <Link
                              to={`/products/${color.productId.trim()}`}
                              className="group"
                              title={color.name}
                            >
                              {swatch}
                            </Link>
                          ) : (
                            <span className="group" title={color.name}>{swatch}</span>
                          )}
                          {color.name && (
                            <span className={`text-[10px] font-medium ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                              {color.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => addToEnquiry(product)}
                  className="flex-1 inline-flex items-center justify-center px-4 sm:px-8 py-2.5 sm:py-3 gradient-medical text-white font-medium text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-medical-500/30 transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  Add to Enquiry
                </button>
                <button
                  onClick={() => toggleSaved(product.id)}
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-lg border-2 transition-all ${
                    isSaved ? 'bg-medical-500 border-medical-500 text-white' : 'border-slate-200 text-slate-500 hover:border-medical-400 hover:text-medical-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={async () => {
                    const shareData = { title: product.name, text: product.description || product.name, url: window.location.href };
                    if (navigator.share) {
                      try { await navigator.share(shareData); } catch (_) {}
                    } else {
                      try { await navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }
                      catch (_) { prompt('Copy this link:', window.location.href); }
                    }
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center rounded-lg border-2 border-slate-200 text-slate-500 hover:border-medical-400 hover:text-medical-500 transition-all"
                  title="Share"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>


            </motion.div>
          </div>
        </div>
          );
        })()}

        {/* Tabs Section */}
        <div className="mt-6">
          <div className="border-b border-slate-200">
            <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
              {visibleTabs.map((tab) => (
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
                {tabContent[activeTab] ?? tabContent['description'] ?? null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
