import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category, index = 0 }) {
  const Icon = category.icon;
  const imageUrl = category.imageUrl || category.image;
  const title = category.name || 'Category';
  const fallbackLetter = title.trim().charAt(0).toUpperCase() || 'C';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={category.href}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ duration: 0.3 }}
          className="group relative bg-white rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-all duration-300 overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-medical-50/0 to-medical-100/0 group-hover:from-medical-50/50 group-hover:to-medical-100/50 transition-all duration-500" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-medical-100 to-medical-200 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : Icon ? (
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-medical-600" />
              ) : (
                <span className="text-medical-700 font-semibold text-lg sm:text-xl">
                  {fallbackLetter}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-900 mb-1.5 sm:mb-3 group-hover:text-medical-600 transition-colors line-clamp-1 sm:line-clamp-none">
              {title}
            </h3>
            
            {/* Description */}
            <p className="text-slate-500 text-[11px] sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
              {category.description}
            </p>
            
            {/* Link */}
            <div className="flex items-center text-medical-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-medical-100/50 rounded-full blur-2xl group-hover:bg-medical-200/50 transition-colors duration-500" />
        </motion.div>
      </Link>
    </motion.div>
  );
}
