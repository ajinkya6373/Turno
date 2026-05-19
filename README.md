# Turno Vehicle Store — Backend API

REST API for a multi-brand vehicle store. Browse, filter, bookmark, and book vehicles. Supports admin vehicle management with JWT-based auth.

## Tech Stack

- Node.js + Express (ES modules)
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcryptjs for password hashing
- express-validator for input validation

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set your values:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/turno_db
JWT_SECRET=some-long-random-secret
JWT_EXPIRES_IN=7d
PORT=3000
```

### 3. Run database migrations

Make sure PostgreSQL is running, then:

```bash
npx prisma migrate dev --name init
```

### 4. Seed sample data

```bash
npm run seed
```

This creates 2 users and 15 vehicles:

| Email | Password | Role |
|-------|----------|------|
| admin@turno.com | admin123 | ADMIN |
| john@example.com | user123 | USER |

### 5. Start the server

```bash
# production
npm start

# development (auto-restarts on file change)
npm run dev
```

Server runs at `http://localhost:3000`.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/turno_db` |
| `JWT_SECRET` | Secret used to sign tokens | `super-secret-key` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `PORT` | Port to listen on | `3000` |
| `ADMIN_TOKEN` | Optional hardcoded admin token | `admin-secret` |

---

## API Endpoints

### Auth (no token required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |

### Vehicles (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | List vehicles (filterable) |
| GET | `/api/vehicles/summary` | Grouped count by brand & fuel type |
| GET | `/api/vehicles/:id` | Single vehicle detail |
| POST | `/api/vehicles` | Add vehicle (admin only) |

**Query params for `GET /api/vehicles`:**

| Param | Type | Example |
|-------|------|---------|
| `brand` | string | `?brand=Tesla` |
| `fuelType` | `Petrol` \| `Diesel` \| `Electric` | `?fuelType=Electric` |
| `minPrice` | number | `?minPrice=20000` |
| `maxPrice` | number | `?maxPrice=50000` |

### Bookmarks (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookmarks` | Get my bookmarks |
| POST | `/api/bookmarks` | Bookmark a vehicle |
| DELETE | `/api/bookmarks/:id` | Remove a bookmark |

### Bookings (auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings` | Get my bookings |

---

## Example cURL Commands

### Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"pass123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"user123"}'
```

Copy the `token` from the response and use it in the next requests.

### List vehicles with filters

```bash
curl "http://localhost:3000/api/vehicles?brand=Tesla&fuelType=Electric"
```

### Bookmark a vehicle (protected)

```bash
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"vehicleId": 7}'
```

### Add a vehicle (admin only)

```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "brand": "BMW",
    "name": "X5 xDrive40i",
    "price": 72000,
    "fuelType": "Petrol",
    "description": "Luxury mid-size SUV with M Sport package",
    "imageUrl": "https://example.com/bmw-x5.jpg"
  }'
```

### Create a booking

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "vehicleId": 1,
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "bookingDate": "2026-06-15"
  }'
```

---

## Postman

Import `postman_collection.json` from the project root into Postman. It covers all endpoints with sample bodies and pre-configured auth.

---

## Project Structure

```
turno-backend/
├── prisma/
│   ├── schema.prisma     # DB schema
│   └── seed.js           # Sample data seeder
├── src/
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Auth + validation
│   ├── prisma/           # Prisma client singleton
│   ├── routes/           # Express routers
│   └── utils/            # Shared helpers
├── .env.example
├── server.js             # App entry point
└── package.json
```
