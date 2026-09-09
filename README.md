# MediLink

MediLink is a real-time blood and emergency supply chain coordination system that connects hospitals, blood banks, couriers, and admins in one live platform.

## Project Structure
```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    sockets/
    utils/
    validators/
  sql/schema.sql
frontend/
  src/
    api/
    components/
    context/
    hooks/
    pages/
    routes/
    styles/
```

## API Summary
- Authentication: POST /api/auth/register, POST /api/auth/login
- Requests: GET /api/requests, POST /api/requests
- Inventory: GET /api/inventory/:bankId, PUT /api/inventory
- Assignments: POST /api/assignments, GET /api/assignments/courier/:courierId
- Status and logs: PUT /api/status, GET /api/status/logs/:requestId
- Admin: GET /api/admin/users, GET /api/admin/analytics

## Real-Time Flow
1. Hospital creates a request and backend emits request:new.
2. Blood banks receive the request and reserve inventory.
3. Assignment emits assignment:created to hospital, courier, and admin dashboards.
4. Courier delivery updates emit status:updated and tracking:live.

## Setup
1. Run `cd backend && npm install`
2. Run `cd frontend && npm install`
3. Create the database with `mysql -u root -p < backend/sql/schema.sql`
4. Seed sample data with `mysql -u root -p medilink < backend/sql/seed.sql`
5. Copy `backend/.env.example` to `backend/.env`
6. Start backend with `cd backend && npm run dev`
7. Start frontend with `cd frontend && npm run dev`

## Production Notes
- Replace the demo login flow with live auth wiring.
- Add rate limiting, refresh tokens, and queue workers before production deployment.
- Connect true mapping services if you want GPS-backed routing beyond the simulated proximity logic.
