'use client';

import { useEffect, useRef } from 'react';
import { useBarcodeScanner } from './use-barcode-scanner';
import { extractGTIN } from './gs1-parser';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onDetected: (gtin: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onClose }) => {
  const { barcode, error, scanning, startScanner, stopScanner } = useBarcodeScanner();
  const scannerContainerId = 'barcode-scanner-viewfinder';
  const hasStarted = useRef(false);

  // Bắt đầu quét khi mount
  useEffect(() => {
    if (!hasStarted.current && !scanning) {
      startScanner(scannerContainerId);
      hasStarted.current = true;
    }
  }, [scanning, startScanner]);

  // Xử lý khi quét được mã
  useEffect(() => {
    if (!barcode) return;

    const handleScan = async () => {
      // Dừng camera trước khi xử lý
      await stopScanner();

      const gtin = extractGTIN(barcode);
      if (gtin) {
        onDetected(gtin);
      } else {
        alert(`Không thể trích xuất GTIN từ mã "${barcode}". Vui lòng thử lại.`);
      }
      onClose();
    };

    handleScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcode]); // Không thêm stopScanner, onDetected, onClose để tránh loop

  // Giao diện lỗi camera
  if (error) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="text-red-500 text-sm font-medium">{error}</div>
        <div className="flex justify-center gap-2">
          <Button onClick={() => startScanner(scannerContainerId)}>Thử lại</Button>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    );
  }

  // Giao diện đang quét
  return (
    <div className="space-y-4">
      <div
        id={scannerContainerId}
        className="w-full max-w-sm mx-auto aspect-square rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
      />
      <p className="text-center text-sm text-gray-500">
        Đặt mã vạch vào khung để quét
      </p>
      <div className="flex justify-center">
        <Button variant="ghost" onClick={stopScanner} disabled={!scanning}>
          Dừng quét
        </Button>
      </div>
    </div>
  );
};
