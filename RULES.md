# Project Rules & Best Practices - An Tam Kitchen

## TypeScript & Zod
- **UUID Generation**: Use `z.uuidv7()` for UUID v7 identifiers. Avoid `z.string().uuid()` as it is considered deprecated in this project's version of Zod.
- **URL Validation**: Use `z.url()` for URL validation. Avoid `z.string().url()` as it is deprecated.
- **Naming Convention**: Use camelCase for object keys and PascalCase for Interfaces/Schemas.

## Data Structures
- **Product Management**: Support both system-wide global products and user-specific private products using `ownerId` and `isGlobal` flags.
- **Inventory Items**: Every item in the inventory must reference a `productId`. Use a `displayName` snapshot for efficient UI rendering.
- **Dates**: Always use the `Date` type for time-related fields and include `createdAt`/`updatedAt` for auditing.
