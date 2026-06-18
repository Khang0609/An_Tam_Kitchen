# 🍲 An Tâm Kitchen

> **Vietnamese Post-Opening Food Intelligence for Ordinary Fridges**  
> An Tâm Kitchen (developed by team **Five Monkeys**) is a modern, full-stack web/PWA platform designed to reduce household food waste. Instead of merely tracking passive expiration dates, it provides localized intelligence on how long foods remain optimal *after opening*, offering a simple daily action dashboard answering: **"What should we use first today?"**

[![Tech Stack](https://img.shields.io/badge/Monorepo-Turborepo-EF4444?style=flat-square&logo=turborepo)](https://turbo.build/)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Express.js-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-Prisma%20%26%20PostgreSQL-398200?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Package Manager](https://img.shields.io/badge/Package%20Manager-pnpm-F69220?style=flat-square&logo=pnpm)](https://pnpm.io/)

---

## 🎯 The Problem & Our Value Proposition

### The Post-Opening Information Gap
Most food tracking tools focus solely on printed *unopened* expiry dates. However, once a package is opened, the shelf life changes drastically depending on food type, storage conditions (refrigerator, freezer, or room temperature), and local household habits.

### Our Solution
An Tâm Kitchen bridges this gap with:
*   **Vietnamese Post-Opening Shelf-Life Knowledge Layer**: A curated database mapping typical Vietnamese food categories and products to recommended shelf-life guidance after opening.
*   **Zero Expiry-Date-Entry UX**: Users confirm only the opening date and storage location instead of manually typing long, printed date labels.
*   **Daily Action Dashboard**: The system automatically calculates remaining days and ranks items by urgency, prioritizing them directly on the user's dashboard.
*   **Ordinary Fridge Compatibility**: Works on any smartphone or browser, making food intelligence accessible to ordinary kitchens without expensive smart-fridge hardware.

---

## ✨ Key Features

- **Scan-Confirm-Use Flow**: Scan a barcode (EAN/GTIN) or search for a product. The system automatically maps it to a standard shelf-life profile, requiring the user only to select the storage location and opening date.
- **Dynamic Urgency Dashboard**: Displays all active fridge/pantry items classified into a four-level status system:
  *   🟢 **Fresh**
  *   🟡 **Use Soon**
  *   🟠 **Check Before Use** (recommends checking quality indicators like smell, texture, and color)
  *   🔴 **Not Recommended**
- **Manual Entry for Fresh Foods**: Easily add un-barcoded foods like fresh vegetables, market produce, leftovers, and home-cooked dishes.
- **Anonymized Calibration Loop**: Triggers user-driven events (when items are marked as consumed or discarded) to help experts refine database shelf-life estimations safely (human-in-the-loop).
- **Guest Login**: A frictionless, full-featured demo sandbox without mandatory registration, optimized for quick user evaluation and pitches.

---

## 🛠️ Technology Stack

- **Monorepo Management**: [Turborepo](https://turbo.build/) with `pnpm workspaces`
- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, Tailwind CSS, TypeScript, shadcn/ui)
- **Backend API**: [Express.js](https://expressjs.com/) (Node.js, TypeScript)
- **Database ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: PostgreSQL (compatible with MySQL/SQLite)

---

## 📁 Monorepo Structure

```text
.
├── apps/
│   ├── web/          # Next.js 15 Frontend (Client App)
│   └── api/          # Express.js Backend API
├── packages/
│   ├── database/     # Prisma Schema, Migrations, and Client
│   ├── types/        # Shared Type Definitions / API Contracts
│   └── tsconfig/     # Shared TypeScript configurations
├── turbo.json        # Turborepo orchestration settings
└── pnpm-workspace.yaml
```

---

## 🚀 Future Roadmap

To enhance user experience, improve scalability, and provide comprehensive food insights, our development strategy focuses on the following primary phases:

### 1. 🕸️ Vietnamese Product Knowledge Graph
We plan to build a structured semantic knowledge graph specifically for Vietnamese ingredients, regional condiments, and traditional foods. 
- Links food categories, preservation techniques, and common dishes.
- Standardizes local culinary terminology (e.g., regional names for herbs and fish sauces).

### 2. 🔍 Search-First & Self-Create Inventory Flow
To prevent duplicate or low-quality product entries in our catalog:
- **Search-First Entry**: Users are prompted to either scan a barcode or perform a quick text search of the global product catalog.
- **On-the-Fly Creation**: If the product is not found in the database, users can seamlessly transition to a "Self-Create" form to register the new item manually while contributing to the global dictionary.

### 3. 🧠 Semantic Vector Search Engine
We will integrate a lightweight Vector Search engine to augment standard database queries:
- Allows users to search with natural language queries (e.g., "what should I drink in the morning" or "leftover pork options").
- Improves matching reliability when dealing with typos, shorthand entries, or regional variations of Vietnamese product names.

### 4. ⚡ TanStack Query & Zustand State Upgrades
Enhance data-fetching robustness and client state handling:
- **TanStack Query (React Query)**: Add robust client-side caching, optimistic updates, and clean loading/error interfaces.
- **Zustand Slices**: Redesign the client state using Zustand's slice pattern for modular domain states (auth, inventory, UI state).

### 5. 🔌 Scalable Connection Pooling
Prepare the backend architecture for high-concurrency:
- Integrate **PgBouncer** or **Prisma Accelerate** to manage database connection pooling efficiently, supporting up to 100k+ concurrent active users.

---

## 📦 Getting Started

### Prerequisites
- **Node.js** (v22 or higher)
- **pnpm** (v9+)
- **Docker** (Optional, for database virtualization)

### 1. Installation
Clone the repository and install all dependencies:
```bash
pnpm install
```

### 2. Configure Database & Environment
Navigate to the database package to run Prisma migrations:
```bash
cd packages/database
# Configure DATABASE_URL in packages/database/.env
pnpm dlx prisma migrate dev --name init
```

### 3. Run the Development Server
Launch the frontend and backend in parallel using Turborepo:
```bash
pnpm dev
```
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 🏗️ Architecture & Best Practices

- **Contract Safety**: Define all shared interfaces and request/response models in `packages/types` to ensure end-to-end type safety between the frontend and api layers.
- **Safe Copywriting**: In compliance with our safety-first guidelines, user-facing notifications should remain friendly and cautious. Avoid rigid declarations like "thực phẩm đã hỏng" (certainly spoiled) or "chắc chắn an toàn" (guaranteed safe). Instead, favor recommendations like "nên kiểm tra" (recommended to check) or "nên dùng sớm" (use early).

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
