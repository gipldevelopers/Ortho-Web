import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Phone } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AuthLayout from '../components/AuthLayout';
import { buildApiUrl } from '../config/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleExtraData, setGoogleExtraData] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [googleExtraError, setGoogleExtraError] = useState('');
  const [showGoogleExtra, setShowGoogleExtra] = useState(false);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const googleInitializedRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Mock login delay
    setTimeout(() => {
      login({
        name: 'John Doe',
        email: formData.email,
        phone: '',
        company: 'Ortho Supplies Ltd',
        joinedDate: 'March 2024'
      });
      setIsLoading(false);
      navigate('/profile');
    }, 1500);
  };

  const handleGoogleCredential = useCallback((idToken) => {
    if (!idToken) {
      setError('Google did not return a valid credential.');
      return;
    }
    setError('');
    setGoogleExtraError('');
    setGoogleExtraData({ phone: '', password: '', confirmPassword: '' });
    setPendingGoogleCredential(idToken);
    setShowGoogleExtra(true);
    setIsGoogleLoading(false);
  }, []);

  const handleGoogleExtraSubmit = async (e) => {
    e.preventDefault();
    setGoogleExtraError('');

    if (!googleExtraData.phone || !googleExtraData.password || !googleExtraData.confirmPassword) {
      setGoogleExtraError('Please fill in all fields.');
      return;
    }

    if (googleExtraData.password !== googleExtraData.confirmPassword) {
      setGoogleExtraError('Passwords do not match.');
      return;
    }

    if (!pendingGoogleCredential) {
      setGoogleExtraError('Google credential missing. Please try again.');
      return;
    }

    setIsGoogleLoading(true);

    try {
      const response = await fetch(buildApiUrl('auth/google'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: pendingGoogleCredential,
          phone: googleExtraData.phone,
          password: googleExtraData.password,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Google sign-in failed.');
      }

      login(data.data.user, data.data.token);
      setShowGoogleExtra(false);
      setPendingGoogleCredential('');
      navigate('/profile');
    } catch (err) {
      setGoogleExtraError(err.message || 'Unable to continue with Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const closeGoogleExtra = () => {
    if (isGoogleLoading) return;
    setShowGoogleExtra(false);
    setPendingGoogleCredential('');
    setGoogleExtraError('');
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not configured. Missing VITE_GOOGLE_CLIENT_ID.');
      return;
    }

    let retryTimer = null;
    let retryCount = 0;

    const initGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return false;
      }
      if (googleInitializedRef.current) {
        return true;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (!response?.credential) {
            setError('Google did not return a valid credential.');
            return;
          }
          handleGoogleCredential(response.credential);
        },
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        text: 'continue_with',
        shape: 'rectangular',
        width: 380,
      });

      googleInitializedRef.current = true;
      return true;
    };

    if (!initGoogle()) {
      retryTimer = setInterval(() => {
        retryCount += 1;
        if (initGoogle() || retryCount > 20) {
          clearInterval(retryTimer);
          if (retryCount > 20) {
            setError('Google Sign-In script failed to load.');
          }
        }
      }, 250);
    }

    return () => {
      if (retryTimer) {
        clearInterval(retryTimer);
      }
    };
  }, [handleGoogleCredential]);

  return (
    <AuthLayout
      sideTitle={
        <>
          Welcome back <br /> to OrthoCare
        </>
      }
      sideDescription="Sign in to manage your profile, saved items, and enquiries."
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to access your profile and saved items</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="mb-2">
            <div ref={googleButtonRef} className="w-full flex justify-center" />
            {isGoogleLoading && (
              <p className="mt-3 text-center text-sm text-slate-500">Signing in with Google...</p>
            )}
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Or
            </span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-medical-600 hover:text-medical-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-medical-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-medical-600 font-semibold hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </motion.div>
      {showGoogleExtra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Complete your profile</h3>
              <p className="text-sm text-slate-500 mb-6">
                Add your phone number and set a password to finish Google sign-in.
              </p>

              {googleExtraError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {googleExtraError}
                </div>
              )}

              <form onSubmit={handleGoogleExtraSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={googleExtraData.phone}
                      onChange={(e) =>
                        setGoogleExtraData({ ...googleExtraData, phone: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={googleExtraData.password}
                      onChange={(e) =>
                        setGoogleExtraData({ ...googleExtraData, password: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={googleExtraData.confirmPassword}
                      onChange={(e) =>
                        setGoogleExtraData({ ...googleExtraData, confirmPassword: e.target.value })
                      }
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeGoogleExtra}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-70"
                    disabled={isGoogleLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGoogleLoading}
                    className="flex-1 py-3 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-medical-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isGoogleLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Continue'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AuthLayout>
  );
}
