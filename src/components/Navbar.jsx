import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  User,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { featuredProducts } from "../data";
import { TrendingUp, History, Star } from 'lucide-react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/ortho-website/backend/public/index.php";

const defaultBodyPartItems = [
  { name: "Ankle & Foot", href: "/products?nav=bodyPart&bodyPart=Ankle" },
  { name: "Knee", href: "/products?nav=bodyPart&bodyPart=Knee" },
  { name: "Lumbar & Back", href: "/products?nav=bodyPart&bodyPart=Back" },
  { name: "Wrist & Hand", href: "/products?nav=bodyPart&bodyPart=Wrist" },
  { name: "Cervical & Posture", href: "/products?nav=bodyPart&bodyPart=Neck" },
  { name: "Upper Limb", href: "/products?nav=bodyPart&bodyPart=Shoulder" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [trendingProducts] = useState(featuredProducts.slice(0, 3));
  const [bodyPartItems, setBodyPartItems] = useState(defaultBodyPartItems);
  
  const { user, logout, cartCount, wishlistCount } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const megaMenuRef = useRef(null);
  const accountMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const closeTimer = useRef(null);
  const searchParams = new URLSearchParams(location.search);
  const navParam = searchParams.get("nav");
  const accountLabel = user?.name ? user.name.split(" ")[0] : user ? "Profile" : "Account";

  const navLinks = [
    {
      name: "Shop By Body Part",
      href: "/products?nav=bodyPart",
      navKey: "bodyPart",
      megaMenu: [
        {
          title: "By Body Part",
          items: bodyPartItems,
        },
      ],
    },
    {
      name: "Shop By Activity",
      href: "/products?nav=activity",
      navKey: "activity",
      megaMenu: [
        {
          title: "By Activity",
          items: [
            { name: "Sports & Athletics", href: "/products?nav=activity&usage=Sports" },
            { name: "Daily Use", href: "/products?nav=activity&usage=Daily%20Support" },
            { name: "Post-Surgery", href: "/products?nav=activity&usage=Post-Surgical" },
            { name: "Elderly Care", href: "/products?nav=activity&usage=Rehabilitation" },
            { name: "Pediatric", href: "/products?nav=activity&usage=Daily%20Support" },
            { name: "Workplace Ergonomics", href: "/products?nav=activity&usage=Daily%20Support" },
          ],
        },
      ],
    },
    {
      name: "Shop By Daily Support",
      href: "/products?nav=dailySupport",
      navKey: "dailySupport",
      megaMenu: [
        {
          title: "By Support Type",
          items: [
            { name: "Compression Products", href: "/products?nav=dailySupport&usage=Daily%20Support" },
            { name: "Braces & Supports", href: "/products?nav=dailySupport&usage=Prevention" },
            { name: "Therapy & Mobility", href: "/products?nav=dailySupport&usage=Rehabilitation" },
            { name: "Posture Correctors", href: "/products?nav=dailySupport&bodyPart=Neck" },
            { name: "Splints & Immobilizers", href: "/products?nav=dailySupport&usage=Post-Surgical" },
            { name: "Hot & Cold Therapy", href: "/products?nav=dailySupport&usage=Rehabilitation" },
          ],
        },
      ],
    },
    { name: "All Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Downloads", href: "/downloads" },
    { name: "Distributor", href: "/distributor" },
    { name: "Contact", href: "/contact" },
  ];

  const isLinkActive = (link) => {
    if (link.name === "All Products") {
      return location.pathname.startsWith("/products") && !navParam;
    }

    if (link.navKey) {
      return navParam === link.navKey;
    }

    return location.pathname === link.href;
  };

  // Popular searches mockup
  const popularSearches = ["Knee Brace", "Ankle Support", "Compression", "Back Pain", "Wrist Splint", "Shoulder Sling"];

  useEffect(() => {
    if (isSearchOverlayOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSearchOverlayOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
    setMobileExpanded(null);
    setIsAccountMenuOpen(false);
  }, [location]);

  useEffect(() => {
    let isMounted = true;

    const fetchBodyParts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?route=body-parts`);
        const data = await response.json();

        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || "Unable to load body parts.");
        }

        const items = data.data.map((item) => ({
          name: item.name,
          href: `/products?nav=bodyPart&bodyPart=${encodeURIComponent(item.name)}`,
        }));

        if (isMounted && items.length > 0) {
          setBodyPartItems(items);
        }
      } catch (err) {
        // Keep defaults on failure.
      }
    };

    fetchBodyParts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleMouseEnter = (name) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed  top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}>
      {/* ─── ROW 1: Top Bar ─── */}
      <div className="bg-medical-900 text-white">
        <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/logo/orthologo.png"
                alt="OrthoCare"
                className="h-16 w-16 object-contain bg-white rounded-md p-1 shadow-sm"
              />
            </Link>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-xl hidden md:flex items-center">
              <div className="flex w-full rounded-lg overflow-hidden border border-medical-600 focus-within:border-medical-300 transition-colors">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 px-4 py-2 text-sm bg-medical-800 text-white placeholder-medical-400 outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-medical-500 hover:bg-medical-400 text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Utility Icons */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Search Icon (Mobile Only) */}
              <button
                onClick={() => setIsSearchOverlayOpen(true)}
                className="flex md:hidden p-2 rounded-lg hover:bg-medical-700 transition-colors text-medical-300 hover:text-white"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              {user ? (
                <div ref={accountMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((v) => !v)}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-medical-700 transition-colors group"
                    aria-label="Account menu"
                  >
                    <User className="w-5 h-5 text-medical-300 group-hover:text-white transition-colors" />
                    <span className="text-[10px] text-medical-400 group-hover:text-white mt-0.5 hidden sm:block">
                      {accountLabel}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isAccountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Profile
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setIsAccountMenuOpen(false);
                              navigate("/");
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-medical-700 transition-colors group">
                  <User className="w-5 h-5 text-medical-300 group-hover:text-white transition-colors" />
                  <span className="text-[10px] text-medical-400 group-hover:text-white mt-0.5 hidden sm:block">
                    Account
                  </span>
                </Link>
              )}

              {/* Wishlist */}
              <Link
                to="/saved"
                className="relative flex flex-col items-center p-2 rounded-lg hover:bg-medical-700 transition-colors group">
                <Heart className="w-5 h-5 text-medical-300 group-hover:text-white transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
                <span className="text-[10px] text-medical-400 group-hover:text-white mt-0.5 hidden sm:block">
                  Saved
                </span>
              </Link>

              {/* Cart */}
              <Link
                to="/enquiry"
                className="relative flex flex-col items-center p-2 rounded-lg hover:bg-medical-700 transition-colors group">
                <ShoppingCart className="w-5 h-5 text-medical-300 group-hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-medical-400 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
                <span className="text-[10px] text-medical-400 group-hover:text-white mt-0.5 hidden sm:block">
                  Enquiry
                </span>
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden ml-1 p-2 rounded-lg hover:bg-medical-700 transition-colors text-medical-300 hover:text-white"
                aria-label="Toggle menu">
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: Nav Bar (Desktop only) ─── */}
      <div className="hidden lg:block bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center h-11">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative h-full flex items-center"
                onMouseEnter={() =>
                  link.megaMenu && handleMouseEnter(link.name)
                }
                onMouseLeave={link.megaMenu ? handleMouseLeave : undefined}
                ref={link.megaMenu ? megaMenuRef : null}>
                <Link
                  to={link.href}
                  className={`px-3 h-full flex items-center text-sm font-medium gap-2 border-b-2 transition-all duration-150 ${
                    isLinkActive(link)
                      ? "text-medical-600 border-medical-600"
                      : "text-slate-600 border-transparent hover:text-medical-600 hover:border-medical-400"
                  }`}>
                  {link.name}
                  {link.megaMenu && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Mega Menu Panel */}
                <AnimatePresence>
                  {link.megaMenu && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      onMouseEnter={() => handleMouseEnter(link.name)}
                      onMouseLeave={handleMouseLeave}
                      className="absolute top-full left-0 mt-0 bg-white shadow-xl border border-slate-100 rounded-b-xl z-50"
                      style={{ minWidth: "260px" }}>
                      <div
                        className={`grid gap-0 p-6`}
                        style={{
                          gridTemplateColumns: `repeat(${link.megaMenu.length}, 1fr)`,
                        }}>
                        {link.megaMenu.map((col) => (
                          <div
                            key={col.title}
                            className="pr-6 last:pr-0 border-r border-slate-100 last:border-r-0 pl-4 first:pl-0">
                            <p className="text-xs font-bold text-medical-600 uppercase tracking-wider mb-3 pb-2 border-b border-medical-100">
                              {col.title}
                            </p>
                            <ul className="space-y-1">
                              {col.items.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    to={item.href}
                                    className="block text-sm text-slate-600 hover:text-medical-600 hover:translate-x-1 transition-all duration-150 py-1">
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      {/* Bottom accent */}
                      <div className="h-1 bg-gradient-to-r from-medical-500 to-medical-700 rounded-b-xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Right-side CTA in nav bar */}
            
          
          </nav>
        </div>
      </div>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-slate-200 shadow-lg overflow-hidden">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}>
                  {link.megaMenu ? (
                    <div>
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === link.name ? null : link.name,
                          )
                        }
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          isLinkActive(link)
                            ? "bg-medical-50 text-medical-600"
                            : "text-slate-700 hover:bg-medical-50 hover:text-medical-600"
                        }`}>
                        {link.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileExpanded === link.name
                              ? "rotate-180 text-medical-600"
                              : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileExpanded === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden">
                            <div className="ml-4 pl-4 border-l-2 border-medical-200 mb-2">
                              {link.megaMenu.map((col) => (
                                <div key={col.title} className="mb-3">
                                  <p className="text-xs font-bold text-medical-600 uppercase tracking-wide mt-2 mb-1">
                                    {col.title}
                                  </p>
                                  {col.items.map((item) => (
                                    <Link
                                      key={item.name}
                                      to={item.href}
                                      className="block py-1.5 px-2 text-sm text-slate-500 hover:text-medical-600 rounded transition-colors">
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isLinkActive(link)
                          ? "bg-medical-50 text-medical-600"
                          : "text-slate-700 hover:bg-slate-50 hover:text-medical-600"
                      }`}>
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}

              <div className="pt-3 border-t border-slate-100 pb-2">
                <Link
                  to="/enquiry"
                  className="block w-full text-center px-6 py-3 bg-medical-600 hover:bg-medical-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Get a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Search Overlay ─── */}
      <AnimatePresence>
        {isSearchOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-2 sm:pt-20 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 py-4 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400 mr-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsSearchOverlayOpen(false);
                      navigate(`/products?q=${searchQuery}`);
                    }
                  }}
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-base sm:text-lg"
                />
                <button 
                  onClick={() => setIsSearchOverlayOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="max-height-[70vh] overflow-y-auto p-6 space-y-8">
                {/* Popular Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <History className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setIsSearchOverlayOpen(false);
                          navigate(`/products?q=${term}`);
                        }}
                        className="px-4 py-1.5 bg-slate-50 hover:bg-medical-50 hover:text-medical-600 rounded-full text-sm text-slate-600 border border-slate-100 transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Products */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trending Products</h3>
                  </div>
                  <div className="space-y-4">
                    {trendingProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setIsSearchOverlayOpen(false)}
                        className="flex items-center gap-4 group p-2 -m-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 group-hover:text-medical-600 transition-colors truncate">{product.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 bg-medical-100 text-medical-700 rounded font-medium">{product.badge || 'Premium'}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-tight">{product.code}</span>
                          </div>
                        </div>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Footer Hint */}
                <div className="text-center pt-4 border-t border-slate-50">
                  <p className="text-[10px] text-slate-300">Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-sans">ESC</kbd> to close</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
