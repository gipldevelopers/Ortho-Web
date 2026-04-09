import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Download, Award, Shield } from 'lucide-react';

const footerLinks = {
  products: [
    { name: 'Compression Products', href: '/products/compression' },
    { name: 'Knee Supports', href: '/products/knee' },
    { name: 'Ankle & Foot', href: '/products/ankle-foot' },
    { name: 'Wrist & Hand', href: '/products/wrist-hand' },
    { name: 'Lumbar Support', href: '/products/lumbar' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Manufacturing', href: '/about#manufacturing' },
    { name: 'Certifications', href: '/about#certifications' },
    { name: 'Careers', href: '/careers' },
    { name: 'News', href: '/news' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'Downloads', href: '/downloads' },
    { name: 'Distributor', href: '/distributor' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
};

const certifications = [
  { name: 'ISO 13485 Certiϐied', icon: Shield },
  { name: 'CE Marked Products', icon: Award },
  { name: 'FDA Registered ', icon: Shield },
  { name: 'GMP Compliant', icon: Award },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Certifications Bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 rounded-lg bg-medical-500/20 flex items-center justify-center">
                  <cert.icon className="w-6 h-6 text-medical-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">{cert.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-auto h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1">
                <img
                  src="/logo/orthologo.png"
                  alt="OrthoCare"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
          
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Leading manufacturer of premium orthopaedic and rehabilitation products. 
              Trusted by hospitals, surgeons, and medical professionals worldwide since 1995.
            </p>
            <div className="space-y-3">
              <a href="mailto:info@orthocare.com" className="flex items-center space-x-3 text-slate-400 hover:text-medical-400 transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@orthocare.com</span>
              </a>
              <a href="tel:+1234567890" className="flex items-center space-x-3 text-slate-400 hover:text-medical-400 transition-colors">
                <Phone className="w-5 h-5" />
                <span>+1 234 567 890</span>
              </a>
              <div className="flex items-start space-x-3 text-slate-400">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span>123 Medical District, Healthcare City<br />HC 12345, USA</span>
              </div>
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-400 hover:text-medical-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-400 hover:text-medical-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-slate-400 hover:text-medical-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-slate-400 text-sm text-center">
              &copy; {new Date().getFullYear()} OrthoCare Medical Solutions. All rights reserved.
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-4">
              <div className="flex items-center justify-center gap-0 text-slate-400 text-sm md:col-start-2 md:justify-self-center">
                <span className="uppercase tracking-widest text-[11px] text-slate-500">Powered by</span>
                <a
                  href="https://gohilinfotech.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition duration-200 hover:opacity-90 hover:brightness-110"
                  aria-label="Gohil Infotech"
                >
                  <img
                    src="/logo/GIPL_Full-Logo-1-e1750248270610-removebg-preview.png"
                    alt="Gohil Infotech"
                    className="h-10 w-auto object-contain"
                    loading="lazy"
                  />
                </a>
              </div>
              <div className="flex items-center justify-center space-x-6 md:col-start-3 md:justify-self-end">
                <a href="#" className="text-slate-400 hover:text-medical-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-medical-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-medical-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-slate-400 hover:text-medical-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
