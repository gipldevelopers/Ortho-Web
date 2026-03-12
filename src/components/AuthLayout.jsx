import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({
  sideTitle,
  sideDescription,
  children,
  formSize = 'md',
}) {
  const formMaxWidthClass =
    formSize === 'lg' ? 'max-w-lg' : formSize === 'xl' ? 'max-w-xl' : 'max-w-md';
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="h-screen bg-white overflow-hidden">
      <div className="h-full grid lg:grid-cols-2">
        {/* Left: Brand / Message */}
        <div className="hidden lg:flex flex-col bg-[#f4f0ea] h-full">
          <div className="p-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-600 text-white font-extrabold flex items-center justify-center">
                O
              </div>
              <div className="leading-tight">
                <div className="text-xl font-bold text-slate-900">OrthoCare</div>
                <div className="text-xs text-slate-600">Medical Solutions</div>
              </div>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center px-14 pb-14">
            <div className="max-w-md text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
                {sideTitle}
              </h1>
              {sideDescription ? (
                <p className="mt-6 text-base leading-relaxed text-slate-600">
                  {sideDescription}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div ref={scrollRef} className="h-full bg-white overflow-y-auto scrollbar-hide">
          <div className="min-h-full flex items-start justify-center px-4 py-8 lg:py-10">
            <div className={`w-full ${formMaxWidthClass}`}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
