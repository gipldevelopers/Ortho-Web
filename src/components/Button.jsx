import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  type = 'button',
  disabled = false,
  href,
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'gradient-medical text-white hover:shadow-lg hover:shadow-medical-500/30 focus:ring-medical-500 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-medical-300 hover:text-medical-600 hover:shadow-md focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'bg-transparent border-2 border-medical-500 text-medical-600 hover:bg-medical-50 hover:shadow-md focus:ring-medical-500 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
    xl: 'px-10 py-4 text-lg',
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      type={href ? undefined : type}
      href={href}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {children}
    </Component>
  );
}
