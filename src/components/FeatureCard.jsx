import { motion } from 'framer-motion';

export default function FeatureCard({ feature, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl p-4 sm:p-8 card-shadow hover:card-shadow-hover transition-all duration-300"
    >
      {/* Icon */}
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-medical-500/30">
        <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>
      
      {/* Title */}
      <h3 className="text-sm sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-3 line-clamp-2">
        {feature.title}
      </h3>
      
      {/* Description */}
      <p className="text-slate-500 text-[11px] sm:text-base leading-relaxed line-clamp-3 sm:line-clamp-none">
        {feature.description}
      </p>
    </motion.div>
  );
}
