# Feature: Barcode Scanning & Auto-fill Integration
**Date:** May 17, 2026
**Branch:** `feature/barcode-scanning`

## 🎯 Mục tiêu
Tích hợp tính năng quét mã vạch (Barcode Scanner) cho ứng dụng Bếp An Tâm, cho phép người dùng mở camera quét sản phẩm và tự động đổ dữ liệu (Auto-fill) vào biểu mẫu thêm thực phẩm (`AddFoodForm`). Đồng thời tinh chỉnh môi trường giả lập (Mock DB) và cải thiện trải nghiệm Đăng nhập khách.

---

## 🛠 Những thay đổi & Chức năng đã phát triển

### 1. Phân tích & Cài đặt thư viện quét mã vạch
- **Thư viện:** Lựa chọn sử dụng `html5-qrcode` vì tính ổn định trên mobile và hỗ trợ mạnh mẽ các chuẩn mã vạch EAN, UPC, GS1.
- **GS1 Parser (`apps/web/components/scan/gs1-parser.ts`):** Xây dựng module nhận diện độ dài chuẩn mã vạch (13 số EAN-13, 8 số EAN-8) và loại bỏ các ký tự thừa chuẩn GS1.

### 2. Xây dựng UI & Logic quét mã (Bước 1 - 4)
- **Custom Hook (`use-barcode-scanner.ts`):** Quản lý trạng thái vòng đời của scanner (khởi động camera, đang quét, trạng thái lỗi, kết quả). Sửa lỗi strict-type của TypeScript bằng cách truyền bắt buộc `verbose: false` vào config. Đồng thời thêm cơ chế `Promise` khi tắt scanner để đảm bảo dọn dẹp sạch tiến trình camera.
- **Component quét mã (`barcode-scanner.tsx`):** UI hiển thị khung hình camera cơ bản.
- **Modal quét mã (`barcode-scanner-modal.tsx`):** Tích hợp khung camera vào hộp thoại (Dialog) của thư viện `shadcn/ui`, cho phép gọi camera dưới dạng Pop-up mượt mà.

### 3. Tích hợp biểu mẫu Auto-fill (Bước 5)
- Cập nhật `apps/web/components/food/add-food-form.tsx` để nhúng nút mở camera.
- Khi có mã vạch, tự động gọi API fetch thông tin sản phẩm qua hàm `getProductByBarcode` (`apps/web/lib/api/products.ts`).
- **Xử lý ánh xạ Dữ liệu (Data Mapping):** Giải quyết sự sai lệch cấu trúc dữ liệu giữa Frontend và Backend. Cụ thể, map các danh mục từ CSDL (`dairy`, `sauces_spices`) sang chuẩn form (`milk`, `sauce`), đồng thời gán vị trí bảo quản mặc định (`storageLocation = "fridge"`) để ngăn lỗi undefined Type.

### 4. Sửa lỗi hệ thống & Monorepo
- **Lỗi `@repo/types`:** Giải quyết lỗi UI báo `CATEGORY_OPTIONS is undefined` do package type chưa được biên dịch. Tiến hành rebuild package: `pnpm build --filter=@repo/types`.
- **Kiểm định Type Check:** Fix các lỗi TypeScript strict-mode không tương thích (như giá trị `null` sang `undefined` ở ảnh sản phẩm). Lệnh `pnpm build` tại root đã hoàn thành thành công hoàn toàn với *Exit code 0*.

### 5. Khắc phục môi trường (Guest Login & Mock DB)
- **Đăng nhập Khách (Guest Login):** Phát hiện frontend gọi sai phương thức Đăng nhập khách (đăng nhập bằng hardcode thay vì tạo mới). Sửa lại `apps/web/app/login/page.tsx` và `apps/web/lib/api/auth.ts` để móc nối trực tiếp đến endpoint `POST /api/auth/guest` sẵn có của backend, cho phép sinh session tự động.
- **Tự động hóa Môi trường Giả lập (Mock Data):** Để giải quyết lỗi Backend `Internal Server Error` do thiếu file `.env` chứa Database URL, mã nguồn tại `apps/api/src/container.ts` đã được tùy chỉnh mặc định kích hoạt cờ `USE_MOCK_DATA !== 'false'`.
- **Seed dữ liệu Mock:** Thêm thủ công sản phẩm *"Sữa tươi thanh trùng"* (mã vạch `8934563185152`) vào `packages/repositories/mock.ts` và thiết lập rebuild lại module, giúp người dùng lập tức có dữ liệu test auto-fill bằng camera mà không cần cài đặt PostgreSQL.

---

## 🚀 Các bước kế tiếp (Khuyến nghị)
1. Xác minh UI Auto-fill trên các trình duyệt / thiết bị di động thực tế.
2. Nối thông báo (Toast message) nếu mã vạch hợp lệ nhưng sản phẩm chưa tồn tại trong cơ sở dữ liệu.
3. Chấp nhận Pull Request từ `feature/barcode-scanning` để gộp vào nhánh chính.
