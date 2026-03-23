# Full-Stack Job Board Application

A full-stack job board platform where employers post jobs and candidates browse and apply. 
Built using React (Vite), Node.js, Express, PostgreSQL, MongoDB, and Tailwind CSS.

## Features
- **Employers:** Post new jobs, view list of submitted jobs, edit/delete jobs, and review applications with status updates (Accepted/Rejected/Reviewed).
- **Candidates:** Browse global job listings with Search/Filter features, apply to jobs with a cover letter + Cloudinary resume upload, and track application statuses.
- **Authentication:** Role-based access control (Employer vs Candidate) leveraging JWT.
- **Modern UI:** Premium dark mode styling using Tailwind CSS and Lucide React icons.

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, React Router v6, Tailwind CSS, Axios
- **Backend:** Node.js, Express, jsonwebtoken, express-validator, bcryptjs
- **Databases:** PostgreSQL (Relational User Auth), MongoDB (Document-based Jobs/Applications)
- **Containerization:** Docker & Docker Compose

---

## 🏗 Schema Decisions (Why Two Databases?)

This project deliberately uses both a SQL database (PostgreSQL) and a NoSQL database (MongoDB). Here is the justification for this architecture:

### 1. PostgreSQL logic for `Users`
Authentication, roles, and user information is inherently relational and strictly structured. SQL handles ACID compliance seamlessly, making PostgreSQL the perfect candidate to store passwords, emails, and exact roles.
- `users` (id UUID, name, email, password_hash, role, created_at)

### 2. MongoDB logic for `Jobs` and `Applications`
Job descriptions vary wildly. Some may require fields for 'benefits', others might not. Mongoose allows rapid iterations of this document without rigid schema migrations. Furthermore, saving massive blobs of text (like Resume URLs and Cover Letters in Applications) is well-suited for document storage. 
PostgreSQL UUIDs are stored as plain strings in MongoDB (`postedBy` and `candidateId`), bridging the two databases programmatically.

---

## 🚀 Local Setup & Execution

### 1. Requirements
Ensure you have the following installed:
- Node.js (v18+)
- Docker & Docker Compose

### 2. Environment Variables
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
NODE_ENV=development

# PostgreSQL (Matches docker-compose.yml values)
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=jobboard
PG_PASSWORD=postgres
PG_PORT=5432

# MongoDB (Atlas)
MONGO_URI=mongodb+srv://upadhayayyogesh832:123freelanceproject123@cluster0.ga6zbb8.mongodb.net/jobboard?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary (Used for resumes)
CLOUDINARY_CLOUD_NAME=dil5x4cxh
CLOUDINARY_API_KEY=585782464739395
CLOUDINARY_API_SECRET=e8q7eMypVZX30vTbT_m7PI4iUHc
```

### 3. Running with Docker Compose
This automatically boots a PostgreSQL instance (with the user table initialized via `init.sql`).
The backend connects to the live MongoDB Atlas cluster specified in the `.env`.
From the root directory, run:
```bash
docker-compose up
```
This starts PostgreSQL and the Node.js backend on `http://localhost:5000`.

### 4. Running the Frontend
In a separate terminal window, open the `/frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will open at `http://localhost:5173`.

---

## 🌐 Deployment Approach

### Backend (Railway)
1. Hosted as a direct container using Dockerfile or Node buildpacks.
2. Databases (PostgreSQL + MongoDB) are provisioned via Railway Managed PG / Mongo Atlas.
3. All environment variables matching the `.env` above are injected securely through the Railway Dashboard Secrets.

### Frontend (Netlify)
1. Deployed via Netlify GitHub integration.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Global environment variable set for `VITE_API_URL` pointing to the Railway Production URL.
