# Northstar frontend architecture

Northstar is an App Router frontend for the existing Spring Boot API. The directory is intentionally isolated in `frontend-next/`; the current Vite client remains available until the Next app is ready to replace it. Next rewrites `/api/*` to `API_ORIGIN` (default `http://localhost:8081`), so browser requests stay same-origin.

## Feature-oriented structure

```text
src/
  app/                         # Route entry points, root providers, global error UI
    jobs/page.tsx
    jobs/[id]/page.tsx
    applications/page.tsx
    login/page.tsx
    register/page.tsx
  components/ui/                # Shared accessible primitives (shadcn/ui convention)
  features/
    auth/                       # API, session store, schemas, forms, domain types
    jobs/                       # Search, details, filters, job queries and API
    applications/               # Application schema, wizard, upload and tracker
    profile/                    # Profile form/query boundary (next module)
    recruiter/                  # Job management and applicant review (next module)
  hooks/                        # Cross-feature hooks (online, debounce, media queries)
  lib/                          # Utilities, query client factories, API helpers
  types/                        # Shared API/domain contracts
```

Feature modules own their schemas, API calls, components, and feature types. App Router files compose features; they do not become a second location for business logic. Keep server-only data access in server modules and browser state in client components.

## State and request rules

- TanStack Query owns server data, retries, cancellation, stale time, and invalidation. Query keys include every server filter. Mutations invalidate only the affected keys.
- Zustand owns cross-route preferences such as the grid/list choice and search filters. Do not copy query results into Zustand.
- The session store contains only the safe user projection. The bearer token is stored in `localStorage` for parity with the existing API contract; production deployments should prefer an HttpOnly, Secure, SameSite cookie issued by a same-site backend.
- Query functions accept `AbortSignal`. API errors are normalized into user-safe messages, while full diagnostics go to telemetry in production.

## Reusable UI contracts

`button`, `input`, `select`, `dialog`, `badge`, `card`, `skeleton`, and `toast` are the shared shadcn/ui primitive layer. Compose features from these primitives rather than styling each route independently. Radix Dialog provides focus trapping, Escape dismissal, and focus restoration. All icon-only controls need accessible names; all form errors are connected with `aria-describedby` and `aria-invalid` in the production primitive layer.

## API contracts and integration gaps

The implemented client currently matches `GET /api/v1/jobs`, `GET /api/v1/jobs/{id}`, `POST /api/v1/uploads/resume`, `POST /api/v1/applications?jobId=`, `GET /api/v1/applications/me`, and the existing login/register endpoints. The existing job endpoint filters by keyword, location, job type, page, and size. Salary bounds, technology tags, and experience-level filters in the UI are ready for an API extension but are not yet enforced by the Spring service. Likewise, the existing apply request persists only `resumeUrl` and `coverLetter`; answers and candidate contact fields from the sample wizard need API DTO/entity/migration support before they can be retained. The optional external-apply button is ready for an `externalApplyUrl` field, which the current job DTO does not expose. The current dialog includes the additional fields to make that integration contract explicit.

For production, add typed server-side filter fields and indexes, persist screening answers in a versioned application-question schema, authorize apply routes on the server, move JWT storage to a secure cookie, and configure image `remotePatterns` for approved company logos. Do not use client-only filter results as authorization or final eligibility decisions.

## Performance and accessibility

Job search uses an `IntersectionObserver` and `useInfiniteQuery` to append API pages only as the candidate approaches the end of the list. Search text is debounced; cached result pages remain visible during background refresh. Role detail markdown is rendered by `react-markdown`, which does not execute raw HTML by default. The application dialog uses Radix focus management and a four-step React Hook Form flow with a Zod schema. Reduced-motion preferences, visible focus rings, live result announcements, responsive overflow handling, empty/loading/error states, and a skip-to-content link are included.

## Run

```powershell
cd frontend-next
npm install
npm run dev
```

The Next development server uses port `3000`; the original Vite client uses `5173`. Set `API_ORIGIN` when the Spring API is not at `http://localhost:8081`.

Vitest and Testing Library are configured through `vitest.config.ts` (`npm test` / `npm run test:watch`). Playwright is configured for Chromium in `playwright.config.ts` (`npm run test:e2e`). Add unit tests under `src/**/*.test.ts(x)` and browser journeys under `e2e/` as the feature contracts are finalized.
