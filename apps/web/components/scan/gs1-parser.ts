/**
 * Lấy GTIN từ mã vạch thô.
 * - Nếu là chuỗi số 13 chữ số → GTIN-13
 * - Nếu là 12 chữ số (UPC-A) → thêm 0 thành GTIN-13
 * - Nếu chứa Application Identifier 01 → lấy 14 số tiếp theo
 */
export function extractGTIN(rawCode: string): string | null {
  // Xóa dấu ngoặc và khoảng trắng
  const code = rawCode.replace(/[()\s]/g, '');

  // Trường hợp 1: toàn số và dài 13
  if (/^\d{13}$/.test(code)) return code;

  // Trường hợp 2: UPC-A (12 số)
  if (/^\d{12}$/.test(code)) return '0' + code;

  // Trường hợp 3: tìm AI 01 (có thể có hoặc không có dấu ngoặc)
  const match = code.match(/(?:01)?(\d{14})/);
  if (match) {
    return match[1]; // 14 số GTIN
  }

  // Trường hợp 4: Nếu là chuỗi 14 chữ số
  if (/^\d{14}$/.test(code)) return code;

  return null;
}
