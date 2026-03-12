import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollToTopImmediate() {
  const html = document.documentElement;
  const body = document.body;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  html.scrollTop = 0;
  body.scrollTop = 0;

  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    html.scrollTop = 0;
    body.scrollTop = 0;
    html.style.scrollBehavior = previous;
  });
}

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    const active = document.activeElement;
    if (active && active instanceof HTMLElement) active.blur();

    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          const html = document.documentElement;
          const previous = html.style.scrollBehavior;
          html.style.scrollBehavior = 'auto';
          el.scrollIntoView({ block: 'start', behavior: 'auto' });
          html.style.scrollBehavior = previous;
        });
        return;
      }
    }

    scrollToTopImmediate();
  }, [pathname, search, hash]);

  return null;
}
