import { motion } from 'framer-motion';

export default function SectionTitle({ title, subtitle, centered = true, light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-6 ${centered ? 'text-center' : ''}`}
    >
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            light 
              ? 'bg-white/20 text-white' 
              : 'bg-medical-100 text-medical-700'
          }`}
        >
          {subtitle}
        </motion.span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      <div className={`mt-4 w-20 h-1 rounded-full ${centered ? 'mx-auto' : ''} ${light ? 'bg-white/50' : 'gradient-medical'}`} />
    </motion.div>
  );
}
