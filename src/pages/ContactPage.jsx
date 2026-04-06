import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { buildApiUrl } from '../config/api';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+1 234 567 890', '+1 234 567 891'],
    description: 'Mon-Fri 8am-6pm EST',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@orthocare.com', 'support@orthocare.com'],
    description: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Address',
    details: ['123 Medical District', 'Healthcare City, HC 12345'],
    description: 'United States',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Monday - Friday: 8AM - 6PM', 'Saturday: 9AM - 2PM'],
    description: 'Sunday: Closed',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch(buildApiUrl('contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to send your message.');
      }

      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Unable to send your message.');
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
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Contact Us"
            subtitle="Get in Touch"
          />
          <p className="text-center text-slate-600 max-w-2xl mx-auto">
            Have questions about our products or need a quote? Our team is here to help. 
            Reach out and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover"
              >
                <div className="w-12 h-12 gradient-medical rounded-xl flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-slate-600">{detail}</p>
                ))}
                <p className="text-sm text-slate-500 mt-2">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-10 card-shadow border border-slate-100"
            >
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-medical-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-slate-600">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a Message</h2>
                  <p className="text-slate-600 mb-8">
                    Fill out the form below and we'll get back to you shortly.
                  </p>
                  {submitError && (
                    <p className="text-red-600 text-sm mb-4">{submitError}</p>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.name ? 'border-red-500' : 'border-slate-200'
                          } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all`}
                          placeholder="John Smith"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.email ? 'border-red-500' : 'border-slate-200'
                          } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                          placeholder="+1 234 567 890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">Product Inquiry</option>
                          <option value="quote-request">Quote Request</option>
                          <option value="technical-support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.message ? 'border-red-500' : 'border-slate-200'
                        } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all resize-none`}
                        placeholder="How can we help you?"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-slate-100 rounded-3xl h-full min-h-[400px] lg:min-h-full overflow-hidden relative">
                {/* Map Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Map Integration</p>
                    <p className="text-slate-400 text-sm mt-2">
                      Google Maps or similar service<br />can be integrated here
                    </p>
                  </div>
                </div>

                {/* Office Location Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Headquarters</h4>
                  <p className="text-sm text-slate-600">
                    123 Medical District, Healthcare City<br />
                    HC 12345, United States
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
