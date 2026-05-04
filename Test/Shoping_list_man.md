# QUẢN LÝ DANH SÁCH MUA

Tester đọc từng hàng, thực hiện theo cột "Cách thực hiện", và so sánh với "Kết quả mong đợi". Các test case tập trung vào hành vi chung của một danh sách quản lý dữ liệu (CRUD) và giao diện người dùng, không đi sâu logic nghiệp vụ đặc thù.

---

## 1. BỘ TEST CASE

### Giao diện (UI)

| ID | Hạng mục | Cách thực hiện | Kết quả mong đợi |
|---|---|---|---|
| **UI-01** | Danh sách rỗng | Mở trang danh sách khi chưa có sản phẩm nào (tài khoản mới). | Hiển thị thông báo nhẹ nhàng, ví dụ: "Danh sách trống. Hãy quét mã để thêm sản phẩm." hoặc icon minh họa. Không hiển thị bảng trống trơn không chỉ dẫn. |
| **UI-02** | Danh sách có dữ liệu | Thêm ít nhất 5 sản phẩm. Quan sát bảng/danh sách. | Mỗi sản phẩm hiển thị đầy đủ các trường cơ bản (tên, mã vạch, ngày mua, số lượng, giá, ảnh nếu có). Sắp xếp mặc định mới nhất trước. Cột và hàng thẳng hàng, text không bị cắt xén. |
| **UI-03** | Responsive mobile | Mở trên Chrome mobile (375×812), xoay ngang. | Danh sách chuyển sang card hoặc bảng cuộn ngang nếu cần, không vỡ layout. Nút thao tác đủ lớn để chạm (tối thiểu 44×44px). Chữ không đè lên nhau. |
| **UI-04** | Responsive tablet | Mở trên iPad (768×1024) hoặc viewport tương ứng. | Giao diện tận dụng không gian rộng hơn, vẫn dễ đọc, khoảng cách hợp lý. |
| **UI-05** | Hover/active (desktop) | Hover chuột vào từng dòng. | Dòng đó đổi màu nền nhẹ để phân biệt. Con trỏ chuột thành `pointer` nếu bấm được để xem chi tiết. |

### Chức năng (Functional)

| ID | Hạng mục | Cách thực hiện | Kết quả mong đợi |
|---|---|---|---|
| **FUNC-01** | Thêm sản phẩm thủ công | Tìm nút "Thêm sản phẩm" hoặc "Nhập mã tay". Nhập một mã vạch hợp lệ từ bộ test data. | Sản phẩm mới xuất hiện đầu danh sách. Thông tin (tên, ảnh…) hiển thị đúng. |
| **FUNC-02** | Thêm sản phẩm bằng quét mã | Dùng camera quét một mã GS1 hợp lệ. | Sản phẩm được thêm vào danh sách. Có thông báo thành công (toast/banner) tự tắt sau vài giây. |
| **FUNC-03** | Thêm sản phẩm trùng mã | Thêm một sản phẩm đã có trong danh sách. | Hệ thống xử lý: tăng số lượng hoặc thông báo "Sản phẩm đã tồn tại" kèm lựa chọn cập nhật. Không được crash hay tạo dòng trùng lặp không kiểm soát. |
| **FUNC-04** | Sửa thông tin sản phẩm | Bấm icon sửa (bút chì) trên một sản phẩm. Thay đổi số lượng, ghi chú, ngày mua. Lưu. | Thông tin cập nhật chính xác, danh sách phản ánh thay đổi ngay. Nếu validate thất bại (số lượng âm, ngày không hợp lệ), hiện thông báo lỗi cụ thể. |
| **FUNC-05** | Xóa một sản phẩm | Bấm icon xóa (thùng rác) trên một sản phẩm. | Popup xác nhận "Bạn có chắc muốn xóa [tên sản phẩm]?". Nếu OK → sản phẩm biến mất. Nếu Cancel → trở về trạng thái cũ. |
| **FUNC-06** | Xóa nhiều sản phẩm (nếu có) | Chọn checkbox nhiều dòng, bấm "Xóa đã chọn". | Popup xác nhận số lượng sẽ xóa. Sau khi xác nhận, các dòng biến mất. Nếu chưa chọn dòng nào, nút bị disable hoặc báo "Vui lòng chọn sản phẩm". |
| **FUNC-07** | Phân trang (nếu có >10 mục) | Thêm >20 sản phẩm. Kiểm tra các control phân trang. | Số trang hiển thị chính xác. Bấm Trang sau/Trang trước không sai dữ liệu. Ở trang cuối, nút "Trang sau" bị disable. |
| **FUNC-08** | Tìm kiếm trong danh sách | Nhập từ khóa vào ô tìm kiếm (tên sản phẩm, mã vạch). | Danh sách lọc real-time hoặc sau Enter. Xóa từ khóa → danh sách trở về đầy đủ. Không tìm thấy → hiện "Không tìm thấy sản phẩm". |
| **FUNC-09** | Sắp xếp danh sách | Bấm vào tiêu đề cột (Tên, Ngày mua) nếu có chức năng sắp xếp. | Mỗi lần bấm đổi chiều tăng/giảm, mũi tên chỉ đúng hướng. Thứ tự sản phẩm thay đổi chính xác (tên A–Z, ngày mới–cũ…). |

### Trải nghiệm người dùng (UX)

| ID | Hạng mục | Cách thực hiện | Kết quả mong đợi |
|---|---|---|---|
| **US-01** | Thời gian tải danh sách | Tải lại trang với 10, 50, 100 sản phẩm (nếu có thể tạo data). | Với 100 sản phẩm, danh sách hiển thị trong vòng 2–3 giây. Không trắng trang kéo dài. Có skeleton loading hoặc spinner trong lúc tải. |
| **US-02** | Hành vi khi mất kết nối | Đang ở danh sách, tắt mạng (DevTools → Network → Offline). Thực hiện thêm, sửa, xóa. | Thông báo lỗi mạng rõ ràng, không crash. Sau khi bật mạng lại, danh sách tải đúng dữ liệu server. *(Ghi nhận nếu chưa hỗ trợ offline – đó là phát hiện để cải thiện version sau.)* |
| **US-03** | Thông báo thành công/lỗi | Thực hiện bất kỳ thao tác thành công hoặc lỗi validate. | Toast xuất hiện ở vị trí dễ thấy (góc trên phải hoặc dưới cùng). Tự biến mất sau 3–5 giây hoặc có nút tắt. Màu: xanh = thành công, đỏ = lỗi. Nội dung mô tả đúng hành động, không dùng mã lỗi khó hiểu. |

### Khả năng tiếp cận (Accessibility)

| ID | Hạng mục | Cách thực hiện | Kết quả mong đợi |
|---|---|---|---|
| **ACC-01** | Focus và bàn phím | Dùng Tab di chuyển qua: nút thêm, ô tìm kiếm, icon sửa/xóa từng dòng, checkbox, phân trang. | Tất cả nhận focus theo thứ tự tự nhiên (trái sang phải, trên xuống dưới). Focus indicator rõ ràng (viền xanh/đen). Có thể kích hoạt chức năng bằng Enter hoặc Space. |
| **ACC-02** | Screen reader (NVDA) | Bật NVDA, vào danh sách có ít nhất 3 sản phẩm. | Trình đọc phải đọc: tiêu đề cột (nếu là bảng), tên từng sản phẩm, tên các nút "Sửa"/"Xóa". Popup xóa phải được đọc lên. Thông báo thành công phải được đọc. |
| **ACC-03** | Tương phản và font chữ | Kiểm tra bằng Axe DevTools extension hoặc "Colour Contrast Analyser". | Text thường đạt tối thiểu **4.5:1**, text lớn đạt **3:1**. Font chữ dễ đọc, cỡ tối thiểu 14px cho nội dung chính. |

### Bảo mật (Security)

| ID | Hạng mục | Cách thực hiện | Kết quả mong đợi |
|---|---|---|---|
| **SEC-01** | Phân quyền dữ liệu | Đăng nhập User A, thêm vài sản phẩm. Đăng xuất, đăng nhập User B. Kiểm tra danh sách. | User B không thấy sản phẩm của User A. Không thể lấy dữ liệu của user khác bằng cách thay đổi ID trên URL. |
| **SEC-02** | XSS cơ bản | Trong ô ghi chú/tên sản phẩm, nhập `<script>alert(1)</script>`. | Khi hiển thị lại, script không được thực thi. Nội dung hiển thị như text thuần túy hoặc được escape đúng cách. |

---

## 2. DELIVERABLES

### 2.1. File Test Case (`manual-test-cases-quan-ly-danh-sach-mua.xlsx`)

- **Sheet "TestCases":** Copy bảng trên, thêm 2 cột: `Kết quả thực tế (Pass/Fail)` và `Ghi chú` để tester điền khi chạy.
- **Sheet "TestData":** Liệt kê các mã vạch mẫu sẽ dùng, thông tin tài khoản User A và User B.

### 2.2. Mẫu Báo cáo tổng kết (`test-summary-report-v1.md`)

```
# Báo cáo kiểm thử thủ công – Quản lý danh sách mua (Version 1)

Ngày thực hiện: dd/mm/yyyy
Tester:         [Tên]
Môi trường:     Windows 11, Chrome 125, Android 14 Chrome, iPhone iOS 17 Safari

## Tổng quan
- Tổng số test case: 22
- Pass:              ...
- Fail:              ...
- Không áp dụng:     ... (nếu chức năng chưa có)

## Danh sách lỗi phát hiện
| ID Bug  | Test case ID | Mô tả ngắn                              | Mức độ    | Link Issue |
|---------|--------------|-----------------------------------------|-----------|------------|
| BUG-001 | FUNC-03      | Thêm sản phẩm trùng tạo 2 dòng giống hệt | Cao       | #15        |
| BUG-002 | ACC-02       | NVDA không đọc tên sản phẩm trong bảng  | Trung bình | #16        |

## Kết quả kiểm tra Accessibility (WCAG AA)
- Điểm Lighthouse: 82 (cần cải thiện tương phản)
- Vấn đề manual: Thiếu label cho icon sửa/xóa; chưa thông báo bằng aria-live khi xóa.

## Kết quả kiểm tra phân quyền
- Pass: mỗi user chỉ thấy dữ liệu của mình.
- Cảnh báo: API GET /api/products không kiểm tra user ID phía server,
  nhưng frontend gửi đúng token nên tạm an toàn. Cần kiểm tra lại bằng Postman.

## Đề xuất cải thiện cho version sau
1. Thêm xác nhận khi xóa hàng loạt.
2. Hỗ trợ swipe để xóa trên mobile.
3. Tự động lưu lịch sử quét để dễ khôi phục sản phẩm đã xóa.
```

---

## 3. QUY TRÌNH TRIỂN KHAI

1. **Nhận bộ test case:** Lưu bảng trên vào Excel/Google Sheets.
2. **Chuẩn bị môi trường:** Mở web version 1 trên Chrome desktop và mobile. Tạo sẵn 2 user (A, B) và vài mã vạch mẫu từ bộ test data GS1.
3. **Thực thi:** Chạy lần lượt từng case. Khi có Fail → tạo GitHub Issue ngay, ghi ID bug vào cột Ghi chú.
4. **Sau khi chạy hết:** Tổng hợp kết quả, viết báo cáo theo mẫu, gửi cho team/PO.
5. **Accessibility bổ sung:** Cài Axe DevTools extension để quét nhanh song song với các case ACC thủ công.

---

## 4. LƯU Ý ĐIỀU CHỈNH

Vì chưa thấy giao diện thật, một số case có thể không khớp 100%. Tester linh hoạt như sau:

- Chưa có phân trang → bỏ qua **FUNC-07**.
- Dùng `<table>` thực sự → kiểm tra table semantics cho accessibility (scope, caption).
- Có thêm field đặc thù → thêm test case cho field đó (validate, format).
- Nếu chưa có thì thêm vào phần " mô tả ngắn " là chưa có để thực hiện test.

## 5. DELIVERABLES CUỐI CÙNG 

| # | Deliverable | Định dạng |
|---|---|---|
| 1 | Issue Log (có filter theo mức độ) | Excel / Google Sheet |
| 2 | Test Summary Report tổng quan | Markdown / PDF / Google Docs |
| 3 | Thư mục ảnh/video đính kèm | Google Drive / thư mục ZIP |