import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Loader2, CheckCircle, Package, User, Building2, Mail, Phone, FileText, Trash2, ShoppingBag, X } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { featuredProducts } from '../data';
import { useAppContext } from '../context/AppContext';

export default function EnquiryPage() {
  const [searchParams] = useSearchParams();
  const { user, enquiryItems, addToEnquiry, removeFromEnquiry, clearEnquiry } = useAppContext();
  const productIdParam = searchParams.get('product');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    company: user?.company || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Add product from URL if present
  useEffect(() => {
    if (productIdParam) {
      const product = featuredProducts.find(p => p.id === productIdParam);
      if (product) {
        addToEnquiry(product);
      }
    }
  }, [productIdParam, addToEnquiry]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (enquiryItems.length === 0) newErrors.items = 'Please add at least one product';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    clearEnquiry();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20">
        <section className="py-24 gradient-bg">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-medical-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Enquiry Submitted!
              </h2>
              <p className="text-slate-600 mb-8">
                Thank you for your interest. Our sales team will review your enquiry for {enquiryItems.length} products and contact you within 24 hours.
              </p>
              <Button href="/products">Browse More Products</Button>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Header */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Product Enquiry"
            subtitle="Request a Quotation"
          />
          <p className="text-center text-slate-600 max-w-2xl mx-auto">
            Interested in our medical solutions? Build your enquiry list and our team will get back to you with a comprehensive quote.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Left Column: Enquiry List */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-medical-600" />
                  Your Enquiry List ({enquiryItems.length})
                </h3>

                {enquiryItems.length > 0 ? (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                      {enquiryItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl group border border-transparent hover:border-medical-100 transition-all"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover bg-white"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.code}</p>
                          </div>
                          <button
                            onClick={() => removeFromEnquiry(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Your enquiry list is empty</p>
                    <Link to="/products" className="text-sm font-semibold text-medical-600 hover:text-medical-700">
                      Browse Catalogue
                    </Link>
                  </div>
                )}

                {errors.items && (
                  <p className="text-red-500 text-xs mt-4 text-center">{errors.items}</p>
                )}
              </div>
            </div>

            {/* Right Column: Information Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.name ? 'border-red-500 ring-4 ring-red-50/50' : 'border-slate-200'
                          } focus:border-medical-500 focus:ring-4 focus:ring-medical-50 outline-none transition-all`}
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-50 outline-none transition-all"
                          placeholder="Organization"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.email ? 'border-red-500 ring-4 ring-red-50/50' : 'border-slate-200'
                          } focus:border-medical-500 focus:ring-4 focus:ring-medical-50 outline-none transition-all`}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.phone ? 'border-red-500 ring-4 ring-red-50/50' : 'border-slate-200'
                          } focus:border-medical-500 focus:ring-4 focus:ring-medical-50 outline-none transition-all`}
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message / Special Requirements
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-4 focus:ring-medical-50 outline-none transition-all resize-none"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full py-4 text-lg font-bold shadow-xl shadow-medical-500/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Submit Request for {enquiryItems.length} Products
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
