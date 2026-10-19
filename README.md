# Job Application Tracker

A portfolio app for tracking job applications. Later it will use AI to review skill fit and cover letters.

The dashboard currently runs on mock data. The API connects to PostgreSQL. `GET /api/health` checks that the process is running. `GET /api/applications` and `POST /api/applications` read and write the applications table for `DEV_USER_ID`. `GET /api/applications/:id` returns one application for that same user. `PATCH /api/applications/:id` updates only the fields included in the request.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Run the backend

Install Go. In `backend`, set `DATABASE_URL` to the direct Supabase connection string from Project Settings → Database (host `db.<project-ref>.supabase.co`, port 5432). `backend/.env.example` shows the shape of that string. The program reads the environment variable; it does not open a `.env` file.

```powershell
cd backend
$env:DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require"
$env:DEV_USER_ID = "your-dev-user-uuid"
go run ./cmd/server
```

The server logs `connected to postgres` after a successful ping. Open http://localhost:8080/api/health

`DEV_USER_ID` is a temporary user id until authentication exists. Run `backend/migrations/001_applications.sql` once in the Supabase SQL editor before storing applications.

## Branches

- `main` is the stable line.
- `dev` is the integration line.
- Feature branches start from `dev`.
