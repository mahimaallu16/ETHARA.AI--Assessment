# TaskMind AI - AI-Powered Project Management SaaS

TaskMind AI is a modern, production-grade project management platform designed for high-performing teams. It combines robust task tracking with state-of-the-art AI features, now powered by **Google Gemini 2.5 Flash**, to streamline workflows and improve team collaboration.

## 🚀 Key Features

- **Advanced Dashboard**: Real-time analytics, productivity scores, and interactive activity feeds.
- **Project & Task Management**: Full CRUD operations for projects and tasks with status tracking, priority levels, and member assignments.
- **AI Tools**:
  - **AI Assistant**: A conversational interface powered by **Gemini 2.5 Flash** for project guidance and general inquiries.
  - **Smart Descriptions**: Automated professional task descriptions based on title and context.
- **Enhanced Settings**:
  - **Profile Management**: Update full name, email, and professional bio.
  - **Security**: Password management and session overviews.
  - **Personalization**: Theme switching (Light/Dark/System), accent color selection, and font size controls.
  - **Regional Settings**: Support for multiple languages and timezones.
- **RBAC**: Secure Role-Based Access Control (Admin, Manager, Team Member).
- **Responsive Design**: Premium UI/UX built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (Styling)
- **TanStack Query** (Server State Management)
- **Framer Motion** (Animations)
- **Recharts** (Interactive Analytics)
- **Lucide Icons** (Icon Set)
- **Axios** (API Communication)

### Backend
- **FastAPI** (High-performance Python Web Framework)
- **SQLAlchemy** (ORM)
- **PostgreSQL / SQLite** (Database support)
- **Google Generative AI SDK** (Gemini 2.5 Flash integration)
- **JWT** (Authentication & Security)
- **Pydantic v2** (Data Validation)
- **Gunicorn/Uvicorn** (Production Servers)

## 📁 Project Structure

```text
taskfy/
├── backend/
│   ├── app/
│   │   ├── api/        # API Routers & Endpoints (AI, Auth, Dashboard, etc.)
│   │   ├── core/       # Global Config & Security Logic
│   │   ├── db/         # Database Session & Base Class
│   │   ├── models/     # SQLAlchemy Database Models
│   │   ├── schemas/    # Pydantic Request/Response Schemas
│   │   ├── services/   # Business Logic (Gemini AI Integration, Auth)
│   │   └── main.py     # FastAPI Application Entry Point
│   ├── Procfile        # Deployment configuration for Railway
│   └── requirements.txt # Python Dependencies
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI Elements (Navbar, Sidebar)
    │   ├── context/    # React Context API (Auth Provider)
    │   ├── pages/      # Route Components (Dashboard, AI Tools, Settings)
    │   ├── layouts/    # Dashboard Shells
    │   └── utils/      # API Interceptors & Helpers
    ├── vercel.json     # Deployment configuration for Vercel
    └── package.json    # Node.js Dependencies & Scripts
```

## 🚦 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gemini API Key (from Google AI Studio)

### Backend Setup
1. Navigate to `backend/`
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Create a `.env` file based on the following template:
   ```env
   PROJECT_NAME="TaskMind AI"
   DATABASE_URL=sqlite:///./taskmind.db
   SECRET_KEY=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   CORS_ORIGINS=http://localhost:3000
   ```
5. Run the server: `uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. Build for production: `npm run build`

## ☁️ Deployment

### Backend (Railway)
- Connect your repo to Railway.
- The `Procfile` is pre-configured to use `gunicorn` with `uvicorn` workers.
- Ensure all environment variables (especially `DATABASE_URL` and `GEMINI_API_KEY`) are set in the Railway dashboard.

### Frontend (Vercel)
- Connect your repo to Vercel.
- The `vercel.json` ensures proper SPA routing.
- Set `VITE_API_URL` in Vercel settings to point to your Railway API endpoint.

---
Built with ❤️ by the TaskMind AI Engineering Team.
