# Job Application Tracker

A portfolio app for tracking job applications. Later it will use AI to review skill fit and cover letters.

The dashboard reads `GET /api/applications` for the counts, the latest applications, and the totals by status. The API connects to PostgreSQL. `GET /api/health` checks that the process is running. `GET /api/applications` and `POST /api/applications` read and write the applications table for `DEV_USER_ID`. `GET /api/applications/:id` returns one application for that same user. The applications page opens that record in a details dialog and can update it with `PATCH /api/applications/:id`. The applications page can remove that record with `DELETE /api/applications/:id`. `PATCH /api/applications/:id` updates only the fields included in the request. `DELETE /api/applications/:id` removes one application for that same user.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Run the backend

Install Go. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` to the direct Supabase connection string from Project Settings → Database (host `db.<project-ref>.supabase.co`, port 5432). `backend/.env` stays on this machine. The server reads that file when it starts from the `backend` directory. A variable already set in the terminal is kept.

```powershell
cd backend
go run ./cmd/server
```

The server logs `connected to postgres` after a successful ping. Open http://localhost:8080/api/health

`DEV_USER_ID` is a temporary user id until authentication exists. Run `backend/migrations/001_applications.sql` once in the Supabase SQL editor before storing applications.

## Branches

- `main` is the stable line.
- `dev` is the integration line.
- Feature branches start from `dev`.
