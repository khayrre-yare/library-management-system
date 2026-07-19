# Library Management System

A full-stack Library Management System built with Spring Boot, React, PostgreSQL, Spring Security, JWT, Spring Data JPA, Axios, and React Router.

The system follows a layered backend architecture:

```text
React client -> REST Controller -> Service -> Repository -> PostgreSQL
```

## Included features

- Public home page, searchable book catalogue, book details, and contact form
- Member registration and login using JWT authentication
- Role-based access for `USER` and `ADMIN`
- Borrow cart and borrowing request submission
- Member dashboard with pending, active, overdue, rejected, and returned activity
- Admin dashboard with catalogue management, request approval/rejection/return, and contact messages
- Responsive desktop, tablet, and mobile layout
- Client-side and backend validation with visible error messages
- Loading skeletons, empty states, confirmation dialogs, and toast notifications

## Project structure

```text
library-management-system/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/jamhuriya/library/
│       │   ├── config/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── entity/
│       │   ├── exception/
│       │   ├── repository/
│       │   ├── security/
│       │   └── service/
│       └── resources/application.properties
├── frontend/
│   ├── package.json
│   └── src/
│       ├── api/client.js
│       ├── assets/
│       ├── components/
│       │   ├── layout/
│       │   └── ui/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── utils/
└── docs/ERD.md
```

## Requirements

- Java 17 or later
- Maven 3.6.3 or later
- PostgreSQL 14 or later
- Node.js 20.19 or later (or Node.js 22.12+)
- npm

## 1. PostgreSQL setup

Create the database:

```sql
CREATE DATABASE library_management;
```

The default local connection in `backend/src/main/resources/application.properties` is:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/library_management
spring.datasource.username=postgres
spring.datasource.password=postgres
```

You can use environment variables instead:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGINS
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
```

## 2. Run the Spring Boot backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at:

```text
http://localhost:8080/api
```

Default local administrator:

```text
Email: admin@library.local
Password: Admin@12345
```

Change these credentials through `ADMIN_EMAIL` and `ADMIN_PASSWORD` before using the system outside local development.

## 3. Run the React frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend starts at:

```text
http://localhost:5173
```

## Main REST endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Authenticated |

### Books

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/books` | Public |
| GET | `/api/books/{id}` | Public |
| GET | `/api/books/categories` | Public |
| POST | `/api/books` | Admin |
| PUT | `/api/books/{id}` | Admin |
| DELETE | `/api/books/{id}` | Admin |

### Borrowings

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/borrowings` | Authenticated |
| GET | `/api/borrowings/me` | Authenticated |
| GET | `/api/borrowings` | Admin |
| PUT | `/api/borrowings/{id}/status` | Admin |

### Dashboard and contact

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/dashboard` | Authenticated |
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/notifications` | Admin |
| POST | `/api/contact` | Public |
| GET | `/api/contact` | Admin |
| PUT | `/api/contact/{id}/read` | Admin |

## Frontend pages

```text
/
/books
/books/:id
/cart
/contact
/login
/register
/dashboard
/admin
```

## Public deployment on Render

The repository includes a production-ready `render.yaml` Blueprint and a
multi-stage Docker build for the Spring Boot API. The Blueprint creates:

- a React static site served through Render's CDN;
- a Docker-based Spring Boot web service;
- a managed PostgreSQL database;
- generated JWT credentials and production CORS/API configuration.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/khayrre-yare/library-management-system)

During the first Blueprint setup, provide secure values for `ADMIN_EMAIL` and
`ADMIN_PASSWORD`. Render supplies the database credentials automatically. The
deployed services automatically rebuild after each commit to `main`.

## No-card deployment with Back4App and Neon

The root `Dockerfile` builds the React frontend and packages it inside the
Spring Boot application. This produces one public website URL and avoids
cross-origin configuration in production.

1. Create a free PostgreSQL project on [Neon](https://console.neon.tech/).
2. In Back4App, create a **Container App** from this GitHub repository.
3. Keep the repository root as the app root so Back4App uses `/Dockerfile`.
4. Select the free container and configure the following environment variables:

| Variable | Value |
|---|---|
| `PORT` | `8080` |
| `DB_URL` | `jdbc:postgresql://NEON_HOST/NEON_DATABASE?sslmode=require` |
| `DB_USERNAME` | Neon database user |
| `DB_PASSWORD` | Neon database password |
| `JWT_SECRET` | A private random value of at least 32 characters |
| `ADMIN_NAME` | Administrator display name |
| `ADMIN_EMAIL` | Administrator login email |
| `ADMIN_PASSWORD` | A strong private administrator password |
| `JPA_SHOW_SQL` | `false` |

Do not commit the real values of these variables. Back4App stores them as
deployment configuration, and the browser receives none of the database or JWT
credentials.

## Notes

- Passwords are stored using BCrypt, not plain text.
- JWT tokens are stored in browser local storage and attached by the Axios request interceptor.
- The backend uses DTOs so JPA entities are not returned directly.
- `spring.jpa.hibernate.ddl-auto=update` creates and updates the local schema during development.
- The ERD is available in `docs/ERD.md`.

## Verification performed

- The Spring Boot source compiles successfully with Maven.
- The React application builds successfully with Vite.
- `npm audit` reports no known dependency vulnerabilities for the generated frontend lockfile.
