# Northstar Job Portal

Full-stack job portal with a Spring Boot REST API and a React/Vite client.

## Requirements

- Java 21 (Java 17+ compatible source level), Maven wrapper
- MySQL 8+
- Node.js 20+

## Run locally

1. Create a MySQL database/user, or use the dev defaults (`root`, empty password, local MySQL). Configure `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` when needed.
2. Set `JWT_SECRET` to a random secret of at least 32 bytes. The built-in dev value is for local development only.
3. From this directory run `./mvnw spring-boot:run` (Windows: `mvnw.cmd spring-boot:run`). The API listens on port 8081.
4. In `frontend`, run `npm install` and `npm run dev`. Vite serves the app on port 5173 and proxies `/api` to Spring Boot.

## Next.js App Router frontend

An App Router/TypeScript implementation is available alongside the original Vite client in `frontend-next`. It uses port 3000 and proxies API requests to `http://localhost:8081` by default:

```powershell
cd frontend-next
npm install
npm run dev
```

See `frontend-next/ARCHITECTURE.md` for the feature modules, data/state boundaries, and API capabilities that still need backend support.

## Production configuration

Set `SPRING_PROFILES_ACTIVE=prod`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `APP_CORS_ORIGINS` (comma-separated exact origins), and `UPLOAD_DIR` to persistent private storage. Production schema management is validate-only; deploy versioned database migrations before application rollout. Put the API behind HTTPS and a reverse proxy. Never commit production secrets.

## API overview

- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`
- `GET /api/v1/jobs?keyword=&location=&jobType=&page=&size=` (Spring page response)
- `GET /api/v1/jobs/featured`, `GET /api/v1/jobs/{id}`
- Recruiter: `GET /api/v1/jobs/recruiter/my-jobs`, `POST /api/v1/jobs`, `PUT /api/v1/jobs/{id}`, `DELETE /api/v1/jobs/{id}`
- Job seeker: `POST /api/v1/uploads/resume` (multipart `file`), `POST /api/v1/applications?jobId=`, `GET /api/v1/applications/me`
- Recruiter ATS: `GET /api/v1/applications/recruiter`, `PATCH /api/v1/applications/{id}/status`

Authentication responses contain a bearer JWT and a safe user projection. Job creation and application views are DTOs; password hashes and lazy entity graphs are never serialized. Resume uploads accept PDF/DOC/DOCX up to 5 MB and are stored under `UPLOAD_DIR`; use private persistent storage with backups and retention controls in production.

## Layout

```text
src/main/java/com/embarks/firstjobapp/{auth,application,common,job,security,upload,user}
src/main/resources/application.yml
frontend/src/
  components/{ui,ProtectedRoute,ErrorBoundary}.jsx
  context/AuthContext.jsx
  layouts/MainLayout.jsx
  lib/queryClient.js
  pages/{JobsPage,ApplicationTrackerPage,ProfilePage,RecruiterDashboardPage}.jsx
  services/{apiClient,queries}.js
  types/schemas.js
  App.jsx
```

The client uses TanStack Query for cached server state, React Hook Form with Zod validation, Sonner for mutation feedback, nested React Router layouts, and shared responsive primitives. Dashboard route guards are role based; the profile endpoint is `GET/PUT /api/v1/auth/me`.
