# Job Application Tracker

A portfolio app for tracking job applications. Later it will use AI to review skill fit and cover letters.

The dashboard currently runs on mock data. The API only has a health check so far.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Run the backend

Install Go, then from the repository root:

```bash
cd backend
go run ./cmd/server
```

Open http://localhost:8080/api/health

## Branches

- `main` is the stable line.
- `dev` is the integration line.
- Feature branches start from `dev`.
