// ⚠️ KHÔNG import dotenv ở đây - nó đã được import ở main.ts
// Lấy giá trị trực tiếp từ process.env

export const DATABASE_URL = process.env.DATABASE_URL;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
