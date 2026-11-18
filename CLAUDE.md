# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PneumoFusion is an AI-assisted pneumonia screening platform consisting of a React frontend, Express.js Node backend, and a PyTorch + FastAPI machine learning service for X-ray classification and Grad-CAM visualization.

## Development Commands

### Client (`/client`)
- **Dev Server**: `cd client && npm run dev` (runs Vite on `http://localhost:8080`)
- **Build**: `cd client && npm run build` (outputs to `client/dist`)
- **Lint**: `cd client && npm run lint` (uses Oxlint)
- **Preview**: `cd client && npm run preview`

### Express API (`/api`)
- **Dev Server**: `cd api && npx nodemon server.js` (runs on `http://localhost:5000`)
- **Start**: `cd api && node server.js`
- **Seed Database**: `cd api && node seed.js` (creates test user `test@example.com` / `password123`)

### ML Service (`/ml-service`)
- **Dev Server**: `cd ml-service && venv/Scripts/activate && uvicorn main:app --reload --port 8000` (runs on `http://localhost:8000`)

## Architecture & Structure

```
.
├── client/          # React 19 + Vite + Tailwind CSS v4 frontend
├── api/             # Express.js REST API (ES Modules)
├── ml-service/      # Python FastAPI + PyTorch ML inference service
└── vercel.json      # Vercel deployment configuration
```

### Key Components & Flow

1. **Frontend (`client/`)**
   - **Framework**: React 19 with React Router v7, Vite, Tailwind CSS v4.
   - **Theme**: Dark/Light mode managed at `App.jsx` level via `localStorage` and `dark` class on `<html>`.
   - **API Layer**: `src/api/axios.js` configures Axios with `withCredentials: true` targeting `VITE_API_URL` (default `http://localhost:5000/api`).
   - **Pages**:
     - `Home.jsx`: Dashboard with stats, model information, floating AI assistant.
     - `Results.jsx`: Upload X-ray image, dispatch analysis request, view prediction and Grad-CAM overlay.
     - `FullReport.jsx`: Detailed screening report and probability breakdown.
     - `Login.jsx` / `Register.jsx`: Authentication pages.
   - **Components**: `Navbar`, `AssistantCard` (n8n AI assistant chat), `AuthCard`, `FormInput`, `StatCard`.

2. **Express API (`api/`)**
   - **Auth**: JWT stored in `httpOnly` cookie (`token`). `middleware/protect.js` provides `protect` and `guestOnly` route guards.
   - **Database**: Mongoose connected to MongoDB. Cached connection pattern in `lib/db.js` for serverless support on Vercel.
   - **Routes**:
     - `/api/auth`: `/register`, `/login`, `/logout`, `/me`
     - `/api/results`: `/analyze` accepts multipart file (`xray_image`), proxies to FastAPI `/predict`, handles optional fallback URL (`FASTAPI_URL_FALLBACK`), returns prediction probabilities and base64-encoded Grad-CAM images.
     - `/api/pf-chat`: `/pf-chat` proxies user chat queries to an external n8n AI webhook (`N8N_WEBHOOK_URL`).

3. **ML Service (`ml-service/`)**
   - **Model**: `EfficientNet-B2` (`timm`) loaded from `best_model.pth`.
   - **Endpoint**: `POST /predict` accepts image files (JPEG/PNG), normalizes tensor to 224x224, generates classification probabilities (`NORMAL` vs `PNEUMONIA`), and computes Grad-CAM heatmaps and region circles via OpenCV.

## Environment Configuration

- **`api/.env`**:
  - `PORT`: Express server port (default `5000`)
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_SECRET`: Secret key for JWT signing
  - `FRONTEND_URL`: Allowed CORS origin (default `http://localhost:8080`)
  - `FASTAPI_URL`: Primary ML service endpoint (default `http://localhost:8000`)
  - `FASTAPI_URL_FALLBACK`: Optional secondary ML service endpoint
  - `N8N_WEBHOOK_URL`: Webhook URL for n8n chat assistant integration
- **`client/.env`**:
  - `VITE_API_URL`: Express API endpoint (default `http://localhost:5000/api`)
