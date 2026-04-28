# TaskFlow — Mini SaaS Task Management App

A secure, full-stack multi-user task management application built with React, Node.js/Express, PostgreSQL, and Sequelize.

---

## Tech Stack

| Layer      | Technology                             |
|------------|----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS           |
| Backend    | Node.js, Express.js                    |
| Database   | PostgreSQL + Sequelize ORM             |
| Auth       | bcrypt (password hashing) + JWT        |

---

## Project Structure

```
Mini-SaaS-Task-App/
├── backend/
│   ├── config/         database.js       (Sequelize connection)
│   ├── controllers/    authController.js, taskController.js
│   ├── middlewares/    verifyToken.js
│   ├── models/         User.js, Task.js, index.js (associations)
│   ├── routes/         authRoutes.js, taskRoutes.js
│   ├── .env            ← fill this in (see below)
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/ Navbar, TaskItem, AddTaskForm, StatsBar, ProtectedRoute
    │   ├── context/    AuthContext.jsx
    │   ├── pages/      AuthPage.jsx, Dashboard.jsx
    │   ├── services/   api.js
    │   ├── App.jsx
    │   └── index.css
    ├── .env            ← fill this in (see below)
    └── index.html
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **PostgreSQL** installed locally **OR** a free cloud database (see options below)
- **Git**

---

## Step 1 — Set Up the Database

### Option A: Local PostgreSQL

1. Open pgAdmin or psql and create a new database:
   ```sql
   CREATE DATABASE mini_saas_db;
   ```
2. Note your username (default: `postgres`) and password.

### Option B: Cloud (Supabase — free tier, recommended)

1. Go to https://supabase.com → New Project
2. Copy the **Connection String** from Settings → Database → URI
3. You'll use this as `DATABASE_URL` in the backend `.env`

---

## Step 2 — Configure Environment Variables

### Backend (`backend/.env`)

Open `backend/.env` and update the values:

```env
PORT=5000

# For LOCAL PostgreSQL:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_saas_db
DB_USER=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE
USE_DATABASE_URL=false

# For CLOUD (Supabase / Neon / Render):
# DATABASE_URL=postgresql://user:password@host:5432/dbname
# USE_DATABASE_URL=true

JWT_SECRET=replace_this_with_a_very_long_random_string

CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

> When deploying, change `VITE_API_URL` to your live backend URL.

---

## Step 3 — Install & Run

### Backend

```bash
cd backend
npm install
npm run dev        # uses nodemon for hot-reload
# or: npm start   # production start
```

On first run, Sequelize will **automatically create the `users` and `tasks` tables** in your database. You'll see:
```
✅ Database connected successfully.
✅ Database tables synced.
🚀 Server running on http://localhost:5000
```

### Frontend

Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will open at **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint          | Body                          | Auth? |
|--------|-------------------|-------------------------------|-------|
| POST   | /api/auth/signup  | `{ name, email, password }`   | No    |
| POST   | /api/auth/login   | `{ email, password }`         | No    |
| GET    | /api/auth/me      | —                             | Yes   |

### Tasks
| Method | Endpoint               | Description              | Auth? |
|--------|------------------------|--------------------------|-------|
| GET    | /api/tasks             | Get my tasks (+ filters) | Yes   |
| GET    | /api/tasks/stats       | Get task counts          | Yes   |
| POST   | /api/tasks             | Create task              | Yes   |
| PUT    | /api/tasks/:id         | Update task              | Yes   |
| PATCH  | /api/tasks/:id/toggle  | Toggle complete/pending  | Yes   |
| DELETE | /api/tasks/:id         | Delete task              | Yes   |

Query params for `GET /api/tasks`: `status`, `priority`, `search`

---

## Deployment

### Database
- [Supabase](https://supabase.com) (free, recommended)
- [Neon](https://neon.tech) (free)
- [Render PostgreSQL](https://render.com) (free tier)

### Backend → [Render](https://render.com)
1. Push code to GitHub
2. New Web Service → connect repo → set root directory to `backend`
3. Build command: `npm install`  |  Start command: `npm start`
4. Add all environment variables from `backend/.env`

### Frontend → [Vercel](https://vercel.com)
1. New Project → connect repo → set root directory to `frontend`
2. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`
3. Deploy!

---

## Features

- ✅ Secure JWT authentication (signup / login / auto-logout)
- ✅ Private task isolation — users only see their own tasks
- ✅ Full CRUD: create, read, update, delete tasks
- ✅ Task statuses: Pending → In Progress → Completed
- ✅ Priority levels: Low / Medium / High
- ✅ Due dates
- ✅ Search & filter (by status, priority, keyword)
- ✅ Stats dashboard with progress bar
- ✅ Responsive design (mobile + desktop)
- ✅ Inline task editing
