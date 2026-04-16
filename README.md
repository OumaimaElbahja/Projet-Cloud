# 🌩️ Cloud Search Engine Web Application

A full-stack, cloud-ready search engine application developed for academic cloud computing requirements. Features native MongoDB `$text` indexing, debounced autocomplete, category filtering, cursor-based pagination, and a highly polished React UI.

## 📁 Repository Structure

\`\`\`
cloud-project/
├── backend/ # Express API, MongoDB connection, Search Logic
├── frontend/ # Vite + React, TailwindCSS, shadcn/ui components
└── docs/ # Report templates and presentation outlines
\`\`\`

## 🚀 Quick Start (Local Development)

### 1. Backend Setup

\`\`\`bash
cd backend
npm install

# Create a .env file base on the .env.example with your local or Atlas MongoDB URI

cp .env.example .env
npm run dev
\`\`\`

### 2. Seed Database

Open a new terminal to populate the database with over 150 items:
\`\`\`bash
cd backend
npm run seed
\`\`\`

### 3. Frontend Setup

Open a third terminal:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
_Visit \`http://localhost:5173\` in your browser._

## ☁️ Deployment Guide (100% Free Tier)

### Step 1: Database (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under Network Access, add `0.0.0.0/0` (Allow access from anywhere).
3. Get your connection string (MongoDB URI).

### Step 2: Backend (Render)

1. Create an account on [Render](https://render.com/).
2. Create a **New Web Service**, connect this GitHub repository.
3. Configure settings:
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variable:
   - `MONGO_URI` = `<Your MongoDB Atlas URI>`
5. Click **Deploy** and copy your `onrender.com` URL.

### Step 3: Seed Cloud Database

Execute the seed script against your live Render backend URL:
\`\`\`bash
curl -X POST https://your-app-name.onrender.com/api/seed
\`\`\`

### Step 4: Frontend (Vercel)

1. Log into [Vercel](https://vercel.com/) and import this GitHub repository.
2. Set the Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL` = `https://your-app-name.onrender.com/api`
4. Click **Deploy**.
5. Once complete, your Search Engine is live!

---

_Developed using Node.js, Express, MongoDB, Vite, React, and TailwindCSS._
