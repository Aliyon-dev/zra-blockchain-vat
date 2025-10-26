<!-- 4a3fdd8e-3c1b-4014-840c-5bde16d71024 019adffa-c81f-420c-abce-5fcdeea989f2 -->
# Add Authentication and Enhanced Features

## Overview

Implement Supabase authentication, user-specific invoice management, invoice listing, and QR code verification for the ZRA blockchain invoice system.

## Phase 1: Supabase Authentication Setup

### 1.1 Backend Authentication

- Install Supabase Python client (already in requirements.txt)
- Create authentication middleware for FastAPI
- Add JWT token verification using Supabase
- Create `auth.py` module with authentication helpers
- Add `get_current_user()` dependency for protected routes

### 1.2 Database Schema Updates

- Add `user_id` column to Invoice model (UUID, foreign key to Supabase auth.users)
- Add `created_by` field to track invoice creator
- Create migration for user_id field
- Update Invoice model to include user relationship

### 1.3 Frontend Authentication

- Install `@supabase/supabase-js` for Next.js
- Create Supabase client configuration
- Implement authentication context/provider
- Add login functionality to existing Login component
- Add signup functionality
- Add logout functionality
- Implement protected routes
- Add session management

## Phase 2: User-Specific Invoice Management

### 2.1 Backend Updates

- Modify `create_invoice` to accept user_id from authenticated user
- Add `GET /invoices` endpoint to list user's invoices
- Add pagination support (limit, offset)
- Add filtering by status (PENDING, PAID, CANCELLED)
- Add sorting (by date, amount)
- Update CRUD operations to filter by user_id

### 2.2 Frontend Invoice List

- Create `InvoiceList` component
- Create `/dashboard` page to show user's invoices
- Display invoices in a table/grid
- Add filters (status, date range)
- Add search functionality
- Add pagination controls
- Link to individual invoice details

## Phase 3: QR Code Generation and Verification

### 3.1 QR Code Generation

- Install `qrcode` library for Python backend
- Add QR code generation to invoice creation
- Generate QR with invoice data: `{id, blockchain_hash, timestamp}`
- Return QR code as base64 image in API response
- Store QR code URL/data in database (optional)

### 3.2 QR Code Display

- Update `InvoiceResult` component to display QR code
- Add download QR code button
- Add print invoice with QR code functionality

### 3.3 QR Code Verification

- Install `react-qr-scanner` or similar for frontend
- Create QR scanner component
- Add `/verify-qr` page with camera access
- Parse QR code data
- Call verification endpoint with parsed data
- Display verification results

### 3.4 Backend QR Verification

- Add `POST /invoices/verify-qr` endpoint
- Accept QR code data (invoice_id, blockchain_hash)
- Verify hash matches database
- Verify blockchain ledger
- Return verification status

## Phase 4: Enhanced UI/UX

### 4.1 Dashboard

- Create user dashboard with stats
- Show total invoices, pending, paid, cancelled
- Show recent invoices
- Add quick actions (create, verify)

### 4.2 Navigation

- Add authenticated navigation menu
- Show user profile in header
- Add logout button
- Protect routes based on auth status

### 4.3 Invoice Details Page

- Create `/invoices/[id]` page
- Show full invoice details
- Display QR code
- Show blockchain verification status
- Add actions (cancel, download, share)

## Implementation Order

### Backend Tasks

1. Create auth middleware and helpers
2. Add user_id to Invoice model + migration
3. Update create_invoice to use authenticated user
4. Add GET /invoices endpoint with filters
5. Add QR code generation to invoice creation
6. Add POST /invoices/verify-qr endpoint
7. Update all CRUD to filter by user_id

### Frontend Tasks

1. Install and configure Supabase client
2. Create authentication context
3. Implement login/signup in Login component
4. Add protected route wrapper
5. Create Dashboard page with invoice list
6. Create InvoiceList component
7. Add QR code display to InvoiceResult
8. Create QR scanner component
9. Create verify-qr page
10. Create invoice details page
11. Update navigation for authenticated users

## Files to Create/Modify

**Backend:**

- `backend/app/auth.py` (new - authentication helpers)
- `backend/app/models/models.py` (add user_id)
- `backend/app/schemas.py` (add user schemas, update invoice schemas)
- `backend/app/crud.py` (add list_invoices, filter by user)
- `backend/app/main.py` (add new endpoints)
- `backend/app/services/qr_code.py` (new - QR generation)
- `backend/alembic/versions/xxx_add_user_id.py` (new migration)
- `backend/requirements.txt` (add qrcode, pillow)

**Frontend:**

- `lib/supabase.ts` (new - Supabase client)
- `contexts/AuthContext.tsx` (new - auth state management)
- `components/login/login.tsx` (implement actual auth)
- `app/dashboard/page.tsx` (new - user dashboard)
- `components/invoice-list.tsx` (new - list invoices)
- `components/qr-scanner.tsx` (new - scan QR codes)
- `app/verify-qr/page.tsx` (new - QR verification)
- `app/invoices/[id]/page.tsx` (new - invoice details)
- `components/protected-route.tsx` (new - route protection)
- `components/navigation.tsx` (update for auth)
- `package.json` (add @supabase/supabase-js, react-qr-scanner)

## Environment Variables

**Backend (.env):**

```
SUPABASE_JWT_SECRET=[your-jwt-secret]
```

**Frontend (.env.local):**

```
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

## Testing Checklist

- [ ] User can sign up
- [ ] User can log in
- [ ] User can log out
- [ ] Protected routes redirect to login
- [ ] User can create invoice (associated with their account)
- [ ] User can view only their invoices
- [ ] Invoice list shows correct data
- [ ] Filters and pagination work
- [ ] QR code generates correctly
- [ ] QR code can be scanned
- [ ] QR verification works
- [ ] Blockchain verification still works
- [ ] Error handling for all scenarios

### To-dos

- [ ] Install qrcode and pillow for QR generation
- [ ] Create backend/app/auth.py with Supabase JWT verification
- [ ] Add user_id field to Invoice model
- [ ] Create Alembic migration for user_id field
- [ ] Create backend/app/services/qr_code.py for QR generation
- [ ] Update create_invoice to use authenticated user_id
- [ ] Add GET /invoices endpoint with pagination and filters
- [ ] Add POST /invoices/verify-qr endpoint
- [ ] Install @supabase/supabase-js and QR scanner library
- [ ] Create lib/supabase.ts with Supabase client config
- [ ] Create contexts/AuthContext.tsx for auth state
- [ ] Implement actual Supabase auth in login component
- [ ] Create components/protected-route.tsx wrapper
- [ ] Create app/dashboard/page.tsx with invoice list
- [ ] Create components/invoice-list.tsx component
- [ ] Update InvoiceResult to display QR code
- [ ] Create components/qr-scanner.tsx component
- [ ] Create app/verify-qr/page.tsx
- [ ] Create app/invoices/[id]/page.tsx
- [ ] Update navigation for authenticated users