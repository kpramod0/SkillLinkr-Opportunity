# API Documentation

## Authentication
All protected routes require a valid Supabase Session Cookie. 
Public routes (`/api/v1/public/*`) do not require authentication.

## Endpoints

### Public Opportunities
- `GET /api/v1/public/opportunities`
  - Query Params: `page`, `limit`, `category`, `search`, `college`
  - Returns paginated list of published/live opportunities.

- `GET /api/v1/public/opportunities/:id`
  - Returns single opportunity with relations.

### Reference Data
- `GET /api/v1/public/categories`
- `GET /api/v1/public/domains`

### Interactions
- `POST /api/v1/public/interactions`
  - Body: `{ opportunityId: UUID, type: 'view' | 'share' | 'reg_click', userEmail?: string }`
  - Records an interaction and increments the counter atomically via RPC.

### Uploads (Protected)
- `POST /api/v1/uploads/images`
  - Multipart Form Data: `file` (Image up to 5MB)
  - Returns: `{ urls: { large, medium, thumbnail } }`
  - Processed securely via `sharp`.
