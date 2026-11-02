# WonderLust - Complete Full-Stack Deployment Guide

A step-by-step, beginner-friendly guide to deploy your college project online using **MongoDB Atlas**, **Render (Backend API)**, and **Vercel (React + Vite Frontend)**.

---

## 1. Project Overview & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios. Deployed on **Vercel**.
- **Backend**: Node.js, Express.js REST API, JWT Authentication, bcryptjs. Deployed on **Render** (as a Web Service).
- **Database**: MongoDB Mongoose. Hosted remotely on **MongoDB Atlas** (Free M0 Shared Cluster).

```text
User Browser
    ↓  (HTTPS)
Vercel (React Frontend Single Page App)
    ↓  (HTTPS API Requests with JWT Bearer Token)
Render (Node.js + Express REST API Server)
    ↓  (Encrypted TLS connection)
MongoDB Atlas (Cloud Database Cluster)
```

---

## 2. Directory Structure

```text
AI project/
├── .gitignore                    # Ensures node_modules and .env are never pushed
├── package.json                  # Root runner scripts
├── DEPLOYMENT_GUIDE.md           # Complete manual (this document)
├── DEPLOYMENT_CHECKLIST.md       # Pre-flight and post-deployment checklist
│
├── backend/
│   ├── .env                      # Local environment variables (DO NOT COMMIT)
│   ├── .env.example              # Template for Render environment variables
│   ├── package.json              # Backend dependencies and "start" script
│   └── src/
│       ├── config/db.js          # MongoDB connection (reads process.env.MONGO_URI)
│       ├── controllers/          # auth, property, and booking controllers
│       ├── middleware/           # authMiddleware.js, errorHandler.js, notFound.js
│       ├── models/               # User.js, Property.js, Booking.js
│       ├── routes/               # health.js, auth.js, properties.js, bookings.js
│       ├── seed/seed.js          # Seed script for 8 sample properties
│       └── server.js             # Express app (reads process.env.PORT, 0.0.0.0, CORS)
│
└── frontend/
    ├── .env                      # Local environment variables (VITE_API_URL)
    ├── .env.example              # Template for Vercel environment variables
    ├── index.html                # HTML entry point
    ├── package.json              # Frontend dependencies and "build" script
    ├── vercel.json               # SPA routing rewrite rule for Vercel
    ├── vite.config.js            # Vite configuration
    └── src/
        ├── App.jsx               # React Router routes
        ├── components/           # Navbar, Footer, ProtectedRoute
        ├── context/AuthContext.jsx # JWT state persistence
        ├── pages/                # Home, Explore, Details, Add, Edit, Bookings, Profile, etc.
        └── services/api.js       # Axios client (reads import.meta.env.VITE_API_URL)
```

---

## 3. Deployment Step 1: GitHub Repository Setup

### Step 1.1: Create GitHub Repository
1. Log into your account at [github.com](https://github.com).
2. In the top-right corner, click **`+`** → **New repository**.
3. **Repository name**: `wanderlust-booking-platform` (or your preferred name).
4. **Visibility**: Choose **Public** (recommended for college evaluation) or **Private**.
5. **DO NOT** check "Add a README file" or "Add .gitignore" (we already have them).
6. Click **Create repository**.
7. Copy the repository HTTPS URL (e.g. `https://github.com/YOUR_USERNAME/wanderlust-booking-platform.git`).

### Step 1.2: Push from Local Windows PowerShell
Open Windows PowerShell in your project folder (`c:\Users\Anuj Vishwakarma\Documents\Anuj\Delta 8\AI project`):

```powershell
# 1. Verify you are in the root project folder
pwd

# 2. Initialize Git if not already initialized
git init

# 3. Verify .gitignore is protecting secrets
git status
# Make sure node_modules and .env DO NOT appear in the list!

# 4. Stage and commit all files
git add .
git commit -m "Initial commit: full-stack Wanderlust project ready for deployment"

# 5. Set branch to main
git branch -M main

# 6. Add your GitHub remote repository (replace with YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/wanderlust-booking-platform.git

# 7. Push code to GitHub
git push -u origin main
```

---

## 4. Deployment Step 2: MongoDB Atlas (Cloud Database)

### Step 2.1: Create Free Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and Sign Up / Log In.
2. Click **Create** to deploy a database cluster.
3. Select **M0 (Free)** tier.
4. Provider: **AWS** or **Google Cloud**. Region: Choose the closest region (e.g., `Mumbai (ap-south-1)` or `Singapore`).
5. Cluster Name: `Cluster0` (or `wanderlust-cluster`).
6. Click **Create Deployment**.

### Step 2.2: Create Database User
1. Under **Security** → **Database Access** in the left sidebar:
2. Click **Add New Database User**.
3. Authentication Method: **Password**.
4. **Username**: e.g., `wanderlust_admin`
5. **Password**: Choose a secure password (avoid `@`, `:`, `/`, or `%` symbols in password to prevent URL parsing errors, or use alphanumeric like `WanderPass2026`).
6. Database User Privileges: **Built-in Role: Read and write to any database**.
7. Click **Add User**.

### Step 2.3: Configure Network Access (Allow Render Connection)
1. Under **Security** → **Network Access** in the left sidebar:
2. Click **Add IP Address**.
3. Click **ALLOW ACCESS FROM ANYWHERE** (`0.0.0.0/0`).
   *(Render dynamically changes outbound IPs on its free tier, so 0.0.0.0/0 is mandatory for Render backend connection).*
4. Click **Confirm**.

### Step 2.4: Copy Connection String
1. Under **Deployment** → **Database**, click **Connect** on your cluster.
2. Choose **Drivers** (Node.js).
3. Copy the SRV connection string. It will look like:
   ```text
   mongodb+srv://wanderlust_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Replace `<password>` with your database password, and insert your database name `wanderlust` right before `?`:
   ```text
   mongodb+srv://wanderlust_admin:WanderPass2026@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority
   ```

### Step 2.5: Seed Properties to MongoDB Atlas (Optional but Recommended)
In your local `backend/.env`, temporarily update `MONGO_URI` with your Atlas connection string, then run:
```powershell
cd backend
npm run seed
```
You will see: `[Seed] Successfully seeded 8 properties into MongoDB!`
Your Atlas cloud database now contains all 8 verified properties!

---

## 5. Deployment Step 3: Backend on Render

### Step 3.1: Create Render Web Service
1. Log into [render.com](https://render.com).
2. In the dashboard, click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** → click **Next**.
4. Connect your GitHub account and select your `wanderlust-booking-platform` repository.

### Step 3.2: Configure Web Service Settings
Fill in the exact fields as follows:
- **Name**: `wanderlust-backend-api` (or any unique name)
- **Region**: Choose the closest region (e.g. `Singapore` or `Frankfurt`)
- **Branch**: `main`
- **Root Directory**: `backend`  *(⚠️ Crucial! Do not leave empty)*
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`  *(or `node src/server.js`)*
- **Instance Type**: `Free`

### Step 3.3: Add Environment Variables in Render
Scroll down to the **Environment Variables** section and add:

| Key | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode |
| `PORT` | `10000` | (Render sets this automatically, but 10000 is default) |
| `MONGO_URI` | `mongodb+srv://wanderlust_admin:PASSWORD@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority` | Your Atlas string |
| `JWT_SECRET` | `wanderlust_production_super_secret_jwt_key_2026` | Any secure random string |
| `JWT_EXPIRE` | `30d` | Token validity |
| `CLIENT_URL` | `*` | Temporary: set to `*` initially, then change to your Vercel URL |

### Step 3.4: Deploy & Verify
1. Click **Deploy Web Service**.
2. Watch the deployment logs. You should see:
   ```text
   ==> Starting service with 'npm start'
   > staysphere-backend@1.0.0 start
   > node src/server.js
   [StaySphere API] Server listening in production mode on port 10000
   [StaySphere DB] MongoDB Connected: cluster0-shard-00.../wanderlust
   ==> Your service is live 🎉
   ```
3. Copy your Render URL from the top of the page (e.g. `https://wanderlust-backend-api.onrender.com`).
4. Test the health endpoint in your browser:
   `https://wanderlust-backend-api.onrender.com/api/health`
   Expected JSON response:
   ```json
   {
     "success": true,
     "service": "StaySphere API",
     "status": "healthy",
     "database": { "status": "Connected" }
   }
   ```
5. Test properties endpoint:
   `https://wanderlust-backend-api.onrender.com/api/properties`

---

## 6. Deployment Step 4: Frontend on Vercel

### Step 4.1: Import Project to Vercel
1. Log into [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your `wanderlust-booking-platform` repository and click **Import**.

### Step 4.2: Configure Vercel Project
- **Project Name**: `wanderlust-stays` (or any preferred name)
- **Framework Preset**: `Vite` (Vercel automatically detects this)
- **Root Directory**: Click **Edit** next to Root Directory, select `frontend`, and click **Continue**. *(⚠️ Crucial!)*
- **Build Command**: `npm run build` (Default)
- **Output Directory**: `dist` (Default)

### Step 4.3: Add Environment Variables in Vercel
Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://wanderlust-backend-api.onrender.com/api` |

*(⚠️ Ensure you include the `/api` suffix at the end of your Render backend URL!)*

### Step 4.4: Deploy
1. Click **Deploy**.
2. Deployment will complete in ~30–45 seconds.
3. Click **Continue to Dashboard** or visit your live URL:
   `https://wanderlust-stays.vercel.app`

---

## 7. Deployment Step 5: Final CORS Handshake

Now that your frontend has its official Vercel domain:
1. Go back to your **Render Dashboard** → `wanderlust-backend-api` → **Environment**.
2. Edit `CLIENT_URL`:
   - Set value to your Vercel URL: `https://wanderlust-stays.vercel.app`
3. Click **Save Changes**. Render will automatically redeploy the backend with the new CORS origin in ~30 seconds.

---

## 8. Testing Your Live Website

Test the complete user flow on your live Vercel URL (`https://wanderlust-stays.vercel.app`):
1. **Home Page**: Verify hero section, destination cards, and search bar load properly.
2. **Explore Page**: Verify all 8 properties load from MongoDB Atlas with images, ratings, and prices.
3. **Search & Filter**: Search `"Goa"` or filter by `"Villa"` — confirm matching properties update dynamically.
4. **Property Details**: Click **"View Details"** on any card — verify description, amenities, and pricing widget load.
5. **Registration**: Click **Sign In** → **Sign up** → create an account (e.g. `test@wanderlust.com`). Confirm user is saved to Atlas and session logs in.
6. **Booking**: Select dates and click **Book Now**. Verify redirection to **My Bookings** showing confirmed reservation.
7. **Leave a Review**: On any property details page, submit a 5-star rating and comment. Confirm it renders in the review list.
8. **Add Property**: Click **Add Property**, fill in details, and publish. Confirm it appears immediately on the Explore page.
9. **SPA Route Refresh**: While on `https://wanderlust-stays.vercel.app/explore` or `/bookings`, press `F5` / Refresh. Confirm the page reloads cleanly without a 404 error (handled by `vercel.json`).
