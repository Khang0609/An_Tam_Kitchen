// apps/web/components/scan/gs1-parser.ts

/**
 * Lấy GTIN từ mã vạch thô.
 * - Nếu là chuỗi số 13 chữ số → GTIN-13
 * - Nếu là 12 chữ số (UPC-A) → thêm 0 thành GTIN-13
 * - Nếu chứa Application Identifier 01 → lấy 14 số tiếp theo
 * - Nếu là chuỗi 14 chữ số → GTIN-14
 */
export function extractGTIN(rawCode: string): string | null {
  const code = rawCode.replace(/[()\s]/g, '');
  if (/^\d{13}$/.test(code)) return code;
  if (/^\d{12}$/.test(code)) return '0' + code;
  const match = code.match(/(?:01)?(\d{14})/);
  if (match) return match[1];
  if (/^\d{14}$/.test(code)) return code;
  return null;
}

/**
 * Kết quả parse các AI liên quan đến thực phẩm.
 */
export interface FoodAIs {
  expiryDate?: string; // AI 15 - định dạng yyyy-MM-dd
  lot?: string;        // AI 10 - số lô
  weight?: string;     // AI 310n - trọng lượng (đã format kèm đơn vị kg)
}

/**
 * Trích xuất các Application Identifier liên quan đến thực phẩm.
 * Hỗ trợ AI 15, AI 10, AI 310n.
 */
export function parseFoodAIs(rawCode: string): FoodAIs {
  const result: FoodAIs = {};
  let code = rawCode.replace(/[()\s]/g, '');

  // Parse AI 15 - Best Before Date (YYMMDD)
  const ai15Match = code.match(/15(\d{6})/);
  if (ai15Match) {
    const dateStr = ai15Match[1]; // YYMMDD
    const year = 2000 + parseInt(dateStr.substring(0, 2), 10);
    const month = parseInt(dateStr.substring(2, 4), 10);
    const day = parseInt(dateStr.substring(4, 6), 10);
    // Kiểm tra ngày hợp lệ
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      result.expiryDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Parse AI 10 - Batch / Lot Number (variable length, up to 20 alphanumeric)
  const ai10Match = code.match(/10([\w-]{1,20})/);
  if (ai10Match) {
    result.lot = ai10Match[1];
  }

  // Parse AI 310n - Net weight (kg, with n decimal places)
  const ai310Match = code.match(/310(\d)(\d{6})/);
  if (ai310Match) {
    const decimalPlaces = parseInt(ai310Match[1], 10); // n
    const valueStr = ai310Match[2]; // 6 digits
    const integerPart = valueStr.substring(0, 6 - decimalPlaces);
    const fractionalPart = valueStr.substring(6 - decimalPlaces);
    const weightValue = parseFloat(`${integerPart}.${fractionalPart}`);
    result.weight = `${weightValue} kg`;
  }

  return result;
}
