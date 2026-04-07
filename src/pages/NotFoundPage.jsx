import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="relative min-h-[calc(100vh-108px)] overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(2,132,199,0.2),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_45%,_#082f49_100%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-108px)] max-w-6xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">
              Error 404
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              This page is not available right now.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The link may be outdated, the page may have moved, or the address may be incorrect.
              You can return to the main experience and continue browsing Ortho products and resources.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
              >
                Go To Homepage
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Go Back
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-sky-300/20 bg-slate-900/80 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15">
                  <span className="text-2xl font-black text-sky-300">404</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">Page Not Found</p>
                  <p className="text-sm text-slate-400">Frontend route fallback is active.</p>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Refreshing a valid frontend route should now load the React app instead of the server 404 page.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Invalid frontend routes will stay inside the app and render this custom page.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
