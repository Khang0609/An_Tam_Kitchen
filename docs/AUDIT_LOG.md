# AUDIT LOG - Bếp An Tâm Project Overview

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc kỹ thuật và cấu trúc của dự án Bếp An Tâm (An Tam Kitchen) dựa trên việc phân tích các tệp tin cấu hình hiện tại.

## 1. Kỹ thuật & Cấu trúc (Technical Landscape)

### 🗄️ Database
- **Loại:** **PostgreSQL**.
- **ORM:** **Prisma**.
- **Chi tiết:**
  - Sử dụng gói `pg` (PostgreSQL client) và `@prisma/adapter-pg`.
  - Cấu hình Prisma nằm tại `packages/database`.
  - Có cơ chế đồng bộ schema qua `prisma generate` và `prisma db push`.

### 🧠 Quản lý State & Data Fetching
- **State Management:** **Zustand** (`zustand` được cài đặt trong `apps/web`).
- **Data Fetching:** Hiện tại **không** thấy sự hiện diện của TanStack Query (React Query). Dự án chủ yếu sử dụng:
  - **Next.js Server Components** để fetch dữ liệu từ phía server.
  - Một **Service Layer** được định nghĩa để xử lý logic (ví dụ: `resolveFoodStatus`).
  - Giao tiếp với API qua JSON/UTF-8 với thông tin xác thực qua HttpOnly Cookies.

### 🎨 UI Library & Form Handling
- **Styling:** **Tailwind CSS** (v4) và **shadcn/ui**.
- **Icons:** **Lucide React** (`lucide-react`).
- **Form Handling:** **React Hook Form** (`react-hook-form`).
- **Validation:** **Zod** (`zod`) kết hợp với `@hookform/resolvers`.
- **Animation:** **Motion** (Framer Motion) và `tw-animate-css`.

### 🏗️ Monorepo Management
- **Tool:** **Turborepo** kết hợp với **pnpm workspaces**.
- **Cấu trúc thư mục:**
  - `apps/web`: Frontend (Next.js).
  - `apps/api`: Backend (Express.js).
  - `packages/database`: Prisma schema và database client.
  - `packages/repositories`: Data access layer chung.
  - `packages/types`: Định nghĩa schema Zod và TypeScript types dùng chung (Shared Contracts).
  - `packages/typescript-config`: Cấu hình TS dùng chung.

---

## 2. Các quy ước quan trọng (Critical Contracts)

### 📝 Giao ước Frontend-Backend (Contract)
- **Shared Types:** Tất cả schema dữ liệu (Product, Inventory, User) được định nghĩa tập trung tại `packages/types` bằng Zod. **Cấm** định nghĩa lại interface thủ công tại từng app.
- **Response Format:** Mọi API phản hồi theo cấu trúc chuẩn:
  ```ts
  {
    data?: T;      // Dữ liệu chính
    error?: string;   // Mã lỗi hoặc thông báo lỗi ngắn
    message?: string; // Thông báo thành công (tùy chọn)
    count?: number;   // Dùng cho danh sách (tùy chọn)
  }
  ```
- **Food Status Logic:** 
  - Ưu tiên trạng thái (`status`) từ Backend trả về.
  - Nếu Backend trả về `null`, Frontend sẽ dùng rule tạm thời (`resolveFoodStatus`) để tính toán.

### 📡 Chi tiết Giao tiếp API (API Integration)
Để xem chi tiết từng Endpoint và Body/Response, tham khảo: [CONTRACT_INTEGRATION.md](CONTRACT_INTEGRATION.md)

| Nhóm chức năng | Tài liệu chi tiết | Ghi chú |
| :--- | :--- | :--- |
| **Authentication** | [Mục 2 - Auth](CONTRACT_INTEGRATION.md#2-authentication-contract) | Signup, Login (HttpOnly Cookies), Logout |
| **Inventory** | [Mục 3 - Inventory](CONTRACT_INTEGRATION.md#3-inventory-contract-tủ-lạnh-số) | Quản lý tủ lạnh, tự động gán UserId |
| **Products** | [Mục 4 - Products](CONTRACT_INTEGRATION.md#4-product-contract-danh-mục) | Danh mục sản phẩm mẫu và cá nhân |
| **Food Status** | [Mục 5 - Logic](CONTRACT_INTEGRATION.md#5-quy-tắc-xử-lý-trạng-thái-food-status) | Quy tắc đồng bộ trạng thái thực phẩm |

### 📂 Cấu hình Path Alias
- Backend (`apps/api`) sử dụng `tsc-alias` để xử lý path alias (`@/`) khi build, đảm bảo tính ổn định khi deploy lên các môi trường như Vercel.

### 🗣️ Ubiquitous Language (Ngôn ngữ chung)
- **Tủ lạnh số:** Danh sách thực phẩm của người dùng.
- **Sản phẩm (Product):** Danh mục mẫu (vd: Sữa TH True Milk).
- **Thực phẩm (Inventory Item):** Bản ghi cụ thể trong tủ lạnh của user (vd: Hộp sữa đã mở ngày 09/05).
- **Nguyên tắc Copywriting:** Tránh dùng từ ngữ khẳng định tuyệt đối về an toàn thực phẩm. Ưu tiên "Khuyến nghị", "Nên dùng sớm", "Cần kiểm tra".

---

## 2. Lộ trình tính năng & Nghiệp vụ (Feature Roadmap Analysis)

Dựa trên việc phân tích Codebase hiện tại, đây là bức tranh về các tính năng nghiệp vụ:

### 📥 Phương thức nhập liệu (Input Method)
- **Hiện tại:** Chủ yếu là **Nhập liệu thủ công (Manual)** qua form `AddFoodForm`.
- **Hỗ trợ nhanh:** Tính năng **"Dùng sản phẩm mẫu"** giúp điền nhanh thông tin dựa trên dữ liệu có sẵn.
- **Tiềm năng (Future):** Database Schema đã có trường `barcode` và API Controller đã có logic kiểm tra barcode trùng lặp. Hệ thống đã sẵn sàng để tích hợp quét mã vạch (Barcode Scanning) hoặc OCR.

### 🔔 Hệ thống thông báo (Notification System)
- **Cấu trúc:** Đã có Model `FoodNotification` trong database với các loại: `expiry_warning` (sắp hết hạn) và `open_limit_warning` (quá hạn mở nắp).
- **Trạng thái:** Hiện mới dừng ở mức **Thiết kế hạ tầng dữ liệu**. Chưa thấy logic gửi Push Notification hoặc Email tự động (Cron jobs/Workers) trong codebase hiện tại.

### 👥 Mô hình người dùng (User Model)
- **Hiện tại:** **Cá nhân hóa (Isolated)**. Mỗi người dùng sở hữu một "Tủ lạnh số" riêng biệt. `InventoryItem` gắn chặt với `userId`.
- **Mở rộng:** Chưa có thực thể `Household` hay `Group` để dùng chung tủ lạnh giữa nhiều người dùng (gia đình).

### ❄️ Vị trí bảo quản (Storage Locations)
- **Phạm vi:** Hỗ trợ 3 khu vực: **Tủ lạnh (Fridge)**, **Tủ đông (Freezer)**, **Kệ bếp/Nhiệt độ phòng (Room Temp)**.
- **Quy tắc tính toán:** 
  - Sử dụng logic `daysBeforeOpen` (hạn gốc) và `daysAfterOpen` (hạn sau khi mở nắp) định nghĩa trong `Product`/`UserProduct`.
  - Hệ thống cho phép linh hoạt quy tắc theo từng sản phẩm cụ thể thay vì áp đặt quy tắc cứng cho từng khu vực.

---

## 3. Quy trình phát triển (Development Workflow)

Phần này mô tả cách thức vận hành và các lệnh cơ bản để làm việc với dự án.

### 💻 Môi trường chạy (Run Environment)
- **Trạng thái:** Toàn bộ project (Web & API) đã được cấu hình sẵn sàng trong Monorepo. Các service có thể chạy song song và giao tiếp với nhau qua cấu hình URL trong `.env`.
- **Lệnh khởi động chính:** 
  - `pnpm dev`: Khởi động toàn bộ các service (apps/web, apps/api) cùng lúc bằng Turborepo.
  - `pnpm build`: Build production cho toàn bộ project.
  - `pnpm lint`: Kiểm tra lỗi code style trên toàn bộ monorepo.

### 🛠️ Các lệnh bổ trợ (Sub-commands)
- **Database (tại `packages/database`):**
  - `npx prisma generate`: Cập nhật Prisma Client sau khi sửa schema.
  - `npx prisma db push`: Đẩy thay đổi schema lên database trực tiếp (dùng cho development).
  - `npx prisma studio`: Mở giao diện quản lý dữ liệu trực quan.

### 🔄 Luồng làm việc (Workflow)
1. Chỉnh sửa logic hoặc UI.
2. Kiểm tra tính nhất quán với Shared Types tại `packages/types`.
3. Chạy `pnpm lint` hoặc `pnpm build` (local) để đảm bảo không có lỗi TypeScript hoặc Build lỗi.

---
*Cập nhật lần cuối: 2026-05-09*

