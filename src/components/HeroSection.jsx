import { motion } from 'framer-motion';
import { ArrowRight, Download, Shield, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Floating animation variants
const floatAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatAnimationSlow = {
  animate: {
    y: [-15, 15, -15],
    rotate: [-2, 2, -2],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatAnimationFast = {
  animate: {
    y: [-8, 8, -8],
    rotate: [3, -3, 3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Stagger container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

// Fade up animation
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Background decoration component
const BackgroundDecoration = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Soft gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-white via-medical-50/50 to-medical-100/30" />

    {/* Radial glow behind hero image */}
    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-medical-200/40 via-medical-100/20 to-transparent rounded-full blur-3xl" />

    {/* Abstract medical shapes */}
    <svg className="absolute top-20 left-10 w-32 h-32 text-medical-100/60" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>

    <svg className="absolute bottom-40 left-1/4 w-24 h-24 text-medical-200/50" viewBox="0 0 100 100">
      <path d="M20,50 Q50,20 80,50 Q50,80 20,50" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>

    {/* Soft grid pattern */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(to right, #0ea5e9 1px, transparent 1px),
          linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}
    />

    {/* Wave lines */}
    <svg className="absolute bottom-0 left-0 right-0 w-full h-32 text-medical-100/40" preserveAspectRatio="none" viewBox="0 0 1440 120">
      <path
        d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,120 L0,120 Z"
        fill="currentColor"
      />
    </svg>
  </div>
);

// Floating product visual component
const HeroVisual = () => {
  const products = [
    {
      src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=400&fit=crop",
      alt: "Knee Brace",
      className: "w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-32",
      animation: floatAnimation,
      position: "top-4 right-4 sm:top-8 sm:right-8"
    },
    {
      src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=250&h=300&fit=crop",
      alt: "Lumbar Support",
      className: "w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28",
      animation: floatAnimationSlow,
      position: "bottom-2 right-1/4 sm:bottom-2"
    },
    {
      src: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=220&h=280&fit=crop",
      alt: "Ankle Support",
      className: "w-14 h-18 sm:w-18 sm:h-22 md:w-20 md:h-24",
      animation: floatAnimationFast,
      position: "top-6 right-3/4 sm:bottom-2"
    }
  ];

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[500px]">
      {/* Main hero image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative">
          <img
            src="/home/hero/mainhero.jpg"
            alt="Medical Professional"
            className="w-48 h-60 sm:w-64 sm:h-80 md:w-80 md:h-96 lg:w-96 lg:h-[420px] object-cover rounded-2xl shadow-2xl"
          />

          {/* Glow effect behind main image */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-medical-400/20 to-transparent rounded-2xl blur-xl scale-110" />
        </div>
      </motion.div>

      {/* Floating product elements */}
      {products.map((product, index) => (
        <motion.div
          key={product.alt}
          className={`absolute ${product.position} z-10`}
          initial={{ y: 0 }}
          animate={product.animation.animate}
        >
          <div className={`${product.className} rounded-xl overflow-hidden shadow-lg border-2 border-white`}>
            <img
              src={product.src}
              alt={product.alt}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      ))}

      {/* Trust badges floating */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-medical-100"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-medical-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-medical-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">ISO Certified</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Medical Grade</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute top-1/2 right-0 sm:right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-medical-100"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900">28+ Years</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Experience</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Hero text component
const HeroText = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="text-center lg:text-left"
  >
    {/* Badge */}
    <motion.div variants={fadeUpVariants} className="inline-flex items-center space-x-2 mb-2 sm:mb-4 mt-12">
      <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-medical-100 text-medical-700 text-xs sm:text-sm font-medium rounded-full">
        Your Trusted Orthopedic Doctor Since 1995
      </span>
      <div className="flex items-center text-amber-500">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
    </motion.div>

    {/* Headline - Mobile: text-2xl, Tablet: text-4xl, Desktop: text-5xl/text-6xl */}
    <motion.h1
      variants={fadeUpVariants}
      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6"
    >
      Orthopaedic{' '}
      <span className="text-medical-600">Supports</span>
      <br className="hidden sm:block" />
      {' '}Designed by Experts for Genuine{' '}
      <span className="relative">
        Recovery
        <svg className="absolute -bottom-2 left-0 w-full h-3 text-medical-300" viewBox="0 0 200 12" preserveAspectRatio="none">
          <path d="M0,8 Q100,0 200,8" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </span>
    </motion.h1>

    {/* Subheadline - Mobile: text-sm, Tablet: text-base, Desktop: text-lg */}
    <motion.p
      variants={fadeUpVariants}
      className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed"
    >
      With nearly 30 years of working hand-in-hand with orthopedic surgeons, physiotherapists, and rehab specialists, we understand exactly what patients need to recover fully and safely.

    </motion.p>

    {/* Stats row */}
    <motion.div
      variants={fadeUpVariants}
      className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 mb-6 sm:mb-8"
    >
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-medical-500" />
        <span className="text-xs sm:text-sm text-slate-600">24/7 Dedicated Patient Support</span>
      </div>
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-medical-500" />
        <span className="text-xs sm:text-sm text-slate-600">CE Certiϐied Medical Devices</span>
      </div>
      <div className="flex items-center space-x-2">
        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-medical-500" />
        <span className="text-xs sm:text-sm text-slate-600">ISO 13485 Certiϐied Manufacturing
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-medical-500" />
        <span className="text-xs sm:text-sm text-slate-600">FDA Registered Orthopaedic Products</span>
      </div>
    </motion.div>
  </motion.div>
);

// Hero buttons component
const HeroButtons = () => (
  <motion.div
    variants={fadeUpVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay: 0.8 }}
    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
  >
    <Link
      to="/products"
      className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-medical-600 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-medical-700 transition-all duration-300 hover:shadow-lg hover:shadow-medical-500/30 hover:-translate-y-0.5"
    >
      Explore Products
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
    </Link>

    <Link
      to="/downloads"
      className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-slate-700 border-2 border-slate-200 text-sm sm:text-base font-medium rounded-xl hover:border-medical-500 hover:text-medical-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
      Download Catalogue
    </Link>
  </motion.div>
);

// Main Hero Section
export default function HeroSection() {
  return (
    <section className="relative flex items-center pt-2 lg:pt-2 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
      <BackgroundDecoration />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content - Mobile: stacked, Tablet/Desktop: left side */}
          <div className="order-2 lg:order-1">
            <HeroText />
            <div className="mt-6 sm:mt-8">
              <HeroButtons />
            </div>
          </div>

          {/* Visual Content - Mobile: top, Tablet/Desktop: right side */}
          <div className="order-1 lg:order-2">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
