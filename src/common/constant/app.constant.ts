import 'dotenv/config';

// Validate và lấy biến môi trường
const validateEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`⚠️  Environment variable ${key} is not defined`);
  }
  return value || '';
};

export const DATABASE_URL = validateEnv('DATABASE_URL');
export const ACCESS_TOKEN_SECRET = validateEnv('ACCESS_TOKEN_SECRET');
export const REFRESH_TOKEN_SECRET = validateEnv('REFRESH_TOKEN_SECRET');

// Log biến môi trường (chỉ log key, không log giá trị để bảo mật)
console.log(
  '\n✅ Environment Variables Status:',
  {
    DATABASE_URL: DATABASE_URL ? '✓ Loaded' : '✗ Missing',
    ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET ? '✓ Loaded' : '✗ Missing',
    REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET ? '✓ Loaded' : '✗ Missing',
  },
  '\n',
);
