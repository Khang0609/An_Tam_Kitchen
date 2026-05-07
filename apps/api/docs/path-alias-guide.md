# Hướng dẫn cấu hình Path Alias cho Node.js trên Vercel (Monorepo)

Khi phát triển dự án Node.js/TypeScript, việc sử dụng Path Alias (ví dụ: `@/controllers/user`) giúp code sạch hơn. Tuy nhiên, khi deploy lên Vercel hoặc chạy môi trường Node.js thuần, bạn thường gặp lỗi `Cannot find module '@/...'`. Tài liệu này tổng hợp các giải pháp từ đơn giản đến chuyên sâu.

---

## 1. Tại sao lại xảy ra lỗi?

### Bản chất của TypeScript
TypeScript là một ngôn ngữ "biên dịch" (transpiled language). Khi bạn viết code:
```typescript
import { userController } from '@/controllers/user';
```
Trình biên dịch `tsc` mặc định sẽ **không** thay đổi chuỗi `@/controllers/user` thành đường dẫn tương đối (như `../controllers/user`). Nó giữ nguyên alias đó trong file `.js` kết quả.

### Bản chất của Node.js
Node.js không biết `tsconfig.json` là gì. Khi nó thấy `@/`, nó coi đó là một package trong `node_modules`. Vì bạn không có package nào tên là `@`, Node.js sẽ quăng lỗi `Module Not Found`.

---

## 2. Giải pháp 1: Dùng đường dẫn tương đối (An toàn nhất)

Đây là cách đơn giản và bền bỉ nhất cho Backend.

- **Ưu điểm**: Không cần cấu hình build, chạy được ở mọi nơi, hiệu năng runtime cao nhất.
- **Nhược điểm**: Code nhìn hơi rối với các chuỗi `../../`.

**Cách làm**: Thay thế toàn bộ alias bằng đường dẫn thực tế.
```typescript
// Thay vì:
import { auth } from '@/middleware/auth';
// Hãy dùng:
import { auth } from '../middleware/auth';
```

---

## 3. Giải pháp 2: Sử dụng `tsc-alias` (Dành cho Build-time)

Nếu bạn muốn giữ alias nhưng muốn file `.js` sau cùng phải sạch lỗi.

**Cách làm**:
1. Cài đặt: `npm install -D tsc-alias`
2. Cập nhật `package.json`:
```json
"scripts": {
  "build": "tsc && tsc-alias"
}
```
`tsc-alias` sẽ quét thư mục `dist/` sau khi build và thay thế tất cả `@/` thành đường dẫn tương đối thực tế.

---

## 4. Giải pháp 3: Cấu hình cho Vercel Zero Config (Monorepo)

Trong cấu trúc Monorepo (như Turborepo), Vercel thường dùng `esbuild` để đóng gói API. Nếu file chạy (`api/index.ts`) nằm ngoài thư mục nguồn (`src/`), bạn cần sửa `tsconfig.json`.

**Cấu hình chuẩn trong `apps/api/tsconfig.json`**:
```json
{
  "compilerOptions": {
    "baseUrl": ".", 
    "paths": {
      "@/*": ["src/*"]
    },
    "rootDir": "." // Cực kỳ quan trọng: Để TSC nhận diện cả file ngoài src
  },
  "include": ["src/**/*", "api/**/*"] 
}
```

---

## 5. Giải pháp 4: Sử dụng `module-alias` (Dành cho Runtime)

Nếu bạn chạy trực tiếp bằng `node` mà không muốn build phức tạp.

**Cách làm**:
1. Cài đặt: `npm install module-alias`
2. Thêm vào đầu file entrypoint (`index.ts`):
```typescript
import 'module-alias/register';
```
3. Cấu hình trong `package.json`:
```json
"_moduleAliases": {
  "@": "dist/src"
}
```

---

## 6. Lời khuyên lựa chọn

| Tình huống | Giải pháp khuyên dùng |
| :--- | :--- |
| Dự án Startup, cần nhanh, ổn định | **Giải pháp 1** (Relative Path) |
| Dự án lớn, cấu trúc thư mục sâu | **Giải pháp 2** (tsc-alias) |
| Deploy lên Vercel Serverless | **Giải pháp 3** (Cấu hình rootDir) |

> [!IMPORTANT]
> Trong môi trường Backend, sự ổn định quan trọng hơn vẻ đẹp của mã nguồn. Nếu cấu hình Alias quá phức tạp khiến team tốn nhiều giờ debug môi trường, hãy cân nhắc quay lại đường dẫn tương đối.
