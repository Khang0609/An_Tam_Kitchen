# Bếp An Tâm - Technical Integration Contract

Tài liệu này xác định giao ước (Contract) kỹ thuật giữa Frontend (Next.js) và Backend (Express.js) để đảm bảo tính nhất quán của dữ liệu.

## 1. Cơ chế kết nối (Transport)
- **Base URL:** `process.env.NEXT_PUBLIC_API_URL` (Frontend) -> `process.env.PORT` (Backend).
- **Format:** JSON (UTF-8).
- **Credentials:** `include` (Gửi kèm HttpOnly Cookies cho Access/Refresh Token).
- **Response Wrapper:** Mọi API phản hồi theo cấu trúc:
  ```ts
  {
    data?: T;      // Dữ liệu chính
    error?: string;   // Mã lỗi hoặc thông báo lỗi ngắn
    message?: string; // Thông báo thành công (tùy chọn)
    count?: number;   // Dùng cho danh sách (tùy chọn)
  }
  ```

## 2. Authentication Contract
Dựa trên `SafeUserSchema` (Omit password).

| Endpoint | Method | Body | Auth | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/signup` | POST | `{ email, password, name }` | No | Tạo tài khoản mới |
| `/api/auth/login` | POST | `{ email, password }` | No | Trả về Set-Cookie (HttpOnly) |
| `/api/auth/logout` | POST | `{}` | Yes | Xóa Cookies và Refresh Token trong DB |

## 3. Inventory Contract (Tủ lạnh số)
Dựa trên `InventoryItemSchema` từ `@repo/types`.

### GET `/api/inventory`
- **Mô tả:** Lấy toàn bộ thực phẩm của User.
- **Dữ liệu trả về:** `data: InventoryItem[]` (Đã bao gồm quan hệ `product`).
- **Quan trọng:** Mỗi bản ghi InventoryItem phải chứa object `product` để Frontend tính toán trạng thái.

### POST `/api/inventory`
- **Body:** `CreateInventoryItemBody` (Zod validated).
- **Logic:** Backend tự động gán `userId` từ token.

## 4. Product Contract (Danh mục)
Dựa trên `ProductSchema`.

| Endpoint | Method | Query / Params | Ghi chú |
| :--- | :--- | :--- | :--- |
| `/api/products` | GET | `?global=true` hoặc `?ownerId=...` | Lấy danh mục sản phẩm |
| `/api/products/:id` | GET | `id` (uuidv7) | Chi tiết sản phẩm |

## 5. Quy tắc xử lý trạng thái (Food Status)
Trạng thái thực phẩm (`FoodStatusEnum`) tuân thủ nghiêm ngặt các giá trị:
- `fresh`: Còn ổn.
- `use_soon`: Nên dùng sớm.
- `check_before_use`: Cần kiểm tra kỹ.
- `not_recommended`: Không khuyến nghị để quá lâu.

**Contract logic:**
- Nếu Backend trả về `status`, Frontend hiển thị đúng giá trị đó.
- Nếu Backend trả về `null` cho `status`, Frontend sử dụng `resolveFoodStatus` (Service Layer) để tính toán dựa trên `openedAt` và `daysAfterOpen` của sản phẩm.

## 6. Shared Types Reference
Tất cả Schema được định nghĩa tại `packages/types`. Cấm tuyệt đối việc định nghĩa lại interface thủ công tại từng App.
- Product: `ProductSchema`
- Kho: `InventoryItemSchema`
- User: `UserSchema`
