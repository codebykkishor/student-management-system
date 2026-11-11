# 🎓 Student Management System

A full-stack, role-based **Student Management System** for managing students, attendance, marks, timetables, exams and announcements, with separate portals for **Admins**, **Faculty** and **Students**.

**Maintained by Kunal Kishor**

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios, served by Nginx |
| Backend | Python FastAPI, SQLAlchemy, Pydantic |
| Auth | JWT + bcrypt, role-based access control (RBAC) |
| Database | PostgreSQL 15 |
| Reports | ReportLab (PDF report cards) |
| DevOps | Docker, Docker Compose, Render blueprint, EC2 setup script |

---

## ✨ Features

- **Three role-based portals**: Admin, Faculty (scoped to their department) and Student (own data only)
- **Student directory**: search, filter, sort, paginate, add / edit / delete, CSV import & export
- **Attendance**: daily and bulk marking, per-student summaries
- **⚠️ Low Attendance Alerts** *(new)*: dashboard panel listing students below an adjustable threshold (60–85%, default 75%), colour-coded by severity. Faculty only see their own department.
- **Marks & grades**: grade distribution, per-student results
- **PDF reports**: student report and formal report card downloads
- **Timetable & exam schedule** management
- **Announcements** with categories, pinning and audience targeting
- **Account approvals** for student self-registration (Admin)
- **Audit logs** of important actions (Admin)

---

## 📁 Project Structure

```
studentmanagementsystem/
├── backend/
│   ├── main.py             ← FastAPI app and all routes
│   ├── auth.py             ← JWT, password hashing, role guards, default users
│   ├── models.py           ← SQLAlchemy models
│   ├── schemas.py          ← Pydantic schemas
│   ├── database.py         ← DB engine + connection retry
│   ├── pdf_generator.py    ← PDF report / report card generation
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/                ← React components (dashboards, managers, modals)
│   ├── public/
│   ├── nginx.conf          ← SPA + /api reverse proxy
│   ├── package.json
│   └── Dockerfile
├── compose.yaml            ← Runs db + backend + frontend together
├── render.yaml             ← Render deployment blueprint
├── setup-ec2.sh            ← One-shot Docker setup for an Ubuntu EC2 server
├── test_rbac.py            ← Role-based access control test suite
└── README.md
```

---

## 🌐 Architecture

```
Browser → http://localhost:8080
              │
              ▼
         Nginx (frontend container)
              ├── /api/*  → proxy → backend:8000 (FastAPI) → PostgreSQL (db:5432)
              └── /*      → React single-page app
```

The frontend always calls the relative path `/api`, so the same build works on localhost and on any server with a single open port (8080).

---

## 🚀 Quick Start

**Prerequisite:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose).

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
docker compose up --build -d
```

| What | URL |
|------|-----|
| App | http://localhost:8080 |
| API docs (Swagger) | http://localhost:8000/docs |
| Health check | http://localhost:8000/health |

Useful commands:

```bash
docker compose ps                 # container status
docker compose logs -f backend    # follow backend logs
docker compose down               # stop (data is kept)
docker compose down -v            # stop AND delete all data
```

---

## 🔐 Demo Accounts

Created automatically on first start:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Faculty (Computer Science) | `faculty` | `faculty123` |
| Faculty (Information Technology) | `faculty_it` | `faculty123` |
| Student | first name of each student record | `student123` |

> ⚠️ **These are demo credentials only.** Before any real deployment, change them and set a private `SECRET_KEY` environment variable for the backend (used to sign login tokens). Also change the database password in `compose.yaml`.

---

## 🔗 API Overview

Full interactive documentation is available at `/docs`. Main groups:

| Area | Examples |
|------|----------|
| Auth | `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Students | `GET/POST /students`, `GET/PUT/DELETE /students/{id}`, `GET /students/export`, `POST /students/import` |
| Attendance | `POST /attendance`, `POST /attendance/bulk`, `GET /attendance`, **`GET /attendance/low?threshold=75`** |
| Marks | `POST /marks`, `GET /marks`, `PUT/DELETE /marks/{id}` |
| Reports | `GET /students/{id}/report.pdf`, `GET /students/{id}/report-card.pdf` |
| Dashboards | `GET /dashboard/admin`, `/dashboard/faculty`, `/dashboard/student` |
| Timetable / Exams / Notices | `/timetables`, `/exams`, `/announcements` |
| Admin | `/audit-logs`, student account approval endpoints |

---

## 🧪 Running the RBAC Tests

With the stack running:

```bash
python test_rbac.py
```

---

## ☁️ Deployment

**Any Ubuntu server (e.g. AWS EC2):** copy the project, run `bash setup-ec2.sh`, and open port **8080** in your firewall / security group.

**Render:** `render.yaml` defines the backend, static frontend and database. After the backend is live, set `REACT_APP_API_URL` for the frontend service to your backend's URL (replace the `YOUR-BACKEND-NAME` placeholder in the file).

**Local frontend development:** the frontend uses `REACT_APP_API_URL` if set, otherwise `/api`.

---

## ❓ Troubleshooting

- **Backend can't reach the database:** run `docker compose logs backend`; it retries automatically. If it keeps failing, `docker compose down` then `docker compose up --build -d`.
- **Port already in use:** change the host port in `compose.yaml`, e.g. `"9080:80"`.
- **Start fresh:** `docker compose down -v` (⚠️ deletes all records).

---

## 👤 Author

**Kunal Kishor**
