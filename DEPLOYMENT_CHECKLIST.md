# WonderLust - Full-Stack Deployment Checklist

Use this checklist before, during, and after deploying to ensure a smooth, error-free demonstration.

---

## 1. Pre-Deployment (Local Verification)
- [x] Frontend builds with 0 errors: `npm run build` inside `frontend/` succeeds.
- [x] Backend syntax & imports verified: `node src/server.js` inside `backend/` starts cleanly.
- [x] `.gitignore` verified: `node_modules`, `.env`, and `dist/` are properly ignored.
- [x] SPA Routing: `frontend/vercel.json` rewrite rule is present.
- [x] CORS configuration: `backend/src/server.js` supports dynamic origins, `.vercel.app`, and `CLIENT_URL`.
- [x] Host binding: `backend/src/server.js` listens on `0.0.0.0` with `process.env.PORT`.
- [x] Axios Client: `frontend/src/services/api.js` dynamically uses `import.meta.env.VITE_API_URL`.

---

## 2. GitHub Preparation
- [ ] Local Git repository initialized: `git init`.
- [ ] No `.env` or `node_modules` committed: `git status` checked.
- [ ] Code committed: `git commit -m "Initial commit"`.
- [ ] Remote added: `git remote add origin https://github.com/YOUR_USER/wanderlust-booking-platform.git`.
- [ ] Code pushed: `git push -u origin main`.
- [ ] Verified on GitHub: repository displays `backend/`, `frontend/`, and root files.

---

## 3. MongoDB Atlas (Cloud Database)
- [ ] Atlas free M0 cluster created (e.g. `Cluster0` in `Mumbai` or nearest region).
- [ ] Database user created with username and password (e.g. `wanderlust_admin`).
- [ ] Network Access set to **Allow Access from Anywhere** (`0.0.0.0/0`).
- [ ] Connection string copied: `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/wanderlust?retryWrites=true&w=majority`.
- [ ] Seed data populated: `npm run seed` run locally with Atlas URI to seed 8 sample properties.

---

## 4. Backend Deployment (Render)
- [ ] Render account created / logged in.
- [ ] New Web Service created from GitHub repo.
- [ ] **Root Directory** set to: `backend`.
- [ ] **Build Command** set to: `npm install`.
- [ ] **Start Command** set to: `npm start`.
- [ ] Environment variables configured:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGO_URI=mongodb+srv://...`
  - [ ] `JWT_SECRET=...`
  - [ ] `CLIENT_URL=*` (temporary until Vercel URL is available)
- [ ] Deployment succeeded (green "Live" badge).
- [ ] Health check verified: `https://your-backend.onrender.com/api/health` returns `healthy`.
- [ ] Properties check verified: `https://your-backend.onrender.com/api/properties` returns count 8.

---

## 5. Frontend Deployment (Vercel)
- [ ] Vercel account created / logged in.
- [ ] GitHub repository imported into Vercel.
- [ ] **Root Directory** set to: `frontend`.
- [ ] **Framework Preset** detected as: `Vite`.
- [ ] **Build Command**: `npm run build`.
- [ ] **Output Directory**: `dist`.
- [ ] Environment variable configured:
  - [ ] `VITE_API_URL=https://your-backend.onrender.com/api`.
- [ ] Deployment succeeded (Confetti screen & preview URL generated).
- [ ] Live Vercel URL copied: `https://your-frontend.vercel.app`.

---

## 6. Final Handshake & CORS Sync
- [ ] In Render Dashboard → Environment Variables:
  - [ ] Updated `CLIENT_URL=https://your-frontend.vercel.app`.
- [ ] Render automatically redeployed with updated origin.

---

## 7. End-to-End Live Testing
- [ ] **Home Page**: Loads banner, search bar, and service health card without errors.
- [ ] **Explore Page**: Loads all 8 properties from MongoDB Atlas.
- [ ] **Search**: Searching "Mumbai" returns Mumbai properties.
- [ ] **Filters**: Filtering by "Villa" returns Villa properties.
- [ ] **Property Details**: Clicking "View Details" opens `/properties/:id` with complete details.
- [ ] **User Registration**: Register a new user at `/register` — user saved in Atlas, token generated.
- [ ] **User Login & Session**: Sign out and sign in again — session persists in `localStorage`.
- [ ] **Add Property**: Navigate to `/host/add-property`, publish a listing — visible on Explore.
- [ ] **Booking**: Select dates and click "Book Now" — confirmed booking appears in `/bookings`.
- [ ] **Reviews**: Submit a 5-star rating on a property details page — review renders live.
- [ ] **Protected Routes**: Visit `/bookings` or `/host/add-property` in an Incognito window — redirects to `/login`.
- [ ] **SPA Route Refresh**: Press `F5` / Refresh on `/explore` or `/bookings` — loads cleanly without 404.
- [ ] **Browser Console**: `F12` console shows 0 red CORS or Network errors.
