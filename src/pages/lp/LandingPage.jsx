import { Download, Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATALOG_PATH = '/catalog/IGR-E-CATALOGUE%202026%20(1).pdf';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = CATALOG_PATH;
    a.download = 'IGR-E-CATALOGUE-2026.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_55%)]" />
      <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-medical-200/50 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-medical-100/80 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-4">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <img
              src="/logo/Screenshot 2026-03-16 144510-Photoroom.png"
              alt="Orthocare logo"
              className="h-[140px] w-auto mb-8"
              loading="lazy"
            />

            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-medical-700 border border-white/60">
              <span className="h-2 w-2 rounded-full bg-medical-500 animate-pulse" />
              Website update in progress
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              We are refreshing the experience.
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl">
              Our new site is on the way with an improved catalogue, faster navigation, and richer product details.
              Leave your details and we will notify you as soon as we are live.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-6 py-3 text-white font-semibold shadow-lg shadow-medical-200/50 hover:bg-medical-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Download Catalogue
              </button>
              
            </div>

            {/* <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Updated Catalogue', desc: 'Clean product grouping with specs and usage guidance.' },
                { title: 'Faster Responses', desc: 'Quick enquiries and distributor onboarding.' },
                { title: 'Medical Grade Quality', desc: 'ISO-compliant materials and manufacturing.' },
                { title: 'Global Reach', desc: 'Trusted in 50+ countries worldwide.' },
              ].map((item) => (
                <div key={item.title} className="glass rounded-2xl p-4 border border-white/60">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div> */}
          </div>

          <div className="glass rounded-3xl p-8 md:p-10 border border-white/70 card-shadow">
          

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                navigate('/lp/thank-you');
              }}
            >
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="lp-name">Name</label>
                <div className="mt-2 relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="lp-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-11 py-3 text-sm text-slate-700 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="lp-phone">Phone No</label>
                <div className="mt-2 relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="lp-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-11 py-3 text-sm text-slate-700 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="lp-email">Email</label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="lp-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-11 py-3 text-sm text-slate-700 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="lp-city">City</label>
                <div className="mt-2 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="lp-city"
                    name="city"
                    type="text"
                    required
                    placeholder="City / Region"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-11 py-3 text-sm text-slate-700 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="lp-message">
                  Message
                </label>
                <div className="mt-2 relative">
                  <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                  <textarea
                    id="lp-message"
                    name="message"
                    rows="4"
                    placeholder="Share any specific product interest"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-11 py-3 text-sm text-slate-700 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Notify Me When It Is Live
              </button>

              <div className="text-xs text-slate-500 text-center">
                We respect your privacy and will never share your details.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
