import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_55%)]" />
      <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-medical-200/50 blur-3xl" />
      <div className="absolute -bottom-32 -left-10 h-80 w-80 rounded-full bg-medical-100/80 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <img
          src="/logo/orthologo.png"
          alt="OrthoCare"
          className="mx-auto mb-8 h-24 w-auto"
          loading="lazy"
        />
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/90 text-medical-600 shadow-lg shadow-medical-200/40">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl md:text-4xl font-bold text-slate-900">
          Thank you for reaching out!
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          We have received your details. Our team will get back to you soon with the updated website and catalogue.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-medical-600 px-6 py-3 text-white font-semibold shadow-lg shadow-medical-200/50 hover:bg-medical-700 transition-colors"
          >
            Back To Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
