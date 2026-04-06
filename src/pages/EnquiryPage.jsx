import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Package, User, Building2, Mail, Phone, FileText, ShoppingBag, X } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { featuredProducts } from '../data';
import { useAppContext } from '../context/AppContext';
import { buildApiUrl } from '../config/api';

export default function EnquiryPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Add product from URL if present
  useEffect(() => {
    if (productIdParam) {
      const product = featuredProducts.find(p => p.id === productIdParam);
      if (product) {
        addToEnquiry(product);
      }
    }
  }, [productIdParam, addToEnquiry]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || '',
      company: user?.company || prev.company,
      phone: user?.phone || prev.phone,
    }));
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    const nameValue = (user?.name || formData.name || '').trim();
    const emailValue = (user?.email || formData.email || '').trim();
    if (!nameValue) newErrors.name = 'Name is required';
    if (!emailValue) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!user) newErrors.auth = 'Please login to submit an enquiry';
    if (enquiryItems.length === 0) newErrors.items = 'Please add at least one product';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        name: (user?.name || formData.name || '').trim(),
        company: formData.company.trim(),
        email: (user?.email || formData.email || '').trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        items: enquiryItems.map((item) => ({
          id: item.id,
          name: item.name,
          code: item.code,
          category: item.category,
        })),
      };

      const response = await fetch(buildApiUrl('enquiry'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit enquiry.');
      }

      const count = enquiryItems.length;
      clearEnquiry();
      navigate('/enquiry/thank-you', { replace: true, state: { count } });
    } catch (err) {
      setSubmitError(err.message || 'Unable to submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
          {!user && (
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Login Required</h3>
              <p className="text-slate-600 mb-6">
                Please login to submit an enquiry. Your name and email will be auto-filled.
              </p>
              <Button href="/login" size="lg">Go to Login</Button>
            </div>
          )}

          {user && (
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
                    {errors.auth && (
                      <p className="text-red-500 text-xs mt-2 text-center">{errors.auth}</p>
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
                          value={user?.name || formData.name}
                          readOnly
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.name ? 'border-red-500 ring-4 ring-red-50/50' : 'border-slate-200'
                          } bg-slate-50 text-slate-700 cursor-not-allowed`}
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
                          value={user?.email || formData.email}
                          readOnly
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border ${
                            errors.email ? 'border-red-500 ring-4 ring-red-50/50' : 'border-slate-200'
                          } bg-slate-50 text-slate-700 cursor-not-allowed`}
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
                  {submitError && (
                    <p className="text-red-500 text-sm text-center mt-3">{submitError}</p>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  );
}
