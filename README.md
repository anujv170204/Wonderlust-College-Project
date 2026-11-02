# WonderLust — Hotel Booking and Listing

Email + password are used for login and registration **only**. No OTP, email, SMS or WhatsApp messages are sent.

## Local setup
1. In `backend`, copy `.env.example` to `.env`; generate a strong JWT_SECRET. Start MongoDB.
2. Run `npm install`, `npm run migrate-emails`, `npm run seed`, `npm start` in `backend`.
3. Run `npm install`, `npm run dev` in `frontend`.
4. Open http://localhost:5173.

Demo host: `anuj@gmail.com` / `anuj123` (25 seeded listings). Demo admin: `admin@gmail.com` / `admin123`.

**Seed is local-only and does not delete existing listings.** It ensures the demo host has at least 25 properties, not exactly 25 if more already exist. The Unsplash image URLs are external and require internet. Before deployment change the demo passwords and JWT secret, use MongoDB Atlas, and never commit `.env`. Run migrations and seed against local DB before migration to cloud; the local-only seed cannot seed Atlas.

## Notes
- Existing username-only users without a stored email are assigned `@example.invalid` placeholders by `migrate-emails`. Update these to real login emails in the database before those users can log in.
- Local MongoDB data does not automatically appear in Atlas; migrate your data separately.
- Testing with a running MongoDB and a browser is still required before deployment.
