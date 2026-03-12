# DashStack

Production-ready full-stack Next.js 14 dashboard with MongoDB CRUD, Tailwind + ShadCN-style UI, and Docker.

## Features
- Next.js 14 App Router + TypeScript
- MongoDB with Mongoose models and reusable connection helper
- Full CRUD for users via API route handlers
- Tailwind CSS + ShadCN-style UI primitives
- Responsive dashboard layout with sidebar + mobile nav
- Dark/light mode with `next-themes`
- Zod + React Hook Form validation
- Toast notifications and loading states
- Docker + docker-compose for app + MongoDB

## Folder Structure
```
app/
  api/
    users/
      [id]/route.ts
      route.ts
  about/page.tsx
  users/page.tsx
  users/loading.tsx
  layout.tsx
  page.tsx
  globals.css
components/
  users/
    user-form.tsx
    user-table.tsx
  ui/
    badge.tsx
    button.tsx
    card.tsx
    input.tsx
    separator.tsx
    skeleton.tsx
    table.tsx
    textarea.tsx
  header.tsx
  loading-state.tsx
  mobile-nav.tsx
  sidebar.tsx
  theme-provider.tsx
  theme-toggle.tsx
lib/
  validations/user.ts
  db.ts
  utils.ts
models/
  User.ts
api/
  users.ts
hooks/
  use-users.ts
types/
  user.ts
```

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env.local` file:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/dashstack
   MONGODB_DB=dashstack
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`.

## Docker
1. Build and run:
   ```bash
   docker-compose up --build
   ```
2. Visit `http://localhost:3000`.

## API Endpoints
- `GET /api/users` — list users
- `POST /api/users` — create user
- `GET /api/users/:id` — get user
- `PUT /api/users/:id` — update user
- `DELETE /api/users/:id` — delete user

## Notes
- Environment variables are required for database configuration.
- MongoDB connection is cached to avoid hot-reload issues in development.
