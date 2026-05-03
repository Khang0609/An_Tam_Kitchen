# HƯỚNG DẪN KIỂM THỬ PHÂN QUYỀN USER 

Mục tiêu: Đảm bảo hệ thống nhận diện đúng người dùng, cho phép họ làm những gì được phép và ngăn chặn những gì không được phép.

---

## 1. CHECKLIST KIỂM TRA

### A. VÒNG ĐỜI TÀI KHOẢN (AUTHENTICATION)

Thực hiện lần lượt trên giao diện web, ưu tiên cả mobile view và desktop view.

| # | Kiểm tra gì | Cách làm chung |
|---|---|---|
| 1 | **Đăng ký thành công** | Nhập thông tin hợp lệ vào form đăng ký. Kiểm tra: có chuyển hướng sang login hoặc tự động đăng nhập không? Có gửi email xác nhận không (nếu có)? |
| 2 | **Đăng ký thất bại (email trùng)** | Dùng lại email đã đăng ký. Hệ thống phải báo lỗi rõ ràng, không tạo tài khoản mới. |
| 3 | **Đăng ký thất bại (thiếu trường, sai định dạng)** | Bỏ trống các trường bắt buộc, nhập email không đúng format, mật khẩu quá ngắn… Hệ thống phải cảnh báo ngay tại field. |
| 4 | **Đăng nhập đúng** | Nhập đúng email/password. Chuyển hướng đến trang chính (dashboard). Xem thử cookie/localStorage có lưu token/session không (dùng devtools). |
| 5 | **Đăng nhập sai mật khẩu** | Nhập email đúng, mật khẩu sai. Báo lỗi chung chung (không tiết lộ email tồn tại hay không). |
| 6 | **Đăng nhập sai nhiều lần** | Nhập sai liên tục 5–10 lần. Hệ thống có khóa tạm thời, yêu cầu CAPTCHA, hay giới hạn tốc độ không? (nếu có) |
| 7 | **Đăng xuất** | Bấm nút logout, sau đó thử truy cập một URL yêu cầu đăng nhập. Phải bị đẩy về login. |
| 8 | **Quên mật khẩu** (nếu có) | Nhập email có trong hệ thống, kiểm tra email reset. Link reset phải có hiệu lực một lần và hết hạn sau thời gian nhất định. |
| 9 | **Đổi mật khẩu** (khi đã đăng nhập) | Đổi mật khẩu thành công, sau đó logout và login bằng mật khẩu mới. Mật khẩu cũ không còn dùng được. |

### B. PHÂN QUYỀN DỮ LIỆU (AUTHORIZATION)

Tester cần ít nhất 2 tài khoản (ví dụ **User A** và **User B**) để kiểm tra sự cô lập dữ liệu.

| # | Kiểm tra gì | Cách làm chung |
|---|---|---|
| 10 | **Chỉ xem dữ liệu của chính mình** | Đăng nhập User A, tạo mới một vài item (sản phẩm, giao dịch... tùy app). Đăng xuất, đăng nhập User B. Kiểm tra danh sách của B không chứa item của A. |
| 11 | **Không truy cập trực tiếp item của người khác qua URL** | Khi đang là User B, thử sửa URL trên trình duyệt để truy cập item của A (nếu biết ID). Hệ thống phải trả về trang "Không tìm thấy" hoặc "Không có quyền", không hiển thị dữ liệu. |
| 12 | **Không sửa/xóa item của người khác qua UI** | Tương tự, cố tình gửi yêu cầu sửa (ví dụ nhấn nút Edit nếu nó vô tình hiển thị, hoặc gọi API qua devtools console). Phải bị chặn. |
| 13 | **Phân quyền theo vai trò** (nếu có admin/user) | Đăng nhập user thường, thử gõ URL của trang admin. Phải bị chặn. Admin thì có quyền xem tổng quan nhưng lưu ý admin có thể xem dữ liệu của user khác hay không (tùy đặc tả). |
| 14 | **Tính năng chỉ khả dụng khi đã đăng nhập** | Khi chưa đăng nhập, tất cả các button "Thêm mới", "Chỉnh sửa", "Xóa" hoặc link đến khu vực cá nhân đều không hiển thị hoặc bấm vào sẽ chuyển đến login. |

### C. SESSION & BẢO MẬT CƠ BẢN

| # | Kiểm tra gì | Cách làm chung |
|---|---|---|
| 15 | **Session tồn tại sau khi tắt tab?** | Đăng nhập, tắt tab (không tắt trình duyệt), mở tab mới vào web. Nếu session còn dùng được thì phải giữ đăng nhập, nếu không sẽ phải đăng nhập lại. Xác định behavior đúng. |
| 16 | **Session hết hạn** | Đăng nhập, để yên quá thời gian hết hạn (hỏi dev), sau đó thực hiện một hành động. Phải bị đá ra login. |
| 17 | **Không thể quay lại trang đã đăng xuất** | Sau khi logout, bấm nút Back của trình duyệt. Không được hiển thị nội dung của phiên trước. |
| 18 | **Thông tin nhạy cảm không lộ trên URL** | Kiểm tra các URL khi đang thao tác không chứa token, mật khẩu, session ID… |
| 19 | **HTTPS** | Bắt buộc truy cập qua HTTPS. Nếu gõ HTTP, trình duyệt phải tự chuyển thành HTTPS (nếu có cấu hình). |
| 20 | **Tương thích mobile/tablet** | Làm lại các test case trên với chế độ responsive hoặc thiết bị thật, đảm bảo giao diện không vỡ, nút bấm dễ thao tác. |

> **Lưu ý:** Khi test, nếu phát hiện bất kỳ hành vi nào **không giống kỳ vọng**, đó là bug. Kỳ vọng thường là: "user chỉ làm được những gì thuộc về họ, mọi hành vi vượt quyền đều bị chặn với thông báo phù hợp".

---

## 2. DELIVERABLES – MẪU BÁO CÁO KIỂM THỬ PHÂN QUYỀN

Sau khi test xong toàn bộ checklist, tester tổng hợp thành 2 tài liệu bàn giao.

### 2.1. Kết quả Test (Test Summary)

File: `Auth_Test_Summary_v1.xlsx` hoặc Google Sheet.

**Cấu trúc bảng:**

| ID | Mục kiểm tra | Pass/Fail | Ghi chú / Bug ID |
|----|---|---|---|
| 1 | Đăng ký thành công | Pass | |
| 2 | Email trùng báo lỗi | Pass | |
| 3 | Đăng nhập sai 5 lần không khóa | Fail | Bug #12 (Không có giới hạn) |
| … | … | … | … |

Cuối bảng thống kê: Tổng số test case, Pass, Fail, Blocked (nếu không test được). Đánh giá chung về mức độ an toàn của phân quyền.

### 2.2. Báo cáo lỗi chi tiết (Bug Reports)

Với mỗi lỗi phát hiện, tạo một issue (GitHub Issues) hoặc dòng riêng trong sheet.

**Template Bug Report:**

```
Tiêu đề: [Chức năng] Mô tả ngắn gọn lỗi

Mức độ nghiêm trọng: (S1 - Critical / S2 - Major / S3 - Minor / S4 - Trivial)
Ưu tiên:             (P1 - Cao / P2 - Trung bình / P3 - Thấp)

Môi trường:
- Trình duyệt:        Chrome 120 trên Windows 11
- Kích thước màn hình: 375×812 (iPhone X)
- URL:                https://staging.example.com/products/123
- Tài khoản test:     userb@test.com

Các bước để tái hiện:
1. Đăng nhập bằng user A, tạo sản phẩm "X"
2. Đăng xuất, đăng nhập bằng user B
3. Truy cập trực tiếp URL của sản phẩm "X" (biết ID)
4. Quan sát

Kết quả thực tế:
Hiển thị trang chi tiết sản phẩm "X" với đầy đủ thông tin.

Kết quả mong đợi:
Hiển thị thông báo "Bạn không có quyền truy cập" hoặc chuyển hướng về trang chủ.

Bằng chứng đính kèm:
[Ảnh chụp màn hình / video gif]
```

---

## 3. CÁCH TỔ CHỨC CÔNG VIỆC CHO TESTER

1. Mở checklist ở trên, dành **1–2 buổi** chạy qua toàn bộ các mục trên môi trường staging.
2. Mỗi mục test xong ghi lại kết quả vào sheet **Test Summary**.
3. Khi phát hiện lỗi, ghi luôn **Bug Report** vào GitHub Issues (gắn nhãn `bug`, `security` nếu liên quan bảo mật).
4. Cuối đợt, gửi link sheet + list issues cho manager và đội dev.
