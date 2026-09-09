# MediLink Backend

## API Endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/requests
- POST /api/requests
- GET /api/inventory/:bankId
- PUT /api/inventory
- POST /api/assignments
- GET /api/assignments/courier/:courierId
- PUT /api/status
- GET /api/status/logs/:requestId
- GET /api/admin/users
- GET /api/admin/analytics

## Real-Time Events
- request:new
- inventory:updated
- assignment:created
- status:updated
- tracking:live