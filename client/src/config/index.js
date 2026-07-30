const config = {
  api: {
    baseURL: import.meta.env.VITE_API_URL || '/api',
  },
  hero: {
    imageURL: import.meta.env.VITE_HERO_IMAGE_URL || 'https://images.unsplash.com/photo-1543353071-873f17a7a088?ixlib=rb-4.0.3',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'RecipeHub',
    env: import.meta.env.MODE || 'development',
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
};

if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn(
    'VITE_API_URL is not set. API calls will use relative path "/api". ' +
    'Set VITE_API_URL in client/.env for production builds.'
  );
}

export default config;
