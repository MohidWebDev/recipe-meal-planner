import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import mealPlanRoutes from './routes/mealPlan.routes.js';
import shoppingListRoutes from './routes/shoppingList.routes.js';
import statsRoutes from './routes/stats.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// CLIENT_URL may contain several comma-separated origins (e.g. local + deployed).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Public health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/stats', statsRoutes);

// 404 for unknown routes, then the central error handler (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
