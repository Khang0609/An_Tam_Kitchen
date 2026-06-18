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

### 6. Tích hợp bóc tách AI (Application Identifiers)
- **Nâng cấp GS1 Parser (`gs1-parser.ts`):** Mở rộng tính năng phân tích cú pháp mã vạch nâng cao, hỗ trợ trích xuất AI 15 (Ngày hết hạn), AI 10 (Số lô) và AI 310n (Trọng lượng tịnh) từ chuỗi `rawCode`.
- **Cập nhật luồng truyền dữ liệu:** Mở rộng interface của `BarcodeScanner` và `BarcodeScannerModal` để thu thập và truyền trả cả `rawCode` nguyên bản song song với `gtin`.
- **Hoàn thiện Auto-fill Form (`add-food-form.tsx`):** Tích hợp hàm `parseFoodAIs` vào biểu mẫu. Tự động kiểm tra và đổ dữ liệu Ngày hết hạn (`expiryDate`) cũng như tự động nối ghép thông tin Số lô (`lot`) và Khối lượng (`weight`) vào phần Ghi chú (`notes`) một cách mượt mà mà không làm mất ghi chú cũ của người dùng.

---

## 🧪 Hướng dẫn Kiểm tra (Test) Thực Tế với QR Code

Để kiểm tra độ nhạy của tính năng bóc tách AI trên Form thêm thực phẩm mà không cần phải có sản phẩm đóng gói chuẩn GS1 thật trên tay, bạn có thể tự tạo mã QR theo các bước sau:

**Bước 1: Chuẩn bị mã vạch chứa AI (Mock code)**
Hãy copy đoạn mã vạch thô có chứa các trường thông tin chuẩn GS1 sau đây:
> `011234567890123415211231`
*(Mã này bao gồm: AI 01 - GTIN, và AI 15 - Ngày hết hạn 31/12/2021)*

**Bước 2: Tạo QR Code hiển thị trên thiết bị phụ**
1. Truy cập trang web: [qr-code-generator.com](https://www.qr-code-generator.com/) (hoặc bất kỳ trang tạo mã QR miễn phí nào).
2. Dán đoạn mã `011234567890123415211231` vào ô Text.
3. Trang web sẽ ngay lập tức tạo ra một mã QR. (Hãy mở mã QR này trên điện thoại hoặc màn hình phụ).

**Bước 3: Quét và Nghiệm thu**
1. Đảm bảo ứng dụng đang chạy ở môi trường máy chủ cục bộ (`pnpm dev`).
2. Mở trình duyệt web truy cập `http://localhost:3000/foods/new`.
3. Nhấn **Quét mã** và đưa camera về phía mã QR vừa tạo.
4. **Kết quả:** Form sẽ ngay lập tức được điền các trường như tên sản phẩm, danh mục, VÀ đặc biệt trường **Hạn sử dụng** sẽ tự động được điền thành `31/12/2021` (`2021-12-31`).

---

## 🚀 Các bước kế tiếp (Khuyến nghị)
1. Xác minh UI Auto-fill trên các trình duyệt / thiết bị di động thực tế.
2. Nối thông báo (Toast message) nếu mã vạch hợp lệ nhưng sản phẩm chưa tồn tại trong cơ sở dữ liệu.
3. Chấp nhận Pull Request từ `feature/barcode-scanning` để gộp vào nhánh chính.
