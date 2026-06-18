# Ghi chú Quản lý Dependency & Lộ trình Express v5

Dành cho dự án nhóm **An Tâm Kitchen**.

## 0. Mục tiêu trọng tâm (Main Goals)
- **Đồng bộ hóa Dependency**: Sử dụng pnpm Catalogs để khóa phiên bản toàn dự án.
- **Nâng cấp Express v5**: Tận dụng Native Promise và bảo mật mới. Đây là bản "đánh cược" vào sự hiện đại và sạch sẽ của code.

## 1. Hệ thống "Nguồn sự thật duy nhất" (pnpm Catalogs)
- **File cấu hình:** `pnpm-workspace.yaml` (mục `catalogs`).
- **Cách dùng:** Khai báo version tại root, các package con dùng `"catalog:"`.
- **Lợi ích:** Nâng cấp Express hay bất kỳ thư viện nào chỉ cần sửa đúng 1 chỗ ở root.

## 2. Công cụ kiểm soát (Manypkg)
- **Lệnh kiểm tra:** `pnpm manypkg:check` (Chạy trước khi commit).
- **Lệnh sửa tự động:** `pnpm manypkg:fix` (Sắp xếp package.json).

## 3. Lộ trình nâng cấp Express v5 (Nghiên cứu kỹ Docs)
- **Lợi ích**: Code async sạch hơn (không cần `try/catch` + `next(err)`).
- **Lưu ý quan trọng (Checklist):**
    - [ ] Kiểm tra các Route dùng ký tự đặc biệt (do `path-to-regexp` thay đổi).
    - [ ] `req.query` hiện là read-only getter.
    - [ ] Chuyển `res.json(obj, status)` sang `res.status(status).json(obj)`.
- **Tài liệu nghiên cứu:** [Express 5 Migration Guide](https://expressjs.com/en/guide/migrating-5.html).

## 4. Dự định tiếp theo (Future Steps)
- Cài đặt **Husky** để tự động chạy `manypkg:check` khi commit.
- Chuyển version trong `pnpm-workspace.yaml` sang `^5.0.0` sau khi test kỹ.

---
**Xóa sau khi làm xong**
