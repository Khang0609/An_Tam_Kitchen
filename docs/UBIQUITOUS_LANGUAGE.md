# Ubiquitous Language

## Food Inventory

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Tủ lạnh số** | The user's inventory view for opened or tracked food items. | Dashboard only, fridge list |
| **Thực phẩm** | A tracked food item in the user's inventory. | Product when referring to inventory state |
| **Sản phẩm** | The named product or packaged food associated with an inventory item. | Inventory item |
| **Ngày mở nắp** | The date the user records opening a product. | Start date |
| **Hạn sử dụng trên bao bì** | The expiry date printed or provided on product packaging. | Safety date |
| **Vị trí bảo quản** | The place where the food is stored, such as fridge, freezer, or room temperature. | Area, storage bucket |
| **Nhóm thực phẩm** | A user-facing category used to group foods for display and rule hints. | Backend category when the frontend category differs |

## Status Language

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Trạng thái hiện tại** | The current recommendation status shown for a food item. | Safety verdict |
| **Khuyến nghị theo trạng thái** | Careful guidance text associated with the current status. | Safety instruction |
| **Mốc tham chiếu** | A non-authoritative time threshold used to explain a recommendation. | Guarantee, proof |
| **Rule tạm thời** | Frontend service-layer logic used when the backend has not returned a status. | Backend rule |
| **Disclaimer** | A visible note that the information is only for reference and users should check packaging and sensory signs. | Legal fine print |

## Relationships

- A **Thực phẩm** belongs to one **Tủ lạnh số**.
- A **Thực phẩm** has one **Trạng thái hiện tại**.
- A **Trạng thái hiện tại** has one **Khuyến nghị theo trạng thái**.
- A **Rule tạm thời** may produce a **Trạng thái hiện tại** until the backend provides one.
- A **Mốc tham chiếu** can explain a recommendation, but it must not be treated as a food safety guarantee.

## Example Dialogue

> **Dev:** "Trang chi tiết nên đưa ra kết luận mạnh về sản phẩm này chứ?"
> **Domain expert:** "Không. Hãy gọi đó là **Trạng thái hiện tại** và dùng **Khuyến nghị theo trạng thái** với ngôn ngữ tham khảo."
> **Dev:** "Nếu backend chưa trả trạng thái thì sao?"
> **Domain expert:** "Ghi rõ là dùng **Rule tạm thời** và giải thích **Mốc tham chiếu** đang được dùng."
> **Dev:** "Vậy **Disclaimer** luôn cần hiển thị?"
> **Domain expert:** "Đúng, vì người dùng vẫn cần kiểm tra mùi, màu sắc và hướng dẫn trên bao bì."

## Flagged Ambiguities

- "Sản phẩm" and "Thực phẩm" can blur together. Use **Sản phẩm** for the named/package item and **Thực phẩm** for the tracked inventory record.
- "Safe" should not be translated as an absolute safety claim. Use **Còn trong thời gian khuyến nghị** for the status label and careful guidance copy.
