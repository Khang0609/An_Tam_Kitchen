"use client";

import { useState } from "react";

export function useTestScanner() {
  const [showScanner, setShowScanner] = useState(false);
  const [lastGtin, setLastGtin] = useState<string | null>(null);

  const handleDetected = (gtin: string) => {
    setLastGtin(gtin);
    setShowScanner(false);
  };

  const handleClose = () => {
    setShowScanner(false);
  };

  return {
    showScanner,
    setShowScanner,
    lastGtin,
    handleDetected,
    handleClose,
  };
}
