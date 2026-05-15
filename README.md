# Internship Application Tracker

A MERN-stack web app to manage internship applications and interview schedules, with JWT-based auth.

## Stack
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend:** React 19 + Vite, React Router 7, Axios

## Features
- Email/password auth (register, login, JWT-protected routes)
- Applications: full CRUD with status (Applied / Interview / Offer / Rejected), applied date, link, notes
- Search by company/role/notes + filter by status
- Live stat cards (Total / Applied / Interview / Offer / Rejected)
- Quick inline status changes from the table
- Interviews: linked to applications, with round, scheduled time, mode (Online/In-person/Phone), outcome, notes
- Upcoming vs Past split on the Interviews page
- All data scoped to the logged-in user

## Setup

### Backend

```bash
cd backend
cp .env.example .env       # then fill in MONGO_URI + JWT_SECRET
npm install                # already done in this zip
npm run dev                # nodemon, port 5000 by default
```

`.env` must contain:
```
MONGO_URI=mongodb://localhost:27017/internship-tracker
JWT_SECRET=any-long-random-string
PORT=5000
```

For MongoDB you can either run locally (`mongod`) or use a free MongoDB Atlas cluster and paste the connection string into `MONGO_URI`.

### Frontend

```bash
cd frontend
npm install                # already done
npm run dev                # vite dev server, port 5173
```

The frontend talks to `http://localhost:5000/api` by default. To point it elsewhere, create `frontend/.env`:
```
VITE_API_URL=https://your-deployed-backend.com/api
```

## API Endpoints

| Method | Route                      | Auth | Body                                                            |
|--------|----------------------------|------|------------------------------------------------------------------|
| POST   | `/api/auth/register`       | —    | `{ name, email, password }`                                      |
| POST   | `/api/auth/login`          | —    | `{ email, password }` → `{ token, user }`                        |
| GET    | `/api/applications`        | ✓    |                                                                  |
| POST   | `/api/applications`        | ✓    | `{ company, role, status?, appliedDate?, link?, notes? }`        |
| PUT    | `/api/applications/:id`    | ✓    | partial update                                                   |
| DELETE | `/api/applications/:id`    | ✓    |                                                                  |
| GET    | `/api/interviews`          | ✓    |                                                                  |
| POST   | `/api/interviews`          | ✓    | `{ application, scheduledAt, round?, mode?, outcome?, notes? }`  |
| PUT    | `/api/interviews/:id`      | ✓    | partial update                                                   |
| DELETE | `/api/interviews/:id`      | ✓    |                                                                  |

Send the JWT as `Authorization: Bearer <token>` on protected routes.

## Project Structure

```
internship-tracker/
├── backend/
│   ├── server.js
│   ├── middleware/auth.js
│   ├── models/        # User, Application, Interview
│   ├── routes/        # auth, applications, interviews
│   └── .env.example
└── frontend/
    └── src/
        ├── api/client.js          # axios instance + auth interceptor
        ├── context/AuthContext.jsx
        ├── components/            # Navbar, Modal, StatusBadge, ProtectedRoute, *Form
        ├── pages/                 # Login, Register, Dashboard, Interviews
        ├── App.jsx
        └── main.jsx
```
