'use client';

import { useState } from 'react';
import { BarcodeScanner } from '@/components/scan/barcode-scanner';
import { Button } from '@/components/ui/button';

export default function TestScannerPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [lastGtin, setLastGtin] = useState<string | null>(null);

  const handleDetected = (gtin: string) => {
    setLastGtin(gtin);
    setShowScanner(false);
  };

  return (
    <div className="p-8 max-w-lg mx-auto space-y-6 flex flex-col justify-center min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">Test BarcodeScanner Component</h1>
        {!showScanner ? (
          <div className="space-y-4 flex flex-col items-center">
            <Button onClick={() => setShowScanner(true)} size="lg" className="w-full">
              Mở Scanner
            </Button>
            {lastGtin && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center w-full">
                <p className="text-green-800 font-medium">
                  ✅ GTIN đã quét:
                </p>
                <p className="font-mono font-bold text-xl mt-1 text-green-600">
                  {lastGtin}
                </p>
              </div>
            )}
          </div>
        ) : (
          <BarcodeScanner onDetected={handleDetected} onClose={() => setShowScanner(false)} />
        )}
      </div>
    </div>
  );
}
