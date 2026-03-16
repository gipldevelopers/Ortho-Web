import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import DownloadsPage from './pages/DownloadsPage';
import DistributorPage from './pages/DistributorPage';
import ContactPage from './pages/ContactPage';
import EnquiryPage from './pages/EnquiryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SavedItemsPage from './pages/SavedItemsPage';
import LandingPage from './pages/lp/LandingPage';
import ThankYouPage from './pages/lp/ThankYouPage';

function AppShell() {
  const location = useLocation();
  const hideChrome =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/lp' ||
    location.pathname === '/lp/thank-you';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:category/:id" element={<ProductDetailPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/distributor" element={<DistributorPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/saved" element={<SavedItemsPage />} />
          <Route path="/lp" element={<LandingPage />} />
          <Route path="/lp/thank-you" element={<ThankYouPage />} />
          {/* Category routes */}
          <Route path="/products/compression" element={<ProductsPage />} />
          <Route path="/products/ankle-foot" element={<ProductsPage />} />
          <Route path="/products/knee" element={<ProductsPage />} />
          <Route path="/products/lumbar" element={<ProductsPage />} />
          <Route path="/products/upper-limb" element={<ProductsPage />} />
          <Route path="/products/wrist-hand" element={<ProductsPage />} />
          <Route path="/products/cervical" element={<ProductsPage />} />
          <Route path="/products/therapy" element={<ProductsPage />} />
        </Routes>
      </main>
      {!hideChrome && <FloatingWhatsApp />}
      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell />
    </Router>
  );
}

export default App;
