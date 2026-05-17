'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarcodeScanner } from './barcode-scanner';

interface BarcodeScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (gtin: string) => void;
}

export const BarcodeScannerModal = ({
  open,
  onOpenChange,
  onDetected,
}: BarcodeScannerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quét mã vạch</DialogTitle>
        </DialogHeader>
        {open && (
          <BarcodeScanner
            onDetected={onDetected}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
