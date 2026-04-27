# Frontend Integration Guide: Backend Architecture & API Map

This document serves as the primary reference for the frontend team to begin integrating with the backend. It outlines the backend architecture, shared types usage, API endpoints, and implementation patterns for the Next.js application.

## 1. Backend Architecture Summary

### Repository Pattern
The backend is structured using the **Repository Pattern** to ensure a clean separation of concerns:
- **Controllers** handle HTTP requests, responses, and validation.
- **Repositories** manage all direct database interactions (Prisma queries).
- This decoupling allows for easier testing (via mock repositories) and keeps the business logic independent from the database layer.

### Security Layer
- **Password Hashing:** Argon2 is used for secure password hashing.
- **Authentication:** Managed via JSON Web Tokens (JWT) stored in **HttpOnly, Strict, and Secure cookies**. This prevents XSS attacks from accessing the token.
- **Validation:** Zod is used at the controller level to strictly validate all incoming request payloads against shared schemas.

## 2. Shared Types Usage

To maintain full type safety across the monorepo, both frontend and backend share types, DTOs (Data Transfer Objects), and Zod schemas via the `@my-monorepo/types` package (or `@repo/types` depending on the internal naming).

**How to use:**
```typescript
import { 
  CreateUserPayload, 
  LoginPayload, 
  UserResponse, 
  ApiResponse 
} from '@my-monorepo/types';

// Example typing a fetch response:
const response = await fetch('http://localhost:8080/api/auth/login', { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  credentials: 'include'
});
const data: ApiResponse<UserResponse> = await response.json();
```
*Note: Always use the types exported from the shared package rather than redefining them in the frontend.*

## 3. API Route Map

All endpoints are prefixed with `/api`. Note that successful requests return an `ApiResponse<T>` wrapper.

### Auth Module
| Method | Endpoint | Description | Payload (Request) | Success Response (200/201) |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Create a new user account | `CreateUserPayload` | `ApiResponse<UserResponse>` |
| POST | `/api/auth/login` | Login & set HttpOnly cookie | `LoginPayload` | `ApiResponse<UserResponse>` |
| POST | `/api/auth/logout` | Clear auth cookie | None | `ApiResponse<null>` |

### Products Module
| Method | Endpoint | Description | Payload (Request) | Success Response (200/201) |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/products` | Get all products | None | `ApiResponse<Product[]>` |
| GET | `/api/products/:id` | Get single product | None | `ApiResponse<Product>` |
| POST | `/api/products` | Create a product | `CreateProductPayload` | `ApiResponse<Product>` |
| PUT | `/api/products/:id` | Update a product | `UpdateProductPayload` | `ApiResponse<Product>` |
| DELETE| `/api/products/:id` | Delete a product | None | `ApiResponse<null>` |

### Inventory Module
| Method | Endpoint | Description | Payload (Request) | Success Response (200/201) |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/inventory` | Get user's inventory list | None | `ApiResponse<InventoryItem[]>` |
| POST | `/api/inventory` | Add food to inventory | `InventoryItemSchema` | `ApiResponse<InventoryItem>` |
| PUT | `/api/inventory/:id`| Update inventory item | `UpdateInventorySchema` | `ApiResponse<InventoryItem>` |
| DELETE| `/api/inventory/:id`| Remove inventory item | None | `ApiResponse<null>` |

## 4. Frontend Implementation Guide

### Cookie Handling
Since the backend uses HttpOnly cookies for JWT, you do not need to manually store or attach tokens in your frontend code (e.g., localStorage).
- **Client-side Fetch:** Always include `credentials: 'include'` in your `fetch` calls or configure it globally in Axios to ensure the browser sends the cookie automatically on every request.
  ```javascript
  fetch('/api/inventory', {
    method: 'GET',
    credentials: 'include', // CRITICAL for HttpOnly cookies
  })
  ```

### Fetching Patterns
- **Server Actions (Next.js App Router):** Recommended for mutations (POST/PUT/DELETE) and server-side logic. Server actions can safely interact with the Express API without exposing logic to the client. Ensure cookies are forwarded if making requests from the server to the Express API.
- **Client-side Fetching:** Use **SWR** or **TanStack Query (React Query)** for client-side data fetching. They handle caching, revalidation, and loading states automatically, which is perfect for fetching `/api/inventory` and `/api/products`.

### Typing & Prisma
- You can import Prisma generated types (e.g., `import { User, Product } from '@prisma/client'`) or shared types from the monorepo to type your frontend variables.
- **Important:** Never query Prisma directly from the Next.js frontend code. All data must be fetched through the Express API routes defined in the Route Map above to ensure that security, validation, and business logic (like the Repository Pattern implementations) are properly enforced.
