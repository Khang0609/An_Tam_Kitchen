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

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  const server = app.listen(Number(port), '0.0.0.0', () => {
    console.log(`🚀 API Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}


export default app;
