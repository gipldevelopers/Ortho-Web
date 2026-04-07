import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DownloadsPage from './pages/DownloadsPage';
import DistributorPage from './pages/DistributorPage';
import ContactPage from './pages/ContactPage';
import EnquiryPage from './pages/EnquiryPage';
import EnquiryThankYouPage from './pages/EnquiryThankYouPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SavedItemsPage from './pages/SavedItemsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LandingPage from './pages/lp/LandingPage';
import ThankYouPage from './pages/lp/ThankYouPage';
import { buildApiUrl } from './config/api';

const SITE_MODE_SESSION_KEY = 'ortho_site_mode';
const SITE_MODE_COOKIE_KEY = 'ortho_site_mode_cache';
const SITE_MODE_COOKIE_MAX_AGE = 60 * 10;

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div
        className="h-10 w-10 rounded-full border-2 border-slate-200 border-t-sky-500 animate-spin"
        aria-label="Loading"
      />
    </div>
  );
}

function getInitialSiteMode() {
  if (typeof window === 'undefined') {
    return 'loading';
  }

  if (!hasSiteModeCookie()) {
    window.sessionStorage.removeItem(SITE_MODE_SESSION_KEY);
    return 'loading';
  }

  const cachedMode = window.sessionStorage.getItem(SITE_MODE_SESSION_KEY);
  if (cachedMode === 'live' || cachedMode === 'down') {
    return cachedMode;
  }

  return 'loading';
}

function hasSiteModeCookie() {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${SITE_MODE_COOKIE_KEY}=`));
}

function setSiteModeCookie(mode) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${SITE_MODE_COOKIE_KEY}=${encodeURIComponent(mode)}; max-age=${SITE_MODE_COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function clearSiteModeCookie() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${SITE_MODE_COOKIE_KEY}=; max-age=0; path=/; SameSite=Lax`;
}

function persistSiteMode(mode) {
  if (typeof window === 'undefined') {
    return;
  }

  if (mode === 'live' || mode === 'down') {
    window.sessionStorage.setItem(SITE_MODE_SESSION_KEY, mode);
    setSiteModeCookie(mode);
  } else {
    window.sessionStorage.removeItem(SITE_MODE_SESSION_KEY);
    clearSiteModeCookie();
  }
}

function normalizeSiteMode(value) {
  return value === 'live' ? 'live' : 'down';
}

function setResolvedSiteMode(setSiteMode, mode) {
  const normalizedMode = normalizeSiteMode(mode);
  persistSiteMode(normalizedMode);
  setSiteMode(normalizedMode);
}

function App() {
  const [siteMode, setSiteMode] = useState(getInitialSiteMode);

  useEffect(() => {
    let active = true;

    const loadSiteMode = async () => {
      try {
        const response = await fetch(buildApiUrl('site/status'));
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to load site status.');
        }

        if (active) {
          setResolvedSiteMode(setSiteMode, data.data?.mode);
        }
      } catch (error) {
        if (active) {
          setResolvedSiteMode(setSiteMode, 'down');
        }
      }
    };

    if (siteMode === 'loading') {
      loadSiteMode();
    }

    const intervalId = window.setInterval(() => {
      if (!hasSiteModeCookie() && active) {
        setSiteMode((currentMode) => (currentMode === 'loading' ? currentMode : 'loading'));
        loadSiteMode();
      }
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [siteMode]);

  if (siteMode === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <AppShell siteMode={siteMode} />
    </Router>
  );
}

function AppShell({ siteMode }) {
  const location = useLocation();
  const isSiteDown = siteMode !== 'live';
  const hideChrome =
    isSiteDown ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/thank-you';
  const contentOffsetClass = hideChrome ? '' : 'pt-[108px]';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className={`flex-grow ${contentOffsetClass}`}>
        <Routes>
          {isSiteDown ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="*" element={<LandingPage />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/products/:category/:id" element={<ProductDetailPage />} />
              <Route path="/products/compression" element={<ProductsPage />} />
              <Route path="/products/ankle-foot" element={<ProductsPage />} />
              <Route path="/products/knee" element={<ProductsPage />} />
              <Route path="/products/lumbar" element={<ProductsPage />} />
              <Route path="/products/upper-limb" element={<ProductsPage />} />
              <Route path="/products/wrist-hand" element={<ProductsPage />} />
              <Route path="/products/cervical" element={<ProductsPage />} />
              <Route path="/products/therapy" element={<ProductsPage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
              <Route path="/distributor" element={<DistributorPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/enquiry" element={<EnquiryPage />} />
              <Route path="/enquiry/thank-you" element={<EnquiryThankYouPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/saved" element={<SavedItemsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          )}
        </Routes>
      </main>
      {!hideChrome && <FloatingWhatsApp />}
      {!hideChrome && <Footer />}
    </div>
  );
}

export default App;
