# FUTURE PLAN - Kế hoạch phát triển & Xử lý nợ kỹ thuật (Technical Debt)

Tài liệu này liệt kê các vấn đề kỹ thuật tiềm ẩn và lộ trình nâng cấp hệ thống để đáp ứng quy mô hàng triệu người dùng.

## 1. Issue: Tối ưu hóa Quản lý State với Zustand
- **Hiện trạng:** Thư viện `zustand` đã được cài đặt nhưng chưa được sử dụng thực tế.
- **Phân tích (Quy mô triệu người dùng):** 
    - Với quy mô lớn, việc lạm dụng Global State sẽ dẫn đến khó khăn trong việc debug và làm giảm hiệu năng nếu không được phân tách (slice) hợp lý.
    - Zustand rất nhẹ, nhưng cần một kiến trúc rõ ràng để tránh biến thành "God Store".
- **Giải pháp đề xuất:**
    - Triển khai **Slices Pattern** để chia nhỏ store theo từng domain (auth, inventory, settings).
    - Thiết lập quy tắc: Chỉ đưa vào Zustand các dữ liệu thực sự cần chia sẻ giữa nhiều component không có quan hệ cha-con (ví dụ: thông tin user, trạng thái đóng mở sidebar). Các dữ liệu UI đơn giản nên giữ ở `useState` cục bộ.
- **Độ ưu tiên:** Trung bình.

## 2. Issue: Nâng cấp Cơ chế Data Fetching (TanStack Query)
- **Hiện trạng:** Đang dùng hàm `fetch` cơ bản của Next.js trong Server Components.
- **Phân tích:** 
    - `fetch` cơ bản thiếu các tính năng quan trọng như: Tự động retry khi lỗi, caching nâng cao (Stale-While-Revalidate), Optimistic Updates (cập nhật UI ngay lập tức trước khi server phản hồi), và quản lý trạng thái loading/error đồng nhất.
    - Khi app phức tạp, việc đồng bộ dữ liệu giữa các trang sẽ trở thành cực hình.
- **Giải pháp đề xuất:**
    - Tích hợp **TanStack Query (React Query)** làm lớp trung gian.
    - Sử dụng Server Components để fetch dữ liệu lần đầu (Prefetching) và dùng React Query để quản lý các tương tác phía Client (Mutation, Revalidation).
- **Độ ưu tiên:** Cao.

## 3. Issue: Khắc phục giới hạn của Prisma & PostgreSQL ở quy mô 100k+ CCU
- **Hiện trạng:** Sử dụng Prisma + PostgreSQL truyền thống.
- **Phân tích:**
    - **Connection Exhaustion:** Prisma tạo ra nhiều kết nối đến DB, 100k người dùng cùng lúc sẽ làm sập PostgreSQL do vượt quá `max_connections`.
    - **Performance Overhead:** Prisma abstraction có thể tạo ra các câu lệnh SQL không tối ưu trong các trường hợp phức tạp.
- **Giải pháp đề xuất:**
    - **Ngắn hạn:** Sử dụng **PgBouncer** hoặc giải pháp Connection Pooling như **Supabase Connection Pooler** (nếu dùng cloud) / **Prisma Accelerate**.
    - **Trung hạn:** Triển khai **Read Replicas** để tách biệt luồng Đọc và Ghi.
    - **Dài hạn (Nếu Prisma quá chậm):** Chuyển các "Hot Paths" (các query chạy cực nhiều) sang **Drizzle ORM** hoặc Raw SQL để giảm thiểu overhead và kiểm soát SQL tốt hơn.
- **Độ ưu tiên:** Cao (khi bắt đầu scale).

## 4. Issue: Cơ chế Versioning cho Shared Types (Contract Safety)
- **Hiện trạng:** Một gói `@repo/types` dùng chung cho toàn bộ monorepo.
- **Phân tích:** 
    - Chỉ cần một thay đổi nhỏ (Breaking Change) trong `packages/types` sẽ bắt buộc cả API và Web phải build lại và deploy cùng lúc. Nếu API deploy trước mà Web chưa kịp cập nhật, hệ thống sẽ crash cho hàng triệu người dùng.
- **Giải pháp đề xuất:**
    - Triển khai **Internal Versioning** cho các Schema. Ví dụ: `UserSchema_v1`, `UserSchema_v2`.
    - Backend phải hỗ trợ cả 2 phiên bản trong giai đoạn chuyển đổi (Backward Compatibility).
    - Tích hợp **Contract Testing** (như Pact) vào CI/CD để đảm bảo thay đổi ở API không làm hỏng Frontend.
- **Độ ưu tiên:** Cao.


## 5. Issue: [Logic-Refactor] Implement Unified Expiry Calculation Logic
- **Hiện trạng:** Logic tính toán ngày hết hạn cũ hiện chỉ dựa trên `openedDate`.
- **Phân tích:** 
    - Công thức cũ không so sánh với hạn gốc của sản phẩm, dẫn đến việc `RemainingDays` có thể sai lệch nếu hạn gốc ngắn hơn hạn sau khi mở nắp.
- **Giải pháp đề xuất:**
    - Triển khai công thức: $RemainingDays = \min(ExpiryDate - Today, OpenDate + DaysAfterOpen - Today)$.
    - Đảm bảo dữ liệu phản ánh chính xác thực tế bảo quản của từng loại thực phẩm.
- **Độ ưu tiên:** Rất Cao.

## 6. Issue: [Database-Fix] Align Schema DateTime Types & Data Access Layer
- **Hiện trạng:** Các trường DateTime trong Prisma đang không đồng bộ hoặc bị lưu sai định dạng giữa Local và UTC.
- **Phân tích:** 
    - Sai lệch múi giờ dẫn đến việc tính toán logic ở các tầng trên bị sai lệch hoàn toàn (ví dụ: bị cộng dồn +7 hoặc về 00:00:00 sai ngày).
- **Giải pháp đề xuất:**
    - **Schema Audit:** Sử dụng nhất quán `Timestamptz` trong `schema.prisma`.
    - **Prisma Client Extension:** Tự động chuẩn hóa dữ liệu Date về UTC trước khi ghi vào DB.
    - **Data Migration:** Viết script clean lại các bản ghi cũ bị sai múi giờ.
    - **Repository Layer:** Ép kiểu và chuẩn hóa đầu ra đồng nhất cho cả API và Worker.
- **Độ ưu tiên:** Khẩn cấp (Critical).

## 7. Issue: [Feature-Data] Build Mock Product Seed & Search API
- **Hiện trạng:** Chưa có kho dữ liệu sản phẩm mẫu (Global Products).
- **Phân tích:** 
    - Người dùng phải nhập liệu thủ công hoàn toàn, làm giảm trải nghiệm và tính tiện dụng của ứng dụng.
- **Giải pháp đề xuất:**
    - Xây dựng kho dữ liệu mẫu cho các nhóm thực phẩm thiết yếu.
    - Tạo API Search hỗ trợ tính năng tự động điền (Auto-fill) khi người dùng nhập liệu.
- **Độ ưu tiên:** Trung bình.

## 8. Issue: [Feature-Notify] Internal Food Expiry Notification Engine
- **Hiện trạng:** Đã có bảng `FoodNotification` nhưng chưa có logic quét tự động.
- **Phân tích:** 
    - Cần một cơ chế tự động nhắc nhở người dùng khi thực phẩm sắp hết hạn mà không cần họ phải mở app kiểm tra thường xuyên.
- **Giải pháp đề xuất:**
    - Xây dựng Service tự động quét Inventory định kỳ.
    - Tự động tạo thông báo cho các sản phẩm ở trạng thái Cảnh báo (Yellow) và Nguy hiểm (Red).
- **Độ ưu tiên:** Cao.

## 9. Issue: [UI/UX-Enhancement] Dynamic Inventory Prioritization & Sorting
- **Hiện trạng:** Danh sách thực phẩm chưa được sắp xếp tối ưu theo mức độ ưu tiên sử dụng.
- **Phân tích:** 
    - Giao diện hiện tại chưa giúp người dùng nhận diện nhanh món nào cần ưu tiên dùng trước.
- **Giải pháp đề xuất:**
    - Tái cấu trúc giao diện, sắp xếp theo thứ tự màu sắc (Red -> Yellow -> Green).
    - Thêm Badge hiển thị số ngày còn lại trực quan để người dùng dễ dàng theo dõi.
- **Độ ưu tiên:** Cao.

## 10. Issue: [Feature-Shared] Tủ lạnh gia đình (Household)
- **Hiện trạng:** Hệ thống hiện tại đang hoạt động theo mô hình cá nhân hóa (Isolated), mỗi người dùng một tủ lạnh riêng.
- **Phân tích:** 
    - Đây là tính năng cho phép các thành viên trong gia đình cùng quản lý thực phẩm chung. 
    - Tuy nhiên, để đảm bảo tính ổn định, cần ưu tiên hoàn thiện lõi (Core) cho cá nhân chạy mượt mà trước khi triển khai cơ chế chia sẻ.
- **Giải pháp đề xuất:**
    - Đưa tính năng này vào `BACKLOG.md` để theo dõi.
    - Chỉ bắt đầu nghiên cứu và triển khai sau khi các tính năng cốt lõi đã đạt trạng thái ổn định (Stable).
- **Độ ưu tiên:** Thấp (Backlog - Nice to have).

## 11. Issue: [Docs-Config] Hướng dẫn thiết lập biến môi trường (.env)
- **Hiện trạng:** Chưa có tài liệu hướng dẫn chi tiết cách tạo và cấu hình các tệp `.env` cho từng service (Web, API, Database).
- **Phân tích:** Việc thiếu hướng dẫn làm tăng rào cản cho người mới tham gia dự án hoặc khi cần triển khai trên môi trường mới. Mỗi service đều cần các biến quan trọng như `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`.
- **Giải pháp đề xuất:** 
    - Xây dựng tài liệu hướng dẫn thiết lập môi trường chi tiết.
    - Liệt kê đầy đủ các biến bắt buộc, ý nghĩa của chúng và cung cấp các giá trị mẫu an toàn trong các file `.env.example`.
- **Độ ưu tiên:** Cao.

## 12. Issue: [Docs-Branding] Tái cấu trúc README.md & Hệ thống tài liệu hướng dẫn
- **Hiện trạng:** `README.md` hiện tại đang trộn lẫn giữa giới thiệu dự án và hướng dẫn kỹ thuật chi tiết, làm giảm tính chuyên nghiệp và khó nắm bắt tầm nhìn dự án.
- **Phân tích:** Một tệp `README.md` premium cần tập trung vào việc "WOW" người xem bằng hình ảnh, tính năng nổi bật và công nghệ sử dụng. Các chi tiết cài đặt rườm rà nên được tách riêng.
- **Giải pháp đề xuất:**
    - Viết lại `README.md` tập trung vào thương hiệu Bếp An Tâm, tính năng và Tech Stack.
    - Di chuyển toàn bộ phần hướng dẫn cài đặt, sử dụng và vận hành sang một file riêng (ví dụ: `GETTING_STARTED.md` hoặc `docs/`).
- **Độ ưu tiên:** Trung bình.

## 13. Issue: [DevOps-Versioning] Centralized Version Pinning (Root Lock)
- **Hiện trạng:** Các package trong monorepo có thể đang sử dụng các phiên bản khác nhau của cùng một thư viện (ví dụ: package A dùng v4, package B dùng v5).
- **Phân tích:** 
    - Việc không nhất quán phiên bản dẫn đến lỗi "Dependency Hell", tăng kích thước bundle không cần thiết và gây ra các hành vi khó lường khi chạy integration tests.
    - Cần một cơ chế để "khóa" hoặc ưu tiên một phiên bản duy nhất cho các thư viện cốt lõi ở cấp độ root.
- **Giải pháp đề xuất:**
    - Sử dụng tính năng **`pnpm.overrides`** hoặc **`resolutions`** trong `package.json` ở root để ép xung đột về một phiên bản ổn định nhất.
    - Thiết lập file cấu hình share version (nếu cần) để các package cùng tham chiếu.
- **Độ ưu tiên:** Khẩn cấp (Critical).

## 14. Issue: [Backend-Upgrade] Backend Dependency Optimization & Audit
- **Hiện trạng:** Các dependencies trong `apps/api` (backend) có thể chưa ở phiên bản tối ưu hoặc có các bản vá bảo mật/hiệu năng mới.
- **Phân tích:** 
    - Backend là lõi xử lý dữ liệu, cần sự ổn định và hiệu năng cao nhất.
    - Cần kiểm tra lại các thư viện như `express`, `prisma`, `zod`, `argon2` để đảm bảo chúng đang chạy bản stable tốt nhất, tương thích với Node.js 22+.
- **Giải pháp đề xuất:**
    - Thực hiện audit dependency (`pnpm audit`).
    - Nâng cấp các thư viện lên phiên bản stable mới nhất có hiệu năng tối ưu.
    - Kiểm tra tính tương thích của các `@types` đi kèm để tránh lỗi compile TypeScript.
- **Độ ưu tiên:** Khẩn cấp (Critical).

---

*Người lập kế hoạch: Antigravity AI*
*Người đọc và kiểm tra 1: Trần Nguyên Khang - Duyệt*
*Ngày tạo: 2026-05-09*
