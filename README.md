# 📋 Team Task Manager

A full-stack collaborative task management web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Teams can create projects, assign tasks, manage members, and track progress through an intuitive dashboard.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router v6 |
| **Backend** | Node.js, Express 5, JWT Authentication, bcryptjs |
| **Database** | MongoDB (via Mongoose) |
| **HTTP Client** | Axios |
| **Charts** | Recharts |

---

## 📁 Project Structure

```
Team_Task_Manager/
├── client/               # React frontend (Vite)
│   ├── src/
│   │   ├── api/          # Axios instance & interceptors
│   │   ├── components/   # Reusable UI & modal components
│   │   ├── features/     # Redux slices (auth, projects, tasks)
│   │   ├── pages/        # Route-level page components
│   │   └── store.js      # Redux store
│   └── vite.config.js
│
└── server/               # Express backend
    ├── config/           # MongoDB connection
    ├── controllers/      # Auth, Project, Task logic
    ├── middleware/        # JWT auth middleware
    ├── models/           # Mongoose schemas (User, Project, Task)
    └── routes/           # API route definitions
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB](https://www.mongodb.com/) — local instance **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud URI

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sumit0925/Team_Task_Manager.git
cd Team_Task_Manager
```

---

### 2. Configure the Backend

Navigate to the `server` directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team_task_manager
JWT_SECRET_KEY=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
```

> **Notes:**
> - Replace `MONGODB_URI` with your MongoDB Atlas connection string if using cloud hosting.
> - `JWT_SECRET_KEY` should be a long, random, secure string.
> - `FRONTEND_URL` must match the URL where your React app is running.

Start the backend server:

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The server will start at: `http://localhost:5000`

---

### 3. Configure the Frontend

Open a **new terminal**, navigate to the `client` directory and install dependencies:

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and receive JWT | ❌ |
| GET/POST | `/api/projects` | List / Create projects | ✅ |
| GET/PUT/DELETE | `/api/projects/:id` | Get / Update / Delete project | ✅ |
| GET/POST | `/api/tasks` | List / Create tasks | ✅ |
| GET/PUT/DELETE | `/api/tasks/:id` | Get / Update / Delete task | ✅ |

All protected routes require the `Authorization: Bearer <token>` header.

## 🌍 Environment Variables Summary

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET_KEY` | Secret key used to sign JWT tokens | `mySuperSecretKey123!` |
| `FRONTEND_URL` | Allowed CORS origin (your frontend URL) | `http://localhost:5173` |

### Client (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL for all API requests | `http://localhost:5000` |

---

## 🛠️ Available Scripts

### Server

| Command | Description |
|---|---|
| `npm run dev` | Start server with nodemon (auto-reload) |
| `npm start` | Start server in production mode |

### Client

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 🔒 Security Notes

- Never commit your `.env` files to version control — both `server/` and `client/` have `.gitignore` entries for them.
- Use a strong, randomly generated value for `JWT_SECRET_KEY` in production.
- Restrict `FRONTEND_URL` in production to only your actual frontend domain to avoid unwanted CORS access.