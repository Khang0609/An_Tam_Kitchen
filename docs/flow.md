# An Tam Kitchen — Technical Flow (Barcode → Database → Dashboard)
**Chi tiết vận hành sản phẩm, end-to-end**

---

## 0. Tổng Quan Kiến Trúc Liên Quan Đến Flow

```
apps/web (Next.js 15)
  └── Scan UI, Confirmation UI, Dashboard UI

apps/api (Express.js)
  └── /products/lookup
  └── /items (CRUD)
  └── /shelf-life/resolve

packages/database (Prisma + PostgreSQL)
  └── Product cache
  └── ShelfLifeEntry (knowledge database)
  └── FridgeItem (user data)
  └── UsageEvent (feedback loop)
```

Toàn bộ flow đi qua 3 layer chính: **Product Resolution Layer** (biết sản phẩm là gì), **Knowledge Layer** (biết shelf life sau mở), **User Item Layer** (lưu trữ và tính toán cho từng item của user).

---

## 1. SCAN — Client-Side

### 1.1 Input

User mở camera trong app (dùng `react-zxing` hoặc `html5-qrcode` cho web/PWA). Camera đọc mã EAN-13 — chuẩn barcode phổ biến nhất trên sản phẩm bán lẻ tại Việt Nam, theo GS1 Vietnam.

Output của bước scan là một chuỗi GTIN, ví dụ:

```
8934673123456
```

### 1.2 Validation Cơ Bản

Trước khi gọi API, validate format: đúng 13 số (EAN-13) hoặc 8 số (EAN-8, ít phổ biến hơn). Nếu camera đọc lỗi (sai checksum digit), reject và yêu cầu scan lại — không gửi request rác lên server.

### 1.3 Gọi API

```
POST /api/products/lookup
Body: { "gtin": "8934673123456" }
```

---

## 2. PRODUCT RESOLUTION — Server-Side

Đây là chuỗi fallback lookup. Mục tiêu: từ GTIN → tên sản phẩm + category gợi ý.

### 2.1 Bậc 1 — Internal Cache (PostgreSQL)

```sql
SELECT * FROM products WHERE gtin = '8934673123456';
```

Nếu sản phẩm này đã từng được resolve bởi bất kỳ user nào trước đó (lưu trong bảng `products`), trả về ngay — nhanh nhất, không tốn external API call.

**Schema bảng `products`:**

```prisma
model Product {
  id           String   @id @default(cuid())
  gtin         String   @unique
  name         String
  nameVi       String?  // tên tiếng Việt, có thể được user edit
  brand        String?
  imageUrl     String?
  categoryId   String?  // FK -> ShelfLifeCategory
  source       String   // "internal" | "off" | "icheck" | "manual"
  resolvedAt   DateTime @default(now())
  category     ShelfLifeCategory? @relation(fields: [categoryId], references: [id])
}
```

### 2.2 Bậc 2 — Open Food Facts API

Nếu cache miss, gọi:

```
GET https://world.openfoodfacts.org/api/v2/product/8934673123456.json
```

Response trả về (nếu có) `product_name`, `brands`, `categories_tags`, `image_url`. Open Food Facts có coverage tốt cho sản phẩm quốc tế (Coca-Cola, Nestlé...) nhưng sparse cho sản phẩm thuần Việt (Chin-su, Cholimex, Vinamilk các dòng nội địa).

### 2.3 Bậc 3 — VN Local Lookup (iCheck / VNPT CheckVN)

Nếu Open Food Facts không có hoặc không có category đủ rõ:

```
GET https://api.icheck.com.vn/product/{gtin}
```

iCheck có database lớn hơn cho sản phẩm Việt Nam vì được build từ chính nhu cầu chống hàng giả tại VN.

### 2.4 Bậc 4 — Manual Entry (Fallback Cuối)

Nếu cả 3 nguồn đều miss, trả về:

```json
{
  "resolved": false,
  "gtin": "8934673123456"
}
```

Client hiện form: tên sản phẩm (text input), category (dropdown 12 nhóm cấp 1). User nhập, hệ thống lưu vào `products` với `source: "manual"`.

### 2.5 Output Của Product Resolution

```json
{
  "resolved": true,
  "gtin": "8934673123456",
  "name": "Nước mắm Nam Ngư 750ml",
  "brand": "Masan",
  "imageUrl": "https://...",
  "category": {
    "id": "cat_nuoc_mam_pha_san",
    "name": "Nước mắm pha sẵn",
    "parentCategory": "Nước chấm"
  },
  "source": "icheck"
}
```

---

## 3. CATEGORY RESOLUTION — Mapping Sang Shelf Life Taxonomy

Đây là bước cầu nối giữa "sản phẩm là gì" và "sản phẩm này sống được bao lâu sau khi mở". Category trả về từ Open Food Facts/iCheck thường KHÔNG match trực tiếp với taxonomy nội bộ — cần một mapping layer.

### 3.1 Vietnamese Shelf Life Taxonomy (Cấp 1 — 12 nhóm)

```
1. Nước chấm & gia vị lỏng
2. Sữa & sản phẩm từ sữa
3. Thịt & hải sản tươi/đông lạnh
4. Thực phẩm chế biến sẵn (xúc xích, chả, giò)
5. Rau củ quả tươi
6. Trái cây tươi
7. Đồ uống đóng hộp/chai (đã mở)
8. Đồ khô & ngũ cốc (đã mở)
9. Bánh kẹo & snack (đã mở)
10. Đồ ăn nấu sẵn / leftovers
11. Trứng
12. Sốt & topping (mayonnaise, ketchup, bơ đậu phộng...)
```

### 3.2 Mapping Logic

```typescript
function resolveCategoryFromExternal(
  externalCategoryTags: string[],
  productName: string
): ShelfLifeCategoryId | null {

  // Bước 1: rule-based keyword matching trên tên sản phẩm
  const nameLower = productName.toLowerCase();
  if (/nước mắm/.test(nameLower)) {
    if (/pha sẵn|chua ngọt/.test(nameLower)) return "nuoc_mam_pha_san";
    return "nuoc_mam_nguyen_chat";
  }
  if (/tương ớt/.test(nameLower)) return "tuong_ot";
  if (/sữa chua/.test(nameLower)) return "sua_chua";
  if (/sữa tươi|sữa thanh trùng/.test(nameLower)) return "sua_tuoi";
  // ... (danh sách rules mở rộng theo thời gian)

  // Bước 2: fallback - match qua external category tags
  const tagMap: Record<string, ShelfLifeCategoryId> = {
    "en:fish-sauces": "nuoc_mam_nguyen_chat",
    "en:yogurts": "sua_chua",
    "en:condiments": "sot_topping",
    // ...
  };
  for (const tag of externalCategoryTags) {
    if (tagMap[tag]) return tagMap[tag];
  }

  // Bước 3: không resolve được
  return null;
}
```

### 3.3 Khi Không Resolve Được

Trả về `category: null`. Client hiện picker:

> "Sản phẩm này thuộc loại nào?"
> [12 category cấp 1, dạng grid icon]

User chọn → ghi vào bảng `products.categoryId` để lần sau không cần hỏi lại (self-improving cache).

---

## 4. KNOWLEDGE LAYER — Shelf Life Database

### 4.1 Schema

```prisma
model ShelfLifeCategory {
  id          String @id  // "nuoc_mam_pha_san"
  nameVi      String      // "Nước mắm pha sẵn"
  parentGroup String      // "Nước chấm & gia vị lỏng"
  entries     ShelfLifeEntry[]
}

model ShelfLifeEntry {
  id              String   @id @default(cuid())
  categoryId      String
  storageLocation StorageLocation // ENUM: FRIDGE | FREEZER | ROOM_TEMP
  minDays         Int
  typicalDays     Int
  maxDays         Int
  qualitySignal   String   // "Màu sậm dần, mùi giảm nhẹ — vẫn dùng được"
  safetySignal    String   // "Có nấm mốc, mùi chua bất thường — bỏ ngay"
  sourceRef       String   // "FDA Cold Storage Chart" | "Manufacturer: Masan" | "Crowdsourced (n=42)"
  confidence      Float    // 0.0–1.0, tăng dần khi có crowdsource validation
  category        ShelfLifeCategory @relation(fields: [categoryId], references: [id])

  @@unique([categoryId, storageLocation])
}
```

### 4.2 Ví Dụ Data Thực Tế

```json
[
  {
    "categoryId": "nuoc_mam_nguyen_chat",
    "storageLocation": "FRIDGE",
    "minDays": 60, "typicalDays": 90, "maxDays": 180,
    "qualitySignal": "Màu sậm dần theo thời gian, vẫn dùng được",
    "safetySignal": "Nấm mốc trên miệng chai hoặc nắp — bỏ ngay",
    "sourceRef": "Manufacturer guideline (Phú Quốc/Masan) + FDA equivalent",
    "confidence": 0.7
  },
  {
    "categoryId": "sua_chua",
    "storageLocation": "FRIDGE",
    "minDays": 1, "typicalDays": 2, "maxDays": 4,
    "qualitySignal": "Tách nước, vị chua hơn — vẫn dùng được nếu không có mùi lạ",
    "safetySignal": "Mốc trên bề mặt, mùi cồn/men — bỏ ngay",
    "sourceRef": "FDA Cold Storage Chart",
    "confidence": 0.8
  },
  {
    "categoryId": "do_an_nau_san",
    "storageLocation": "FRIDGE",
    "minDays": 2, "typicalDays": 3, "maxDays": 4,
    "qualitySignal": "Khô hơn, mất mùi thơm",
    "safetySignal": "Mùi chua/lạ, nhớt — bỏ ngay, KHÔNG nếm thử",
    "sourceRef": "FoodSafety.gov leftovers guidance",
    "confidence": 0.9
  }
]
```

### 4.3 API Resolve

```
GET /api/shelf-life/resolve?categoryId=nuoc_mam_nguyen_chat&storage=FRIDGE
```

```json
{
  "categoryId": "nuoc_mam_nguyen_chat",
  "storageLocation": "FRIDGE",
  "typicalDays": 90,
  "minDays": 60,
  "maxDays": 180,
  "qualitySignal": "Màu sậm dần theo thời gian, vẫn dùng được",
  "safetySignal": "Nấm mốc trên miệng chai hoặc nắp — bỏ ngay",
  "confidence": 0.7
}
```

Nếu không có entry cho `(categoryId, storageLocation)` combination cụ thể (ví dụ user chọn FREEZER cho một category chỉ có data FRIDGE), trả về `null` và client xử lý theo case 4.4.

### 4.4 Trường Hợp Thiếu Data

```json
{ "resolved": false }
```

→ Client vẫn cho user lưu item, nhưng hiện note: *"Chưa có dữ liệu tham khảo cho cách bảo quản này — dựa vào ngày hết hạn in trên bao bì."* Item này được flag `hasShelfLifeData: false` để team biết cần bổ sung database entry này (ưu tiên hóa việc mở rộng knowledge base dựa trên gap thực tế từ usage).

---

## 5. USER CONFIRMATION — Client UI Flow

Màn hình confirm hiện sau khi product + category + shelf life đã resolve (hoặc fallback).

### 5.1 UI Components

```
┌─────────────────────────────────────┐
│ [Ảnh sản phẩm]  Nước mắm Nam Ngư 750ml│
│                  Nước chấm > Pha sẵn  │
├─────────────────────────────────────┤
│ Bảo quản ở đâu?                       │
│  ○ Tủ lạnh (ngăn mát)                 │
│  ○ Tủ đông                            │
│  ○ Nhiệt độ phòng                     │
├─────────────────────────────────────┤
│ Ngày mở:        [Hôm nay ▾]           │
│                  Hôm nay / Hôm qua /  │
│                  Chọn ngày khác       │
├─────────────────────────────────────┤
│ Ghi chú (tùy chọn): ____________      │
├─────────────────────────────────────┤
│         [ Lưu vào tủ lạnh ]           │
└─────────────────────────────────────┘
```

### 5.2 Logic Mặc Định Thông Minh

`storageLocation` default được suggest dựa trên category — ví dụ `sua_chua` default chọn sẵn "Tủ lạnh", `tuong_ot` default "Tủ lạnh" nhưng cho phép đổi sang "Nhiệt độ phòng" (một số gia đình để tương ớt ngoài).

`openingDate` default là hôm nay (timestamp tại thời điểm save).

### 5.3 Submit

```
POST /api/items
Body: {
  "productId": "prod_xxx",
  "categoryId": "nuoc_mam_pha_san",
  "storageLocation": "FRIDGE",
  "openingDate": "2026-06-14",
  "note": ""
}
```

---

## 6. PERSIST — FridgeItem Creation

### 6.1 Schema

```prisma
model FridgeItem {
  id              String   @id @default(cuid())
  userId          String
  productId       String
  categoryId      String
  storageLocation StorageLocation
  openingDate     DateTime
  shelfLifeDays   Int      // snapshot của typicalDays tại thời điểm tạo
  minDays         Int
  maxDays         Int
  note            String?
  status          ItemStatus @default(FRESH) // được tính lại mỗi lần query
  hasShelfLifeData Boolean
  createdAt       DateTime @default(now())
  resolvedAt      DateTime? // khi user mark "đã dùng hết" hoặc "đã bỏ"
  resolution      ResolutionType? // ENUM: CONSUMED | DISCARDED_EXPIRED | DISCARDED_SPOILED

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}

enum StorageLocation { FRIDGE FREEZER ROOM_TEMP }
enum ItemStatus { FRESH USE_SOON CHECK_BEFORE_USE NOT_RECOMMENDED }
enum ResolutionType { CONSUMED DISCARDED_EXPIRED DISCARDED_SPOILED }
```

**Lưu ý quan trọng:** `shelfLifeDays`, `minDays`, `maxDays` được **snapshot** vào lúc tạo item, không phải reference động đến `ShelfLifeEntry`. Lý do: nếu sau này knowledge database được update (ví dụ shelf life của `nuoc_mam_pha_san` được điều chỉnh từ 30 ngày → 25 ngày dựa trên crowdsource feedback), các item đã tồn tại trước đó không nên bị thay đổi retroactively — tránh confusing user ("hôm qua còn xanh, hôm nay tự nhiên đỏ mà mình không làm gì").

---

## 7. CALCULATION ENGINE — Chạy Mỗi Khi Dashboard Load

### 7.1 Input

Với mỗi `FridgeItem` chưa resolved (`resolvedAt IS NULL`):

```typescript
interface ItemCalcInput {
  openingDate: Date;
  shelfLifeDays: number; // typical
  minDays: number;
  maxDays: number;
}
```

### 7.2 Core Formula

```typescript
function calculateItemState(item: ItemCalcInput, today: Date) {
  const daysSinceOpening = differenceInDays(today, item.openingDate);
  const remainingDays = item.shelfLifeDays - daysSinceOpening;
  const urgencyScore = daysSinceOpening / item.shelfLifeDays;

  return { daysSinceOpening, remainingDays, urgencyScore };
}
```

### 7.3 Status Classification

```typescript
function classifyStatus(urgencyScore: number, categoryId: string): ItemStatus {
  // Threshold mặc định
  let thresholds = { useSoon: 0.5, checkBefore: 0.75, notRecommended: 1.0 };

  // Override theo category - leftovers cần cảnh báo sớm hơn vì rủi ro cao
  if (HIGH_RISK_CATEGORIES.includes(categoryId)) {
    thresholds = { useSoon: 0.4, checkBefore: 0.6, notRecommended: 0.85 };
  }

  if (urgencyScore < thresholds.useSoon) return "FRESH";
  if (urgencyScore < thresholds.checkBefore) return "USE_SOON";
  if (urgencyScore < thresholds.notRecommended) return "CHECK_BEFORE_USE";
  return "NOT_RECOMMENDED";
}

const HIGH_RISK_CATEGORIES = [
  "do_an_nau_san",      // leftovers
  "thit_hai_san_tuoi",  // thịt/hải sản tươi
  "sua_tuoi",           // sữa tươi
];
```

### 7.4 Ranking Cho Dashboard

```typescript
function rankItemsForDashboard(items: FridgeItemWithCalc[]): FridgeItemWithCalc[] {
  return items
    .filter(item => item.resolvedAt === null)
    .sort((a, b) => b.urgencyScore - a.urgencyScore);
}
```

Items với `urgencyScore` cao nhất (gần hết hoặc đã quá hạn) lên đầu danh sách.

---

## 8. DASHBOARD — Render

### 8.1 API Response

```
GET /api/dashboard
```

```json
{
  "summary": {
    "totalItems": 14,
    "useSoon": 3,
    "checkBeforeUse": 1,
    "notRecommended": 0,
    "fresh": 10
  },
  "items": [
    {
      "id": "item_xxx",
      "productName": "Sữa chua Vinamilk",
      "imageUrl": "https://...",
      "status": "CHECK_BEFORE_USE",
      "daysSinceOpening": 2,
      "remainingDays": 0,
      "storageLocation": "FRIDGE",
      "qualitySignal": "Tách nước, vị chua hơn — vẫn dùng được nếu không có mùi lạ",
      "safetySignal": "Mốc trên bề mặt, mùi cồn — bỏ ngay"
    },
    {
      "id": "item_yyy",
      "productName": "Nước mắm Nam Ngư",
      "status": "FRESH",
      "daysSinceOpening": 8,
      "remainingDays": 22,
      "storageLocation": "FRIDGE"
    }
  ]
}
```

### 8.2 UI Layout

```
┌─────────────────────────────────────────┐
│  Tủ Lạnh Của Bạn                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐             │
│  │ 14 │ │ 3  │ │ 1  │ │ 10 │             │
│  │Tổng│ │Sớm │ │Check│ │Tốt │             │
│  └────┘ └────┘ └────┘ └────┘             │
├─────────────────────────────────────────┤
│  Hôm nay nên dùng:                        │
│                                            │
│  🟠 Sữa chua Vinamilk                     │
│     Mở 2 ngày trước — nên dùng hôm nay    │
│                                            │
│  🟡 Thịt heo (đông lạnh đã rã)            │
│     Mở 3 ngày trước — còn ~1 ngày         │
│                                            │
│  🟢 Nước mắm Nam Ngư                      │
│     Mở 8 ngày trước — còn ~22 ngày        │
│  ...                                       │
└─────────────────────────────────────────┘
```

Filter theo `storageLocation` (tab: Tất cả / Ngăn mát / Ngăn đông / Nhiệt độ phòng) cho phép user xem riêng từng khu vực.

---

## 9. RESOLUTION & FEEDBACK LOOP

### 9.1 User Resolve Item

Khi user dùng hết hoặc bỏ một item, swipe action trên item card:

```
POST /api/items/{id}/resolve
Body: { "resolution": "CONSUMED" | "DISCARDED_EXPIRED" | "DISCARDED_SPOILED" }
```

Server set `resolvedAt = now()`, `resolution = <value>`, và ghi một `UsageEvent`.

### 9.2 UsageEvent — Data Cho Calibration Database

```prisma
model UsageEvent {
  id              String   @id @default(cuid())
  itemId          String
  categoryId      String
  storageLocation StorageLocation
  shelfLifeDaysAtCreation Int  // snapshot typicalDays lúc tạo
  actualDaysUsed  Int          // = resolvedAt - openingDate
  resolution      ResolutionType
  createdAt       DateTime @default(now())
}
```

### 9.3 Calibration Job (Background, Periodic)

Chạy hàng tuần/tháng, aggregate `UsageEvent` theo `(categoryId, storageLocation)`:

```typescript
async function calibrateShelfLifeEntries() {
  const grouped = await db.usageEvent.groupBy({
    by: ["categoryId", "storageLocation"],
    _avg: { actualDaysUsed: true },
    _count: true,
    where: { resolution: "DISCARDED_SPOILED" }, // chỉ tính case "bỏ vì hỏng"
  });

  for (const group of grouped) {
    if (group._count < 30) continue; // cần đủ sample size

    const entry = await db.shelfLifeEntry.findUnique({
      where: { categoryId_storageLocation: { categoryId: group.categoryId, storageLocation: group.storageLocation } }
    });

    // Nếu actualDaysUsed trung bình lệch >20% so với typicalDays hiện tại
    // → flag cho team review, KHÔNG auto-update (cần human-in-the-loop
    //    vì đây là safety-related data)
    const deviation = Math.abs(group._avg.actualDaysUsed - entry.typicalDays) / entry.typicalDays;
    if (deviation > 0.2) {
      await flagForReview(entry.id, group._avg.actualDaysUsed, group._count);
    }
  }
}
```

**Lý do KHÔNG auto-update:** đây là food safety-adjacent data. Mọi thay đổi đến từ crowdsource data cần được human review trước khi đẩy vào production database — tránh trường hợp một outlier (vài user discard sớm vì lý do cá nhân không liên quan đến shelf life thực) làm lệch database.

---

## 10. EDGE CASES — Chi Tiết Xử Lý

### 10.1 Sản phẩm không có barcode (rau củ, đồ chợ)

```
POST /api/items
Body: {
  "productId": null,
  "manualProductName": "Rau muống",
  "categoryId": "rau_cu_qua_tuoi",
  "storageLocation": "FRIDGE",
  "openingDate": "2026-06-14"
}
```

Flow giống bước 5 nhưng skip toàn bộ bước 1–3 (scan + resolution). User vào trực tiếp category picker.

### 10.2 Một sản phẩm, nhiều item (mở 2 hộp sữa chua cùng lúc)

Mỗi lần scan + confirm tạo một `FridgeItem` riêng (có `id` riêng), dù cùng `productId`. Dashboard hiển thị riêng từng item — vì có thể mở ở 2 ngày khác nhau.

### 10.3 User mở app sau nhiều ngày không dùng

Không có vấn đề kỹ thuật — `daysSinceOpening` được tính real-time mỗi lần dashboard load dựa trên `openingDate` đã lưu, không cần background job liên tục update status.

### 10.4 Thay đổi storage location sau khi tạo (chuyển từ ngăn mát sang ngăn đông)

```
PATCH /api/items/{id}
Body: { "storageLocation": "FREEZER" }
```

Server re-resolve shelf life entry cho `(categoryId, FREEZER)`, update snapshot `shelfLifeDays/minDays/maxDays` của item đó. `openingDate` giữ nguyên — vì thời điểm mở gói không đổi, chỉ điều kiện bảo quản đổi.

### 10.5 Category resolve sai (user thấy app gán nhầm category)

Cho phép user sửa category trong detail view:

```
PATCH /api/items/{id}
Body: { "categoryId": "nuoc_mam_nguyen_chat" }
```

Đồng thời ghi một `CategoryCorrectionEvent` — nếu nhiều user cùng correct cùng một `productId` sang cùng category, hệ thống tự update `Product.categoryId` cho lần sau (self-improving mapping).

---

## 11. SEQUENCE DIAGRAM (Tổng Hợp)

```
User          Client (PWA)        API Server         Knowledge DB      External APIs
 │                  │                   │                   │                 │
 │──Scan barcode───>│                   │                   │                 │
 │                  │──lookup(gtin)────>│                   │                 │
 │                  │                   │──check cache─────>│                 │
 │                  │                   │<──miss────────────│                 │
 │                  │                   │──query OFF────────┼────────────────>│
 │                  │                   │<──product info─────┼─────────────────│
 │                  │                   │──resolve category──>│                │
 │                  │<──product+category─│                  │                 │
 │<──show confirm UI│                   │                   │                 │
 │──confirm details>│                   │                   │                 │
 │                  │──POST /items─────>│                   │                 │
 │                  │                   │──fetch shelfLife──>│                 │
 │                  │                   │<──typical/min/max──│                │
 │                  │                   │──save FridgeItem──>│ (Postgres)      │
 │                  │<──item created────│                   │                 │
 │<──confirmation───│                   │                   │                 │
 │                  │                   │                   │                 │
 │──open dashboard─>│                   │                   │                 │
 │                  │──GET /dashboard──>│                   │                 │
 │                  │                   │──load all items───>│                │
 │                  │                   │──calc urgency─────│                 │
 │                  │                   │──rank & classify──│                 │
 │                  │<──ranked list─────│                   │                 │
 │<──render UI──────│                   │                   │                 │
```

---

## 12. Tóm Tắt Data Flow Theo Layer

| Layer | Trách nhiệm | Mutable? |
|---|---|---|
| **Product Resolution** | GTIN → tên + category gợi ý | Cache tự cải thiện theo thời gian |
| **Knowledge Layer (ShelfLifeEntry)** | category + storage → typical/min/max days | Cập nhật qua human review, không auto |
| **User Item Layer (FridgeItem)** | Snapshot shelf life tại thời điểm tạo + opening date | Snapshot — không bị ảnh hưởng bởi update knowledge layer sau đó |
| **Calculation Engine** | Tính urgency/status real-time mỗi lần query | Stateless, không lưu kết quả |
| **Feedback Loop (UsageEvent)** | Ghi nhận actual usage để calibrate knowledge layer | Append-only, dùng cho review job |

---

*Tài liệu kỹ thuật này align với stack đã chọn: Next.js 15 (App Router), Express.js REST API, Prisma ORM, PostgreSQL, end-to-end TypeScript, theo đúng technical architecture trong PRD gốc.*