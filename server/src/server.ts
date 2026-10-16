import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { initDatabase } from './db/db';
import authRoutes from './routes/authRoutes';
import cycleRoutes from './routes/cycleRoutes';
import moodRoutes from './routes/moodRoutes';
import symptomRoutes from './routes/symptomRoutes';
import medicationRoutes from './routes/medicationRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import communityRoutes from './routes/communityRoutes';
import aiRoutes from './routes/aiRoutes';
import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Flora Period Tracker API</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 2rem;
          background: linear-gradient(135deg, #FFF8F6 0%, #FFEBF2 50%, #FFF4F8 100%);
          color: #4A1525;
          transition: background 0.4s ease, color 0.4s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
        }
        body.dark-mode {
          background: linear-gradient(135deg, #1A0A19 0%, #290F28 50%, #150718 100%);
          color: #FFEBF2;
        }
        .container {
          max-width: 600px;
          width: 100%;
          background: rgba(255, 245, 248, 0.85);
          backdrop-filter: blur(16px);
          padding: 2.5rem;
          border-radius: 28px;
          box-shadow: 0 15px 35px rgba(224, 108, 146, 0.12);
          border: 1.5px solid rgba(244, 114, 182, 0.3);
          position: relative;
        }
        body.dark-mode .container {
          background: rgba(38, 16, 37, 0.85);
          border-color: rgba(244, 114, 182, 0.35);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.45);
        }
        h1 { color: #DB2777; margin-top: 0; display: flex; align-items: center; justify-content: space-between; font-size: 1.75rem; }
        body.dark-mode h1 { color: #F472B6; }
        .toggle-switch-container {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 228, 235, 0.8);
          backdrop-filter: blur(12px);
          padding: 6px 14px 6px 8px;
          border-radius: 30px;
          border: 1.5px solid rgba(244, 114, 182, 0.4);
          cursor: pointer;
          user-select: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(219, 39, 119, 0.12);
        }
        body.dark-mode .toggle-switch-container {
          background: rgba(58, 20, 56, 0.8);
          border-color: rgba(244, 114, 182, 0.4);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
        }
        .toggle-track {
          width: 44px;
          height: 24px;
          border-radius: 20px;
          background: linear-gradient(135deg, #FBCFE8 0%, #F472B6 100%);
          position: relative;
          transition: background 0.4s ease;
          padding: 2px;
          box-sizing: border-box;
        }
        body.dark-mode .toggle-track {
          background: linear-gradient(135deg, #7E22CE 0%, #9D174D 100%);
        }
        .toggle-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }
        body.dark-mode .toggle-thumb {
          transform: translateX(20px);
          background: #fbbf24;
          box-shadow: 0 0 10px rgba(251, 191, 36, 0.6);
        }
        .toggle-label {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #be185d;
          transition: color 0.3s;
        }
        body.dark-mode .toggle-label {
          color: #f472b6;
        }
        a { color: #be185d; text-decoration: none; font-weight: 600; }
        body.dark-mode a { color: #f472b6; }
        a:hover { text-decoration: underline; }
        .link-card {
          background: rgba(219, 39, 119, 0.08);
          padding: 1.2rem 1.5rem;
          border-radius: 18px;
          margin-top: 1rem;
          border: 1px solid rgba(219, 39, 119, 0.1);
          transition: all 0.3s ease;
        }
        .link-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(219, 39, 119, 0.12);
        }
        body.dark-mode .link-card {
          background: rgba(219, 39, 119, 0.12);
          border-color: rgba(244, 114, 182, 0.15);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>
          <span>🌸 Flora API</span>
          <div class="toggle-switch-container" id="themeToggleBtn" onclick="toggleTheme()" role="button" tabindex="0">
            <div class="toggle-track">
              <div class="toggle-thumb" id="toggleThumb">✨</div>
            </div>
            <span class="toggle-label" id="toggleLabel">Vintage</span>
          </div>
        </h1>
        <p>Express REST API backend for Flora Period Tracker, running on port 5000.</p>
        
        <div class="link-card">
          <strong>Frontend Web App:</strong><br>
          <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>
        </div>
        
        <div class="link-card">
          <strong>Health Check Endpoint:</strong><br>
          <a href="/api/health" target="_blank">/api/health</a>
        </div>
      </div>

      <script>
        function updateUI() {
          const isDark = document.body.classList.contains('dark-mode');
          document.getElementById('toggleLabel').innerText = isDark ? 'Midnight' : 'Vintage';
          document.getElementById('toggleThumb').innerText = isDark ? '🌙' : '✨';
        }
        function toggleTheme() {
          document.body.classList.toggle('dark-mode');
          const isDark = document.body.classList.contains('dark-mode');
          localStorage.setItem('flora-backend-theme', isDark ? 'dark' : 'light');
          updateUI();
        }
        if (localStorage.getItem('flora-backend-theme') === 'dark') {
          document.body.classList.add('dark-mode');
        }
        updateUI();
      </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Flora Period Tracker Express REST API',
    time: new Date().toISOString()
  });
});

// Handle Chrome DevTools auto-discovery probe
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req: Request, res: Response) => {
  res.status(204).end();
});

// Handle favicon.ico to prevent 404 console logs
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🌸 Flora Express REST API Server running at http://localhost:${PORT}`);
  await initDatabase();
});

