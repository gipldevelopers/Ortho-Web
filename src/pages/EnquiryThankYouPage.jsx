import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import Button from '../components/Button';

export default function EnquiryThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const submittedCount = location.state?.count ?? 0;

  useEffect(() => {
    const handlePop = () => {
      navigate('/', { replace: true });
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
    };
  }, [navigate]);

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
              Thank you for your interest. Our sales team will review your enquiry
              {submittedCount ? ` for ${submittedCount} products` : ''} and contact you within 24 hours.
            </p>
            <Button href="/" size="lg">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
