import { motion } from 'framer-motion';
import { Download, FileText, Shield, Award, Clock, Search } from 'lucide-react';
import { useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { downloadFiles } from '../data';

export default function DownloadsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = downloadFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Download Centre"
            subtitle="Resources"
          />
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-slate-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {['All', 'Catalogues', 'Datasheets', 'Certifications'].map((category, i) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  i === 0
                    ? 'bg-medical-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Files Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover border border-slate-100 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 gradient-medical rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <file.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* File Info */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-medical-600 transition-colors">
                  {file.name}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                    {file.type}
                  </span>
                  <span>{file.size}</span>
                </div>
                
                {/* Download Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-slate-100 hover:bg-medical-50 text-slate-700 hover:text-medical-600 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-300 group"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  <span>Download</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Downloads',
                description: 'All files are scanned and verified for your security.',
              },
              {
                icon: Clock,
                title: 'Always Updated',
                description: 'Documents are regularly updated with latest information.',
              },
              {
                icon: Award,
                title: 'Certified Content',
                description: 'All technical documents are verified by our experts.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <item.icon className="w-6 h-6 text-medical-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
