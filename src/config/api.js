const rawApiBaseUrl = String(process.env.REACT_APP_API_BASE_URL || '').trim();

if (!rawApiBaseUrl) {
  throw new Error(
    'Missing REACT_APP_API_BASE_URL. Set it in frontend/.env.development, frontend/.env.staging, or frontend/.env.production.'
  );
}

const normalizedBaseUrl = rawApiBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = normalizedBaseUrl.endsWith('/index.php')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/index.php`;

export function buildApiUrl(route, params = {}) {
  const url = new URL(API_BASE_URL);

  if (route) {
    url.searchParams.set('route', route);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export default API_BASE_URL;
