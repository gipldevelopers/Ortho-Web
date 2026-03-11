import { motion } from 'framer-motion';
import { MessageCircle, Heart, Share2, Eye, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { toggleSaved, savedItems, addToEnquiry } = useAppContext();
  
  const isSaved = savedItems.includes(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl card-shadow overflow-hidden hover:card-shadow-hover transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="p-3 bg-white rounded-full text-slate-700 hover:text-medical-600 transition-colors"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSaved(product.id);
            }}
            className={`p-3 rounded-full transition-colors ${
              isSaved ? 'bg-medical-500 text-white' : 'bg-white text-slate-700 hover:text-medical-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToEnquiry(product);
            }}
            className="p-3 bg-white rounded-full text-slate-700 hover:text-medical-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-medical-500 text-white text-xs font-semibold rounded-full">
            {product.badge}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5">
        <div className="mb-1 sm:mb-2">
          <span className="text-[10px] sm:text-xs text-medical-600 font-semibold uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-medical-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[10px] sm:text-sm text-slate-400 mb-2">{product.code}</p>
        <p className="hidden sm:block text-sm text-slate-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 inline-flex items-center justify-center py-2 sm:py-3 border-2 border-slate-100 text-slate-700 rounded-lg sm:rounded-xl text-[10px] sm:text-sm hover:border-medical-500 hover:text-medical-600 transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 sm:mr-2" />
            Detail
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToEnquiry(product);
            }}
            className="flex-1 inline-flex items-center justify-center py-2 sm:py-3 bg-medical-500 text-white rounded-lg sm:rounded-xl text-[10px] sm:text-sm hover:bg-medical-600 transition-all duration-300"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 sm:mr-2" />
            Enquiry
          </button>
        </div>
      </div>
    </motion.div>
  );
}
