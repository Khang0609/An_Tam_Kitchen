import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from '@/routes/auth.routes.js';
import productRoutes from '@/routes/product.routes.js';
import inventoryRoutes from '@/routes/inventory.routes.js';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3001;

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',                       // Next.js dev
  process.env.FRONTEND_URL,                      // Vercel production URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,  // Required for HttpOnly cookie auth
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to An Tâm Kitchen API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

console.log('--- API STARTUP DEBUG ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT ENV:', process.env.PORT);
console.log('VERCEL ENV:', process.env.VERCEL);

if (process.env.NODE_ENV !== 'test') {
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 API Server is strictly listening on 0.0.0.0:${port}`);
  });
}



export default app;
