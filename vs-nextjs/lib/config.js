/**
 * Application Configuration
 */

export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'VS Furniture',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

// Debug environment variables
if (typeof window !== 'undefined') {
  console.log('🔧 Environment variables:');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('Config API baseURL:', config.api.baseURL);
}

export default config;