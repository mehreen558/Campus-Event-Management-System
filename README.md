# Evex - Campus Event Management System

A full-stack inter-university event management platform connecting students across Pakistan's top educational institutions.

## Overview

Evex is a comprehensive event management platform that enables students to discover, register for, and manage events across multiple universities. Built with Next.js, FastAPI, and SQLite.

## Features

- **Multi-University Support** - Events from FAST-NU, LUMS, IBA, NUST, and more
- **Event Discovery** - Browse and search events across all partner universities
- **Rolebased Dashboard** - Role-based access for students, organizers and admin
- **Real-time Updates** - Live event status and registration counts
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode Support** - Built-in theme switching

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Lucide React Icons
- Next Themes (dark mode)

### Backend
- FastAPI (Python 3.12)
- SQLite (Development) / PostgreSQL (Production)
- SQLAlchemy ORM
- JWT Authentication

### Infrastructure
- Netlify (Deployment)

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.12+
- SQLite 3.45+

### Clone & Install

```bash
# Clone repository
git clone https://github.com/mehreen558/Campus-Event-Management-System.git
cd Campus-Event-Management-System

# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (.env)**
```env
DATABASE_URL=sqlite:///./evex.db
JWT_SECRET=your_secret_key_here
```

### Run Development Servers

```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
.
├── frontend/
│   ├── app/
│   │   ├── (auth)/      # Auth pages (login/register)
│   │   ├── (dashboard)/ # Dashboard & event management
│   │   ├── api/         # API routes
│   │   └── page.tsx     # Homepage
│   ├── components/      # Reusable components
│   ├── lib/            # Utilities & API client
│   └── types/          # TypeScript types
│
└── backend/
    ├── app/
    │   ├── api/         # FastAPI routes
    │   ├── core/        # Config & security
    │   ├── models/      # SQLAlchemy models
    │   ├── schemas/     # Pydantic schemas
    │   └── services/    # Business logic
    ├── venv/            # Python virtual environment
    └── tests/           # Unit tests
```

## API Endpoints

### Events
```
GET  /api/events           # List all events
GET  /api/events/{id}      # Get event details
POST /api/events           # Create event
PUT  /api/events/{id}      # Update event
DELETE /api/events/{id}    # Delete event
```

### Registration
```
POST /api/events/{id}/register   # Register for event
POST /api/events/{id}/unregister # Cancel registration
GET  /api/user/registrations     # Get user's registrations
```

### Auth
```
POST /api/auth/login      # Login
POST /api/auth/register   # Create account
POST /api/auth/logout     # Logout
GET  /api/auth/me         # Get current user
```


## Deployment

### Netlify (Frontend)
```bash
cd frontend
npm run build
netlify deploy --prod
```

### Manual Backend Deployment
```bash
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

