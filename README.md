# Team Task Manager (Full-Stack)

A premium, glassmorphic full-stack application for managing team projects and tasks with role-based access control.

## Features
- **Authentication**: JWT-based secure signup and login.
- **Roles**: 
  - `Admin`: Can create projects, create tasks, and assign tasks to members.
  - `Member`: Can view assigned tasks and update task status.
- **Premium UI**: Glassmorphic dark mode, sleek animations, and responsive design.

## Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, bcryptjs.

## Local Development

### 1. Backend Setup
1. Open a terminal and navigate to `backend/`.
2. Run `npm install` to install dependencies.
3. Ensure you have MongoDB running locally, or change the `MONGO_URI` in `backend/.env` to your MongoDB Atlas connection string.
4. Run `npm run dev` (requires `nodemon`) or `node server.js` to start the backend on port 5000.

### 2. Frontend Setup
1. Open a terminal and navigate to `frontend/`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite dev server.
4. Visit the local URL provided by Vite (usually `http://localhost:5173`).

## Deployment on Railway

To deploy this to Railway and get your live URL:

1. Create a GitHub repository and push this entire `assigment` folder to it.
2. Log into [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo**.
4. Select your repository.
5. Railway will detect the monorepo structure. You should deploy both the backend and frontend separately or use Railway's monorepo support.
   
**Database Provisioning on Railway:**
- In your Railway project, click **New** -> **Database** -> **MongoDB**.
- Once deployed, copy the MongoDB Connection URL and add it to your backend service's environment variables as `MONGO_URI`.

**Backend Service Variables:**
- `PORT` = `5000` (Railway automatically sets `PORT`, ensure your app listens to `process.env.PORT`).
- `MONGO_URI` = `<Your Railway MongoDB URL>`
- `JWT_SECRET` = `<A strong random string>`

**Frontend Service Build:**
- Change the base API URL in your frontend code (currently hardcoded to `http://localhost:5000`) to your deployed Railway backend URL before pushing, or configure it via `.env` variables.
- Build command: `npm run build`
- Start command: `npm run preview` or serve the static files from `dist/`.

> **Note:** For the final submission, make sure you record your 2-5 min demo video showing the role-based workflows (Admin creating a task, Member updating it).
