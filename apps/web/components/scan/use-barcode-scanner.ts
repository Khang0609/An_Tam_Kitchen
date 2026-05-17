import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface UseBarcodeScannerResult {
  barcode: string | null;
  error: string | null;
  scanning: boolean;
  startScanner: (elementId: string) => void;
  stopScanner: () => void;
}

export function useBarcodeScanner(): UseBarcodeScannerResult {
  const [barcode, setBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = (elementId: string) => {
    // Nếu đã có scanner đang chạy thì không tạo mới
    if (scannerRef.current) return;

    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    setScanning(true);
    setError(null);
    setBarcode(null);

    scanner
      .start(
        { facingMode: 'environment' }, // camera sau
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
          // Cho phép quét nhiều định dạng, không chỉ QR
          formatsToSupport: [
            1, // EAN_13 (Html5QrcodeSupportedFormats.EAN_13)
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
        },
        (decodedText) => {
          // Thành công
          setBarcode(decodedText);
          setError(null);
          // Dừng camera sau khi quét xong
          scanner.stop().then(() => {
            scannerRef.current = null;
            setScanning(false);
          }).catch((err) => {
            console.error('Failed to stop scanner after success:', err);
          });
        },
        () => {
          // Ignore lỗi quét liên tục (ví dụ không nhận diện được), không hiển thị ra UI
        }
      )
      .catch((err) => {
        console.error('Cannot start scanner:', err);
        setError('Không thể truy cập camera. Hãy kiểm tra quyền hoặc kết nối HTTPS.');
        setScanning(false);
        scannerRef.current = null;
      });
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current = null;
          setScanning(false);
        })
        .catch((err) => {
          console.error('Failed to stop scanner:', err);
        });
    }
  };

  // Cleanup khi component bị unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current = null;
        }).catch(() => {
          // Ignore errors on unmount stop
        });
      }
    };
  }, []);

  return { barcode, error, scanning, startScanner, stopScanner };
}
