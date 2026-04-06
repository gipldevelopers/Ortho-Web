import { motion } from 'framer-motion';
import { Download, Shield, Award, Clock, Search, Eye, Briefcase, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import SectionTitle from '../components/SectionTitle';
import { downloadFiles } from '../data';
import { buildApiUrl } from '../config/api';

function escapePdfText(text) {
  return String(text).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)');
}

function buildMockPdfBytes({ title, description, meta = [] }) {
  const encoder = new TextEncoder();

  const header = '%PDF-1.4\n';

  const contentLines = [
    { size: 20, text: title },
    ...(description ? [{ size: 12, text: description }] : []),
    ...(meta.length ? [{ size: 12, text: '' }, ...meta.map((t) => ({ size: 11, text: t }))] : []),
    { size: 11, text: '' },
    { size: 10, text: `Generated (mock): ${new Date().toLocaleString()}` },
  ];

  const startX = 72;
  let y = 760;
  const lineGap = 18;

  const contentStream = [
    'BT',
    ...contentLines.map(({ size, text }) => {
      const safe = escapePdfText(text);
      const line = `1 0 0 1 ${startX} ${y} Tm /F1 ${size} Tf (${safe}) Tj`;
      y -= lineGap;
      return line;
    }),
    'ET',
    '',
  ].join('\n');

  const contentStreamBytes = encoder.encode(contentStream);

  const objects = [
    null,
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n',
    `4 0 obj\n<< /Length ${contentStreamBytes.length} >>\nstream\n${contentStream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ];

  let offset = encoder.encode(header).length;
  const offsets = [0];
  const bodyChunks = [];

  for (let i = 1; i < objects.length; i += 1) {
    offsets[i] = offset;
    const chunkBytes = encoder.encode(objects[i]);
    bodyChunks.push(chunkBytes);
    offset += chunkBytes.length;
  }

  const xrefStart = offset;
  const xrefLines = ['xref', `0 ${objects.length}`, '0000000000 65535 f '];

  for (let i = 1; i < objects.length; i += 1) {
    const off = String(offsets[i]).padStart(10, '0');
    xrefLines.push(`${off} 00000 n `);
  }

  const trailer = [
    ...xrefLines,
    'trailer',
    `<< /Size ${objects.length} /Root 1 0 R >>`,
    'startxref',
    String(xrefStart),
    '%%EOF\n',
  ].join('\n');

  const headerBytes = encoder.encode(header);
  const trailerBytes = encoder.encode(trailer);

  const totalLength =
    headerBytes.length +
    bodyChunks.reduce((sum, chunk) => sum + chunk.length, 0) +
    trailerBytes.length;

  const result = new Uint8Array(totalLength);
  let cursor = 0;
  result.set(headerBytes, cursor);
  cursor += headerBytes.length;
  for (const chunk of bodyChunks) {
    result.set(chunk, cursor);
    cursor += chunk.length;
  }
  result.set(trailerBytes, cursor);

  return result;
}

function downloadPdfBytes(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function openPdfInNewTab(bytes) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState(downloadFiles);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const iconForCategory = (category) => {
      const value = String(category || '').toLowerCase();
      if (value.includes('cert')) return Shield;
      if (value.includes('price')) return Briefcase;
      if (value.includes('guide')) return Award;
      return FileText;
    };

    const fetchDownloads = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const response = await fetch(buildApiUrl('downloads'));
        const data = await response.json();

        if (!response.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Unable to load downloads.');
        }

        if (isMounted) {
          const mapped = data.data.map((item) => ({
            ...item,
            icon: iconForCategory(item.category),
          }));
          setDownloads(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setDownloads(downloadFiles);
          setLoadError(err.message || 'Unable to load downloads.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDownloads();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    'All',
    ...Array.from(new Set(downloads.map((f) => f.category).filter(Boolean))),
  ];

  const query = searchQuery.trim().toLowerCase();
  const filteredFiles = downloads.filter((file) => {
    const matchesCategory = activeCategory === 'All' || file.category === activeCategory;
    const matchesQuery =
      !query ||
      file.name.toLowerCase().includes(query) ||
      (file.description || '').toLowerCase().includes(query) ||
      (file.tags || []).some((t) => String(t).toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const handleDownload = (file) => {
    if (file.downloadUrl) {
      const link = document.createElement('a');
      link.href = file.downloadUrl;
      link.rel = 'noopener';
      link.click();
      return;
    }

    const bytes = buildMockPdfBytes({
      title: file.name,
      description: file.description,
      meta: [
        `Category: ${file.category || '-'}`,
        `Type: ${file.type || '-'}`,
        `Size: ${file.size || '-'}`,
        `Last updated: ${file.updatedAt || '-'}`,
      ],
    });
    const safeName = String(file.name || 'download').replaceAll(/[^a-z0-9-_ ]/gi, '').trim() || 'download';
    downloadPdfBytes(bytes, `${safeName}.pdf`);
  };

  const handlePreview = (file) => {
    if (file.previewUrl || file.downloadUrl) {
      const url = file.previewUrl || file.downloadUrl;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const bytes = buildMockPdfBytes({
      title: file.name,
      description: file.description,
      meta: [
        `Category: ${file.category || '-'}`,
        `Type: ${file.type || '-'}`,
        `Size: ${file.size || '-'}`,
        `Last updated: ${file.updatedAt || '-'}`,
      ],
    });
    openPdfInNewTab(bytes);
  };

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
          {loadError && (
            <div className="mb-6 text-sm text-red-600">
              {loadError} Showing local data.
            </div>
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-medical-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-600">
              {isLoading ? (
                'Loading documents...'
              ) : (
                <>
                  Showing <span className="font-semibold text-slate-900">{filteredFiles.length}</span>{' '}
                  {filteredFiles.length === 1 ? 'document' : 'documents'}
                </>
              )}
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-sm text-medical-600 hover:text-medical-700"
            >
              Clear filters
            </button>
          </div>

          {/* Files Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id || file.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut', delay: index * 0.03 }}
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
                {file.description ? (
                  <p className="text-sm text-slate-600 mb-4">
                    {file.description}
                  </p>
                ) : null}
                
                <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                    {file.type}
                  </span>
                  <span>{file.size}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 mb-5">
                  <span className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                    {file.category || 'Resources'}
                  </span>
                  {file.updatedAt ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {file.updatedAt}
                    </span>
                  ) : null}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePreview(file)}
                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Preview</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDownload(file)}
                    className="w-full py-3 bg-slate-100 hover:bg-medical-50 text-slate-700 hover:text-medical-600 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 group"
                  >
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Download</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFiles.length === 0 ? (
            <div className="mt-10 text-center border-2 border-dashed border-slate-200 rounded-2xl py-12">
              <p className="text-slate-600 font-medium">No documents found</p>
              <p className="text-sm text-slate-500 mt-1">Try a different search or clear filters.</p>
            </div>
          ) : null}
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
