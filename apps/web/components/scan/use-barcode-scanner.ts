import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useBarcodeScanner() {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = (elementId: string) => {
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode(elementId, {
      verbose: false,
      formatsToSupport: [
        1, // EAN_13
        2, // EAN_8
        3, // UPC_A
        4, // UPC_E
        6, // CODE_128
        5, // CODE_39
        7, // CODE_93
        8, // CODABAR
        9, // ITF
        11, // RSS_14
        12, // RSS_EXPANDED
        0, // QR_CODE
        13, // DATA_MATRIX
        10, // PDF417
      ],
    });
    scannerRef.current = scanner;

    setScanning(true);
    setError(null);
    setBarcode(null);

    scanner
      .start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          setBarcode(decodedText);
        },
        () => {}
      )
      .catch((err) => {
        console.error(err);
        setError('Không thể truy cập camera. Kiểm tra quyền hoặc kết nối HTTPS.');
        setScanning(false);
        scannerRef.current = null; // reset để có thể thử lại
      });
  };

  // stopScanner giờ trả về Promise để component chờ
  const stopScanner = async (): Promise<void> => {
    if (!scannerRef.current) return;

    // Kiểm tra trạng thái scanner để tránh lỗi "not running"
    try {
      const state = scannerRef.current.getState();
      // Dùng so sánh trực tiếp để tránh các vấn đề phiên bản hoặc import của Html5QrcodeScanState enum
      if (state === 2 || state === 3) { // 2 = SCANNING, 3 = PAUSED in Html5QrcodeScanState
        await scannerRef.current.stop();
      }
    } catch (e) {
      console.warn('Scanner already stopped or error:', e);
    } finally {
      scannerRef.current = null;
      setScanning(false);
    }
  };

  // Cleanup an toàn
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        try {
          const state = scanner.getState();
          if (state === 2 || state === 3) {
            scanner.stop().catch(() => {});
          }
        } catch {
          // Bỏ qua lỗi khi unmount
        }
      }
    };
  }, []);

  return { barcode, error, scanning, startScanner, stopScanner };
}
