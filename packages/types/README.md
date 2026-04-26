# @repo/types - Documentation

This package contains the core data structures, Zod schemas, and TypeScript interfaces for the **An Tam Kitchen** application.

## Overview

We use **Zod** for runtime schema validation and to infer TypeScript types. This ensures data integrity between the frontend, backend, and database.

### Key Technologies
- **Zod**: Validation and type inference.
- **UUID v7**: Used for all unique identifiers for better database performance and sortability.

---

## Core Interfaces

### 1. Products (`products.ts`)
Defines the global and private product catalog.
- **`Product`**: Represents a generic packaged food item.
- **Hybrid Model**: 
    - `isGlobal: true`: Available to all users.
    - `ownerId: string`: Private product created by a specific user for their own catalog.
- **Metadata**: Includes `barcode`, `category`, and shelf-life rules (`daysBeforeOpen`, `daysAfterOpen`).

### 2. Inventory (`inventory.ts`)
Manages the user's actual stock (the "Digital Fridge").
- **`InventoryItem`**: A specific instance of a product in a user's fridge.
- **Snapshot Pattern**: Uses `displayName` to store a string snapshot of the product name for faster UI rendering without complex joins.
- **Tracking**: Tracks `openedAt`, `expiryDate`, and `location` (fridge, freezer, etc.).
- **`FoodStatus`**: Derived status of the food (`fresh`, `use_soon`, `check_before_use`, `not_recommended`).
- **`FoodNotification`**: Structure for alerts regarding expiring items.

### 3. Scans (`scans.ts`)
Handles the interaction with barcode scanning features.
- **`BarcodeScanResult`**: The response structure after scanning a barcode, containing the original barcode string and the matched `Product` (if found).

---

## Design Principles

1. **Foreign Key Integrity**: `InventoryItem` always references a `productId`. If a user adds a custom item, a private `Product` entry is created first.
2. **Strict Validation**: All schemas use `z.uuidv7()` for IDs and `z.url()` for URLs to follow modern Zod standards.
3. **Derived States**: The `status` field in inventory items should be updated periodically based on the current date vs. the opening/expiry dates.

## Usage

```typescript
import { Product, InventoryItemSchema } from '@repo/types';

// Use schemas for validation
const result = InventoryItemSchema.safeParse(data);

// Use types for development
const myItem: Product = { ... };
```
