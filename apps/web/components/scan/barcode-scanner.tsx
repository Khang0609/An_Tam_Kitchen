'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBarcodeScanner } from './use-barcode-scanner';
import { extractGTIN } from './gs1-parser';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onDetected: (gtin: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onClose }) => {
  const { barcode, error, scanning, startScanner, stopScanner } = useBarcodeScanner();
  const scannerContainerId = 'barcode-scanner-container';
  const hasStarted = useRef(false);
  const [invalidBarcode, setInvalidBarcode] = useState(false);

  // Tự động bắt đầu camera khi component mount
  useEffect(() => {
    if (!hasStarted.current && !scanning) {
      startScanner(scannerContainerId);
      hasStarted.current = true;
    }
  }, [scanning, startScanner]);

  // Xử lý khi quét được mã thô
  useEffect(() => {
    if (barcode) {
      const gtin = extractGTIN(barcode);
      if (gtin) {
        onDetected(gtin);
        onClose();
      } else {
        // Mã không hợp lệ, hiển thị thông báo và cho quét lại
        const timer = setTimeout(() => {
          setInvalidBarcode(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [barcode, onDetected, onClose]);

  // Nếu có lỗi camera
  if (error) {
    return (
      <div className="p-4 text-center space-y-4">
        <p className="text-red-500 text-sm">{error}</p>
        <div className="flex justify-center gap-2">
          <Button onClick={() => startScanner(scannerContainerId)}>Thử lại</Button>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        id={scannerContainerId}
        className="w-full aspect-square max-w-sm mx-auto border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-black flex items-center justify-center text-white"
      />
      {invalidBarcode && (
        <p className="text-yellow-600 text-sm text-center">
          Không thể trích xuất GTIN từ mã vừa quét. Vui lòng thử lại với mã vạch sản phẩm.
        </p>
      )}
      {scanning && (
        <p className="text-center text-sm text-gray-500">Đặt mã vạch vào khung để quét</p>
      )}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => {
          stopScanner();
          onClose();
        }}>Hủy</Button>
      </div>
    </div>
  );
};
