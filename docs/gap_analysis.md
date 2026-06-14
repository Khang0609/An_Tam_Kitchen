# An Tam Kitchen — Hướng Đi Chiến Lược Đúng Đắn
**Bach Khoa Innovation 2026 | Phân tích & Reframe**

---

## 1. Chẩn Đoán: Problem Đã Solved Chưa?

### BEEP thực sự làm gì?

Flow của BEEP: **scan barcode → pull tên + ảnh sản phẩm → user nhập ngày hết hạn in trên bao bì → notification trước khi expire.**

Điều BEEP **không làm**:
- Không biết shelf life sau khi mở gói là bao nhiêu ngày
- Không phân biệt "hạn in trên bao bì" vs "hạn thực tế sau khi mở"
- Không localized cho sản phẩm Việt Nam (database chủ yếu phục vụ Hàn Quốc, Nhật, Mỹ)
- Không answer câu hỏi: *"Hôm nay nên dùng cái gì trước?"*

### Vậy gap còn lại là gì?

> **Không ai có một knowledge graph về shelf-life-sau-mở-gói cho sản phẩm thực phẩm Việt Nam.**

Đây là gap **có thật**, **chưa được fill**, và **có thể defend được** trước hội đồng — vì nó đòi hỏi localization mà không có competitor nước ngoài nào muốn đầu tư làm cho một thị trường cụ thể.

---

## 2. Reframe: Innovation Thực Sự Là Gì

### Từ cách nói cũ (yếu):

> *"Chúng tôi track opening date thay vì expiry date."*

Đây là một **feature**, không phải innovation. Bất kỳ dev nào cũng có thể thêm một date field.

### Sang cách nói mới (mạnh):

> *"Scan barcode → hệ thống tự biết sản phẩm này sau khi mở còn dùng được bao nhiêu ngày trong điều kiện bảo quản nào → user chỉ cần confirm ngày mở → dashboard tự động prioritize 'dùng cái nào trước hôm nay'."*

Đây là một **Vietnamese post-opening shelf life knowledge system** — thứ không app nào có cho thị trường Việt Nam, và không thể clone bằng cách chỉ thêm một field.

---

## 3. Core Innovation: The Knowledge Layer

### 3.1 Tại Sao Knowledge Layer Là Moat Thực Sự

Bất kỳ app nào cũng có thể có UI. Bất kỳ dev nào cũng có thể làm barcode scan với Open Food Facts. Nhưng để biết rằng:

| Sản phẩm | Điều kiện | Shelf life sau mở |
|---|---|---|
| Nước mắm chai (nguyên chất) | Tủ lạnh | ~3 tháng |
| Nước mắm pha chua ngọt | Tủ lạnh | ~1 tháng |
| Mắm kho quẹt | Tủ lạnh | 7–10 ngày |
| Tương ớt (Cholimex, Chin-su) | Tủ lạnh | ~6 tháng |
| Sốt mayonnaise (đã mở) | Tủ lạnh | ~3 tháng |
| Nước tương (đã mở) | Nhiệt độ phòng | ~1 năm |
| Sữa tươi Vinamilk (đã mở) | Tủ lạnh | 2–3 ngày |
| Sữa chua (đã mở) | Tủ lạnh | 1–2 ngày |
| Bánh mì sandwich (đã mở) | Nhiệt độ phòng | 2–3 ngày |
| Đồ ăn nấu sẵn (leftovers) | Tủ lạnh | 3–4 ngày |

→ Đây là **domain knowledge** đòi hỏi nghiên cứu từng product category, điều kiện bảo quản, và tập quán của người Việt. Đây không phải data có sẵn trên internet. Đây phải được **xây dựng** như một database có curation.

### 3.2 Cấu Trúc Knowledge Graph Đề Xuất

```
Product Category (cấp 1)
└── Sub-category (cấp 2)
    └── Storage Condition
        ├── shelf_life_after_open_days (min, typical, max)
        ├── quality_decline_signal (màu sắc, mùi, texture)
        └── vietnamese_note (ghi chú theo thói quen Việt)
```

**Ví dụ cụ thể:**

```json
{
  "category": "nước chấm",
  "sub_category": "nước mắm nguyên chất",
  "brand_examples": ["Phú Quốc", "Chin-su", "Nam Ngư"],
  "storage": {
    "refrigerator": {
      "shelf_life_days": { "min": 60, "typical": 90, "max": 180 },
      "quality_signal": "màu sậm dần, mùi giảm — vẫn dùng được",
      "safety_signal": "nấm mốc trên miệng chai — bỏ ngay"
    },
    "room_temp": {
      "shelf_life_days": { "typical": 30 },
      "note": "Nên cho vào tủ lạnh sau khi mở để dùng lâu hơn"
    }
  },
  "vietnamese_note": "Nước mắm truyền thống độ mặn cao bảo quản tự nhiên — khác với nước mắm pha sẵn chua ngọt chỉ dùng 1 tháng"
}
```

---

## 4. Revised Core User Flow

### Flow Mới (khác hẳn BEEP):

```
1. SCAN barcode
   → Pull: tên sản phẩm, ảnh, category (từ GS1 Vietnam / Open Food Facts)
   → Hệ thống TỰ ĐỘNG suggest: shelf life sau mở + điều kiện bảo quản khuyến nghị

2. USER chỉ cần:
   → Confirm (hoặc chỉnh) ngày mở hôm nay
   → Confirm vị trí lưu (tủ lạnh ngăn mát / ngăn đông / nhiệt độ phòng)

3. DASHBOARD tự động:
   → Status: Fresh / Use Soon / Check Before Use / Not Recommended
   → "Hôm nay dùng trước": ranked list theo urgency
   → Cảnh báo trước X ngày (configurable theo category)
```

**Friction so sánh:**

| | BEEP | NoWaste | An Tam Kitchen (mới) |
|---|---|---|---|
| Scan barcode | ✅ | ✅ | ✅ |
| User nhập ngày hết hạn | ✅ (bắt buộc) | ✅ (bắt buộc) | ❌ (không cần) |
| User nhập ngày mở | ❌ | ❌ | ✅ (1 tap) |
| Tự biết shelf life sau mở | ❌ | ❌ | ✅ (từ knowledge DB) |
| Localized cho Việt Nam | ❌ | ❌ | ✅ |
| "Dùng cái nào trước hôm nay" | ❌ | Partial | ✅ |

---

## 5. Revised Problem Statement (Mạnh Hơn)

### Frame cũ:
> "Gia đình quên ngày mở gói"

### Frame mới (có evidence):

**Bài toán có 3 lớp:**

**Lớp 1 — Information Gap:**  
Người dùng biết ngày hết hạn *in trên bao bì* nhưng không biết sản phẩm đó còn dùng được bao lâu *sau khi đã mở*. Thông tin này khác nhau hoàn toàn tùy loại sản phẩm (nước mắm nguyên chất vs nước mắm pha sẵn: 3 tháng vs 1 tháng), và không có nguồn nào tập trung, đáng tin cho sản phẩm Việt Nam.

**Lớp 2 — Memory Gap:**  
Ngay cả khi người dùng *biết* thông tin này, họ không nhớ *hôm nay là ngày thứ mấy kể từ khi mở*. Đây là thứ tủ lạnh vật lý không giải quyết được.

**Lớp 3 — Prioritization Gap:**  
Không có công cụ nào nói với người dùng: *"Hôm nay trong 12 thứ trong tủ lạnh của bạn, cái này cần dùng trước nhất."* Họ phải mentally calculate từng item — điều này không xảy ra trong thực tế.

---

## 6. Innovation Claims Đúng Để Trình Bày Với Hội Đồng BKI

### Claim 1: Vietnamese Post-Opening Shelf Life Database

**"Chúng tôi xây dựng database đầu tiên về thời hạn sử dụng sau khi mở gói của sản phẩm thực phẩm phổ biến tại Việt Nam — thứ không tồn tại ở bất kỳ đâu dưới dạng có cấu trúc và localizable."**

*Defend được vì:* GS1 Vietnam có 1.6M sản phẩm đăng ký nhưng không chứa shelf-life-after-opening. Open Food Facts có data toàn cầu nhưng sparse và không có post-opening data. Không có competitor nào có điều này cho thị trường VN.

### Claim 2: Zero Expiry-Date-Entry UX

**"Người dùng không bao giờ cần nhập ngày hết hạn in trên bao bì — thứ mà tất cả competitors hiện tại đều yêu cầu. Họ chỉ cần confirm ngày mở hôm nay."**

*Defend được vì:* Đây là friction reduction có thể đo được. BEEP, NoWaste, Fridgely đều require expiry date input. An Tam Kitchen replace bước đó bằng knowledge database.

### Claim 3: Actionable Daily Dashboard (không phải inventory list)

**"Thay vì hiển thị một danh sách inventory, chúng tôi trả lời đúng một câu hỏi: 'Hôm nay nên dùng cái gì trước?' — một UX paradigm khác hoàn toàn với expiry-date-notification model."**

---

## 7. Revised Gap Analysis (Honest & Defensible)

| Gap | Thực Trạng | An Tam Kitchen |
|---|---|---|
| **Post-opening shelf life knowledge (VN)** | **Không tồn tại** ở dạng có cấu trúc | Build từ đầu — **thực sự innovation** |
| **Localization tiếng Việt** | Không app nào có | Vietnamese-first by design |
| **Zero expiry-date-entry UX** | Mọi competitor đều require | Eliminate hoàn toàn |
| **"Dùng gì trước hôm nay" vs "khi nào expire"** | Notification model (passive) | Dashboard model (active, daily) |
| **Ordinary fridge compatibility** | Samsung Family Hub cần smart fridge | Works với bất kỳ tủ lạnh nào |

**Gap mà nhóm KHÔNG nên claim (sẽ bị phản bác):**
- "Chúng tôi track opening date" → BEEP không track nhưng user có thể tự tính được; không phải gap đủ mạnh
- "Family coordination" → NoWaste đã có shared lists
- "Low friction" → Cần evidence thực tế, không chỉ claim

---

## 8. MVP Priorities (Reordered)

Theo hướng đi mới, thứ tự ưu tiên MVP phải thay đổi:

### Must Have (để innovation claim đứng vững):
1. **Vietnamese Shelf Life Database** — ít nhất 100 SKU/categories phổ biến nhất (nước mắm, tương ớt, sữa, rau củ, đồ ăn chế biến sẵn, sốt các loại, dairy). **Đây là technical core.**
2. **Barcode scan → auto-suggest shelf life** — integration với Open Food Facts + GS1 VN lookup
3. **"Dùng hôm nay" dashboard** — ranked by days-since-opening vs shelf-life-after-opening
4. **Opening date confirmation flow** — 1-2 taps, không phải typing

### Nice to Have (Phase 2):
5. Family sharing / multi-user fridge
6. Reminder notifications
7. Recipe suggestions based on expiring items
8. Barcode for products not in database (manual entry fallback)

### Deprioritize (không phải differentiation):
- AI recipe (không unique)
- B2B API (premature)
- Native mobile app (PWA đủ cho MVP)

---

## 9. Validation Plan (Concrete, Trước Khi Nộp BKI)

### Quick Research Cần Làm Ngay (1–2 tuần):

**Interview 10 người (homemaker đô thị TP.HCM):**
- "Trong 2 tuần gần nhất, chị có bỏ thứ gì trong tủ lạnh không? Tại sao?"
- "Khi mở một chai nước mắm / hộp sữa chua, chị có nhớ hôm nay là ngày bao nhiêu không? Chị theo dõi bằng cách nào?"
- "Nếu app tự biết cái này còn dùng được X ngày nữa và hiện ra 'dùng trước hôm nay', chị có dùng không?"

**Survey nhanh 50 người (Google Form, share trong các group nội trợ TP.HCM):**
- Bao nhiêu lần/tháng bạn tìm thấy thực phẩm đã hỏng/quá hạn trong tủ lạnh?
- Bạn có biết nước mắm sau khi mở dùng được bao lâu không? (Test awareness gap)
- Bạn có biết sữa chua sau khi mở nên dùng trong bao nhiêu ngày không?

*Kết quả survey này là primary evidence cho problem statement — mạnh hơn bất kỳ global statistic nào.*

---

## 10. Revised Pitch Structure Cho BKI

### Opening (15 giây):
> "Tủ lạnh của bạn có bao nhiêu thứ bạn không nhớ mở từ bao giờ?"

### Problem (30 giây):
> "Người Việt Nam biết ngày hết hạn in trên bao bì. Nhưng không ai biết chai nước mắm này, cái hộp tương ớt kia, hũ sữa chua này — sau khi mở rồi, còn dùng được đến bao giờ. Và không có nguồn nào cho họ biết điều đó."

### Gap (15 giây):
> "BEEP, NoWaste, Fridgely — tất cả đều ask bạn nhập ngày hết hạn in trên vỏ. Không ai giải quyết câu hỏi: *sau khi mở rồi thì sao?*"

### Solution (45 giây):
> "An Tam Kitchen là app đầu tiên xây dựng Vietnamese Post-Opening Shelf Life Database — scan barcode, app tự biết sản phẩm này sau khi mở còn dùng được bao lâu, bạn chỉ cần tap 'mở hôm nay'. Dashboard trả lời một câu hỏi duy nhất mỗi ngày: *hôm nay dùng cái gì trước?*"

### Innovation (20 giây):
> "Innovation không phải là app quản lý tủ lạnh — cái đó đã có. Innovation là knowledge layer về thực phẩm Việt Nam mà không ai đã xây, và không competitor nước ngoài nào có động lực để xây."

---

## 11. Điểm Yếu Cần Acknowledge Thẳng (Hội Đồng Sẽ Hỏi)

**Q: "Database này có chính xác không? Ai verify?"**  
→ Trả lời: Database được build dựa trên (1) hướng dẫn của nhà sản xuất, (2) khuyến nghị từ các cơ quan thực phẩm (FDA cold storage charts, Bộ Y tế VN), (3) validated với domain experts. Luôn label là "reference guidance", không phải "safety guarantee" — disclaimer rõ ràng.

**Q: "Retention như thế nào? Người dùng có dùng thường xuyên không?"**  
→ Trả lời thật: Đây là open question chúng tôi đang validate. Hypothesis là daily dashboard (không phải notification) tạo pull behavior tự nhiên hơn là push reminder. Pilot test 20–30 hộ gia đình 4 tuần sẽ trả lời câu này.

**Q: "BEEP cũng có thể add opening date tracking — barrier to copy là gì?"**  
→ Trả lời: Barrier không phải là feature, là data. Vietnamese shelf life knowledge graph là tài sản tích lũy theo thời gian. Càng nhiều user contribute feedback về sản phẩm VN, database càng chính xác. First-mover xây knowledge layer này có lợi thế tích lũy.

**Q: "TAM/SAM/SOM cụ thể là bao nhiêu?"**  
→ Cần bổ sung con số: Vietnam ~27M hộ gia đình, urban ~40% ≈ 10.8M hộ, smartphone + refrigerator ownership urban ~70–80% ≈ 7.5–8M hộ (SAM). Target Year 1: 0.1% SAM = 7,500–8,000 hộ active (SOM). Revenue từ freemium: thử nghiệm 29.000đ/tháng premium.

---

## 12. Tóm Tắt: Từ "Opening Date Tracker" Sang "Vietnamese Food Intelligence Layer"

| Aspect | Cách Cũ | Cách Mới |
|---|---|---|
| **What we are** | Digital fridge / opening date tracker | Vietnamese post-opening food intelligence layer |
| **Core innovation** | Track opening date (feature) | Shelf-life-after-open knowledge graph (VN-specific) |
| **User action** | Log when you open something | Confirm today's date when you open something |
| **System does** | Shows you a dashboard | Tells you shelf life automatically, ranks what to use first |
| **Competitor gap** | "They don't track opening date" | "They don't know Vietnamese products' shelf life after opening" |
| **Moat** | None (easy to copy) | Data asset that grows with usage |
| **Pitch anchor** | "We track opening dates" | "We built knowledge no one else has for Vietnamese kitchens" |

---

*Tài liệu này tổng hợp từ: BEEP feature analysis, NoWaste/Fridgely competitive review, GS1 Vietnam data (1.6M registered products, 80K+ food businesses), Vietnamese condiment shelf-life research, UNEP food waste data, và competitive landscape analysis.*