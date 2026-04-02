import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, MessageCircle, ArrowRight, Activity, Shield, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import FeatureCard from '../components/FeatureCard';
import Button from '../components/Button';
import HeroSection from '../components/HeroSection';
import BodyMap from '../components/BodyMap';
import { categories, featuredProducts, whyChooseUs, statistics } from '../data';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost/ortho-website/backend/public/index.php';

// Animated counter component
function AnimatedCounter({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const numValue = parseInt(value.replace(/\D/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setCount(numValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-medical-100 text-sm">{label}</div>
    </motion.div>
  );
}

export default function HomePage() {
  const [categoryItems, setCategoryItems] = useState(categories);
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}?route=categories`);
        const data = await response.json();

        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Unable to load categories.');
        }

        const mapped = data.data.map((item) => {
          const name = item.name || 'Category';
          return {
            id: item.id,
            name,
            description: item.description || `Explore products in ${name}.`,
            imageUrl: item.imageUrl || '',
            href: `/products?category=${encodeURIComponent(name)}`,
          };
        });

        if (isMounted) {
          setCategoryItems(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setCategoryError(err.message || 'Unable to load categories.');
        }
      }
    };

    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* New Hero Section */}
      <HeroSection />

      {/* Experience Section */}
      <section className="py-10 gradient-medical relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Body Map Section - Locate Your Pain */}
      <BodyMap />

      {/* Categories Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Product Categories"
          />

          {categoryError && (
            <div className="mb-4 text-sm text-red-600">
              {categoryError} Showing default categories.
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryItems.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-10 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Featured Products"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button href="/products" variant="secondary" size="lg">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Why Choose Us"
          />
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {whyChooseUs.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 relative overflow-hidden">
        <div className="absolute inset-0 gradient-medical" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass rounded-3xl p-12 md:p-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Partner With Us for Quality Orthopaedic Solutions
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Join our network of distributors and healthcare partners. 
                Access our complete product catalogue and exclusive partner benefits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/downloads" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download Catalogue
                </Button>
                <Button href="/distributor" variant="secondary" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Become Distributor
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
