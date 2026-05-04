# BỘ CÔNG CỤ KIỂM THỬ UI THỦ CÔNG TỔNG QUÁT

---

## 1. NGUYÊN TẮC KIỂM TRA

- **Kiểm tra từng màn hình một cách hệ thống**: mỗi trang (route) trong ứng dụng sẽ được kiểm tra theo cùng một bộ tiêu chí.
- **Kiểm tra trên các kích thước màn hình đại diện**:
  - Mobile: 375×812 (iPhone X), 412×915 (Android phổ biến)
  - Tablet: 768×1024 (iPad dọc), 1024×768 (ngang)
  - Desktop: 1366×768, 1920×1080
- **Kiểm tra trên các trình duyệt bắt buộc**:
  - Desktop: Chrome, Edge (Windows)
  - Mobile: Chrome (Android & iOS)
- **Luôn chụp ảnh màn hình** cho mọi lỗi phát hiện, ghi rõ kích thước màn hình và trình duyệt.
- **Sử dụng chế độ Device Toolbar của Chrome DevTools** để giả lập. Nếu có điều kiện, kiểm tra ít nhất một thiết bị Android thật và một iPhone thật.
- **Không cần phải viết test case trước**: chỉ cần cầm checklist này, mở từng trang, quan sát và ghi nhận sự khác biệt so với kỳ vọng thông thường. Đối chiếu với thiết kế mẫu nếu có (Figma, mockup). Nếu không có mockup, dựa vào cảm quan chung về tính nhất quán và hợp lý.

---

## 2. DELIVERABLE 1: CHECKLIST KIỂM TRA UI THỦ CÔNG

Dưới đây là bảng checklist chung cho **mỗi màn hình** (trang). 

| # | Mục kiểm tra | Chi tiết cần quan sát | Pass/Fail | Ghi chú |
|---|---|---|---|---|
| **A. BỐ CỤC & ĐỒ HỌA** |||||
| 1 | Cấu trúc trang | Header, footer, sidebar (nếu có) hiển thị đúng vị trí, không chồng lấn, không mất. | | |
| 2 | Logo | Logo rõ nét, đúng tỉ lệ, liên kết về trang chủ. | | |
| 3 | Hình ảnh minh họa | Không bị vỡ, méo, sai tỉ lệ. Có alt text phù hợp (chuột phải inspect kiểm tra). | | |
| 4 | Icon | Icon hiển thị đúng, không mất, có thuộc tính `aria-label` hoặc text ẩn cho screen reader. | | |
| 5 | Nút bấm (button) | Kích thước đủ lớn (tối thiểu 44×44px trên mobile), màu sắc đồng nhất trên toàn app, hover/focus đổi trạng thái. | | |
| 6 | Liên kết (link) | Màu sắc phân biệt rõ ràng, có gạch chân hoặc khác biệt khi hover. | | |
| **B. TYPOGRAPHY** |||||
| 7 | Font chữ | Sử dụng đúng font (kiểm tra bằng inspect element), không bị fallback sai. | | |
| 8 | Cỡ chữ & khoảng cách | Cỡ chữ dễ đọc (tối thiểu 16px cho nội dung chính), khoảng cách dòng và đoạn văn hợp lý, không quá dày. | | |
| 9 | Căn chỉnh văn bản | Văn bản không tràn ra ngoài container, không bị cắt xén ở các kích thước màn hình khác nhau. | | |
| **C. MÀU SẮC & TƯƠNG PHẢN** |||||
| 10 | Màu nền & chữ | Độ tương phản giữa chữ và nền: dùng công cụ "Lighthouse" (DevTools) hoặc kiểm tra nhanh bằng cách nhìn xem có khó đọc không. | | |
| 11 | Màu trạng thái | Màu thành công (xanh), cảnh báo (vàng), lỗi (đỏ) thống nhất toàn app. | | |
| 12 | Chế độ tối (nếu có) | Kiểm tra giao diện tối, màu sắc không bị chói, nút vẫn nhìn thấy rõ. | | |
| **D. TRẠNG THÁI GIAO DIỆN** |||||
| 13 | Trạng thái tải (loading) | Khi chờ dữ liệu: có spinner/skeleton, không nhấp nháy quá nhanh, không để màn hình trắng. | | |
| 14 | Trạng thái rỗng (empty) | Khi không có dữ liệu: hiển thị thông báo và hành động gợi ý (ví dụ "Chưa có sản phẩm, hãy quét mã"). | | |
| 15 | Trạng thái lỗi | Lỗi mạng, lỗi server: hiển thị thông báo thân thiện, có nút thử lại nếu hợp lý. | | |
| 16 | Trạng thái thành công | Sau khi thêm/sửa/xoá: có toast hoặc thông báo thành công. | | |
| 17 | Trạng thái hover/focus | Hover chuột đổi màu nền nhẹ, focus (bàn phím Tab) có viền nổi rõ. | | |
| **E. RESPONSIVE** |||||
| 18 | Mobile: cuộn ngang | Tuyệt đối không xuất hiện thanh cuộn ngang ở bất kỳ màn hình nào (trừ bảng dữ liệu được thiết kế riêng). | | |
| 19 | Mobile: nút chạm | Các nút cách nhau đủ xa, không bị nhấn nhầm. Kiểm tra bằng cách đưa ngón tay vào. | | |
| 20 | Tablet: xoay màn hình | Chuyển từ dọc sang ngang, layout không vỡ, nội dung không biến mất. | | |
| 21 | Desktop: resize cửa sổ | Kéo nhỏ dần cửa sổ, layout chuyển đổi mượt ở các điểm gãy, không xảy ra tình trạng "chết" layout. | | |
| 22 | Bàn phím ảo (mobile) | Khi nhập liệu, bàn phím ảo hiện lên không che khuất input đang focus. | | |
| 23 | Thanh điều hướng (mobile) | Menu hamburger hoạt động, đóng/mở mượt; không có item bị tràn. | | |
| 24 | Hình ảnh responsive | Hình ảnh tự thu nhỏ theo màn hình, không giữ kích thước cố định làm vỡ layout. | | |
| **F. TƯƠNG TÁC CẢM ỨNG (TOUCH)** |||||
| 25 | Nút bấm | Phản hồi khi chạm (hiệu ứng ripple hoặc đổi màu nhẹ), không bị trễ. | | |
| 26 | Cử chỉ (nếu có) | Vuốt để xóa, kéo để refresh (nếu được implement): hoạt động mượt, không bị giật. | | |
| 27 | Camera preview (nếu có) | Trên mobile, camera hiển thị toàn bộ khung quét, không bị méo mó khi xoay. Xem thử ở cả hai chiều dọc/ngang. | | |
| **G. KHẢ NĂNG TIẾP CẬN CƠ BẢN (WCAG AA)** |||||
| 28 | Tab order | Dùng phím Tab để điều hướng, thứ tự hợp lý từ trên xuống, từ trái sang. | | |
| 29 | Focus visible | Mỗi phần tử khi focus hiện viền nổi rõ ràng (không bị CSS ẩn `outline:none` không có thay thế). | | |
| 30 | Label form | Tất cả ô nhập liệu có label liên kết (hoặc `aria-label`). Kiểm tra bằng cách click vào nhãn xem có focus vào input không. | | |
| 31 | Thông báo lỗi | Lỗi validation hiển thị dưới dạng text (không chỉ màu đỏ), và được liên kết với input bằng `aria-describedby`. | | |
| 32 | Hình ảnh có alt | Tất cả ảnh quan trọng có `alt` mô tả; ảnh trang trí có `alt=""`. | | |

> **Cách dùng**: Với mỗi trang trong app, mở checklist này, lần lượt kiểm tra từng mục, ghi Pass hoặc Fail. Với mỗi Fail, chụp màn hình, ghi lại số mục, tạo bug report chi tiết.

---

## 3. DELIVERABLE 2: MẪU BÁO CÁO LỖI UI

Đây là template mà tester sẽ dùng để báo cáo từng lỗi riêng lẻ (ví dụ đưa vào GitHub Issues, Trello, Excel).

```
Tiêu đề: [UI][Responsive] <mô tả ngắn gọn - tên trang, kích thước, vấn đề>

Mức độ nghiêm trọng (Severity): [S1 – Chặn sử dụng | S2 – Nghiêm trọng | S3 – Trung bình | S4 – Nhẹ]
Ưu tiên (Priority):              [P1 – Cần sửa ngay | P2 – Sửa trước release | P3 – Sửa khi có thể]

Môi trường:
- URL:            <link trang bị lỗi>
- Trình duyệt:    [Chrome 121 | Edge 120 | Chrome Android 120]
- Kích thước:     [375×812 | 1366×768 | ...]
- Thiết bị:       [Samsung A54 (thật) | iPhone SE giả lập]

Mô tả:
<Mô tả ngắn gọn vấn đề: nút bị tràn ra ngoài màn hình, chữ bị mất nửa, ...>

Các bước tái hiện:
1. Vào trang '...'
2. Ở kích thước màn hình '...'
3. Quan sát phần tử '...'

Kết quả thực tế:
<mô tả lỗi, đính kèm ảnh chụp màn hình đánh dấu>

Kết quả mong đợi:
<mô tả giao diện đúng như thiết kế hoặc hợp lý>

Ảnh chụp / video:
<đính kèm file>

Ghi chú thêm:
(nếu liên quan tới WCAG, responsive breakpoint cụ thể…)
```

**Ví dụ thực tế:**

> **Tiêu đề:** [UI][Responsive] Nút "Thêm sản phẩm" bị tràn ra ngoài màn hình iPhone SE (375px)
> **Mức độ:** S2 – Nghiêm trọng | **Ưu tiên:** P1
> **Môi trường:** URL: `https://staging.example.com/products`, Chrome Android 120, Samsung A54 thật, 412×915

---

## 4. CÁCH TỔ CHỨC BUỔI TEST MANUAL

### Chuẩn bị trước buổi test

- Mở sẵn checklist trên máy (có thể in hoặc dùng Excel Online).
- Chuẩn bị sẵn link tới tất cả các màn hình cần test: `/`, `/scan`, `/products`, `/login`, `/profile`, v.v.
- Mở sẵn Chrome DevTools, bật Device Toolbar.
- Có ít nhất một điện thoại Android thật và một iPhone thật (nếu có thể). Nếu không, dùng giả lập.

### Thực hiện test

- Test lần lượt từng màn hình, bắt đầu từ mobile (375) → tablet (768) → desktop (1366).
- Với mỗi dòng trong checklist, xác nhận Pass hoặc ghi Fail.
- Hễ gặp Fail, dừng lại một chút, ghi nhận đầy đủ thông tin vào template bug report, lưu ảnh chụp. Đánh dấu vào cột "Ghi chú" trong checklist là "Bug #xyz".

### Sau khi test hết màn hình

- Tổng hợp danh sách lỗi (Bug List).
- Phân loại lỗi theo mức độ và khu vực (responsive, màu sắc, typography, accessibility).
- Viết **Báo cáo tổng kết UI** (xem phần 5 bên dưới).

---

## 5. DELIVERABLE 3: MẪU BÁO CÁO TỔNG KẾT UI

```
BÁO CÁO KIỂM TRA GIAO DIỆN & RESPONSIVE
=========================================
Phiên bản:     1.0
Ngày kiểm tra: dd/mm/yyyy
Người kiểm tra: [Tên]
Phạm vi:       Tất cả các màn hình chính (liệt kê danh sách các trang đã test)
Thiết bị/Trình duyệt:
  - Chrome Desktop (Win11)
  - Edge Desktop (Win11)
  - Chrome Android (Samsung A54)
  - Chrome iOS (giả lập iPhone 13)

I. TỔNG QUAN KẾT QUẢ
---------------------
- Tổng số mục trong checklist: [X] (trên tất cả các trang)
- Số Pass:                      [Y]
- Số Fail:                      [Z]
- Tỉ lệ Pass:                   [%]
- Tổng số lỗi ghi nhận:         [N]

II. PHÂN LOẠI LỖI THEO MỨC ĐỘ NGHIÊM TRỌNG
--------------------------------------------
- S1 (Chặn sử dụng): [số lượng]
- S2 (Nghiêm trọng): [số lượng]
- S3 (Trung bình):   [số lượng]
- S4 (Nhẹ):          [số lượng]

III. PHÂN LOẠI THEO KHU VỰC
----------------------------
- Responsive (bố cục vỡ, tràn, ẩn):  X lỗi
- Màu sắc & tương phản:               X lỗi
- Typography:                          X lỗi
- Trạng thái (loading, empty, error): X lỗi
- Khả năng tiếp cận (WCAG):           X lỗi
- Touch / Tương tác:                  X lỗi

IV. DANH SÁCH LỖI CHI TIẾT
---------------------------
| ID | Màn hình  | Mô tả ngắn            | Severity | Priority | Môi trường                |
|----|-----------|------------------------|----------|----------|---------------------------|
| 1  | /scan     | Nút quét bị tràn...   | S2       | P1       | iPhone SE, Chrome iOS     |
| 2  | /products | Thiếu focus outline... | S3       | P2       | Desktop Chrome            |
| …  | …         | …                      | …        | …        | …                         |

V. ĐÁNH GIÁ CHUNG
------------------
Điểm mạnh:
- Giao diện desktop cơ bản ổn, màu sắc dễ chịu, responsive trên tablet hoạt động tốt.

Điểm yếu cần cải thiện:
- Layout trên mobile nhỏ (dưới 400px) hay bị tràn.
- Nhiều input chưa có label rõ ràng.
- Chưa có focus indicator khi dùng bàn phím.

VI. KHUYẾN NGHỊ
---------------
- Sửa ngay các lỗi S1, S2 trước khi release tiếp theo.
- Bổ sung `data-testid` cho các thành phần chính để phục vụ tự động hóa sau này.
- Thiết lập style guide chung về nút bấm, màu sắc lỗi/thành công để tránh sai khác giữa các trang.
```

---
## 6. DELIVERABLES CUỐI CÙNG 

| # | Deliverable | Định dạng |
|---|---|---|
| 1 | Issue Log (có filter theo mức độ) | Excel / Google Sheet |
| 2 | Test Summary Report tổng quan | Markdown / PDF / Google Docs |
| 3 | Thư mục ảnh/video đính kèm | Google Drive / thư mục ZIP |
