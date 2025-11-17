# Bookfair Reservation System - API Documentation

Base URL: `http://localhost:3000`

---

## 🏢 Stall APIs

### Get All Stalls (Public)
```
GET /stalls
```
Returns all stalls with their details.

### Get Available Stalls (Public)
```
GET /stalls/available
```
Returns only available stalls for booking.

### Get Stalls by Size (Public)
```
GET /stalls/size?type=SMALL
```
Filter stalls by size (SMALL, MEDIUM, LARGE).

### Get Stall by ID (Public)
```
GET /stalls/:id
```
Get details of a specific stall.

### Create Stall (Admin Only)
```
POST /stalls
Body:
{
  "name": "A1",
  "size": "SMALL",
  "location": "Ground Floor, Section A",
  "dimensions": "10x10 feet",
  "pricePerDay": 5000
}
```

### Update Stall (Admin Only)
```
PUT /stalls/:id
Body:
{
  "status": "RESERVED",
  "pricePerDay": 6000
}
```

### Delete Stall (Admin Only)
```
DELETE /stalls/:id
```

### Get Stall Statistics (Admin Only)
```
GET /stalls/statistics
```
Returns stall counts by status and size.

---

## 📋 Reservation APIs

### Book a Stall (Logged-in User)
```
POST /reservations
Body:
{
  "stallId": "stall-uuid-here",
  "totalAmount": 5000
}
```
**Rules:**
- User can book maximum 3 stalls
- Stall must be AVAILABLE
- Cannot book same stall twice

### Get My Reservations (Logged-in User)
```
GET /reservations/my-reservations
```
Returns all reservations of the logged-in user.

### Get Reservation by ID (Logged-in User)
```
GET /reservations/:id
```
User can only view their own reservations.

### Cancel Reservation (Logged-in User)
```
PUT /reservations/:id/cancel
```
Cancel a reservation and free the stall.

### Get All Reservations (Admin Only)
```
GET /reservations
```
Returns all reservations from all users.

### Get Reservation Statistics (Admin Only)
```
GET /reservations/statistics
```
Returns total reservations, counts by status, and revenue.

---

## 🔐 Authentication

All APIs except public stall views require authentication via cookies.

**Cookie name:** `jwt`

**How it works:**
1. User logs in → Backend sets JWT cookie
2. Frontend automatically sends cookie with every request
3. No need to manually handle tokens

---

## 📊 Response Formats

### Success Response
```json
{
  "id": "uuid",
  "name": "A1",
  "status": "AVAILABLE",
  ...
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 🚀 Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (not admin)
- `404` - Not Found
- `409` - Conflict (duplicate)

---

## 📝 Notes for Frontend

- **Stall Sizes:** SMALL, MEDIUM, LARGE
- **Stall Status:** AVAILABLE, RESERVED, MAINTENANCE
- **Reservation Status:** PENDING, CONFIRMED, CANCELLED
- **User Roles:** user, admin
- **Max Reservations:** 3 active bookings per user
- **Authentication:** Cookies are handled automatically by browser

---

## 🧪 Testing URLs

**NeonTech database link:** [(https://console.neon.tech/app/projects/calm-thunder-73954269/branches/br-tiny-bonus-adpd4xe7/tables?database=neondb)]

