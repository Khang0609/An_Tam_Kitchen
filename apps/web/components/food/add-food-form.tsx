"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { format, subDays } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  LoaderCircle,
  Lock,
  Sparkles,
  Search,
  Barcode,
  X,
  Camera,
  CheckCircle2,
  CornerDownRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BarcodeScannerModal } from "@/components/scan/barcode-scanner-modal";
import { parseFoodAIs } from "@/components/scan/gs1-parser";
import { getProductByBarcode } from "@/lib/api/products";
import { FormFieldShell } from "@/components/foundation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isAuthError, getAuthErrorMessage } from "@/lib/api/client";
import type { AddFoodCategory, AddFoodStorageLocation } from "@/lib/api/types";
import { clearAuthHint, getAuthRequiredHref } from "@/lib/auth-session";
import { useAddInventoryItem } from "@/hooks/mutations/use-add-inventory-item";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import {
  CATEGORY_OPTIONS as _CATEGORY_OPTIONS,
  STORAGE_LOCATION_OPTIONS as _STORAGE_LOCATION_OPTIONS,
} from "@repo/types";

const CATEGORY_OPTIONS = _CATEGORY_OPTIONS ?? [];
const STORAGE_LOCATION_OPTIONS = _STORAGE_LOCATION_OPTIONS ?? [];

const addFoodFormSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống."),
  category: z.string().min(1, "Vui lòng chọn nhóm thực phẩm."),
  openedAt: z
    .string()
    .min(1, "Ngày mở nắp là bắt buộc.")
    .refine((value) => !isFutureDate(value), {
      message: "Ngày mở nắp không được ở tương lai.",
    }),
  expiryDate: z.string().optional(),
  manufacturedDate: z.string().optional(), // NSX cho Fallback Form
  storageLocation: z.string().min(1, "Vui lòng chọn vị trí bảo quản."),
  notes: z.string().optional(),
});

type AddFoodFormValues = z.infer<typeof addFoodFormSchema>;

const defaultValues: AddFoodFormValues = {
  name: "",
  category: "",
  openedAt: format(new Date(), "yyyy-MM-dd"),
  expiryDate: "",
  manufacturedDate: "",
  storageLocation: "fridge",
  notes: "",
};

// Cột sản phẩm mock để tìm kiếm & quét mã vạch
interface CatalogProduct {
  id: string;
  name: string;
  category: AddFoodCategory;
  storageLocation: AddFoodStorageLocation;
  barcode: string;
  company: string;
}

const MOCK_CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "p1", name: "Sữa tươi TH True Milk", category: "milk", storageLocation: "fridge", barcode: "893467312015", company: "TH Group" },
  { id: "p2", name: "Mì tôm Hảo Hảo chua cay", category: "other", storageLocation: "room", barcode: "893456313812", company: "Acecook Việt Nam" },
  { id: "p3", name: "Sữa chua Vinamilk nha đam", category: "milk", storageLocation: "fridge", barcode: "893460012022", company: "Vinamilk" },
  { id: "p4", name: "Trứng gà Ba Huân", category: "other", storageLocation: "fridge", barcode: "893500212030", company: "Ba Huân Food" },
  { id: "p5", name: "Tương ớt Chinsu", category: "sauce", storageLocation: "room", barcode: "893478912345", company: "Masan Consumer" },
  { id: "p6", name: "Nước tương Maggi", category: "sauce", storageLocation: "room", barcode: "893452298765", company: "Nestlé" },
];

function playBeepSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Beep frequency
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.12);
  } catch (error) {
    console.warn("Could not play scanner beep sound:", error);
  }
}

export function AddFoodForm() {
  const router = useRouter();
  const addMutation = useAddInventoryItem();
  const reduceMotion = useReducedMotion();

  // Các state quản lý luồng Search before Create
  const [step, setStep] = useState<"search" | "results" | "form">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false); // mock scanner modal
  const [scannerOpen, setScannerOpen] = useState(false); // real camera scanner modal
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [scanSuccessMessage, setScanSuccessMessage] = useState<string | null>(null);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    getValues,
  } = useForm<AddFoodFormValues>({
    defaultValues,
    resolver: standardSchemaResolver(addFoodFormSchema),
  });

  const maxDate = format(new Date(), "yyyy-MM-dd");

  // Tìm kiếm sản phẩm cục bộ
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return MOCK_CATALOG_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q) ||
        p.barcode.includes(q)
    );
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matches = filteredProducts;
    if (matches.length > 0) {
      setStep("results");
    } else {
      // Tự động chuyển tới form dự phòng nếu không tìm thấy
      triggerFallbackMode(searchQuery);
    }
  };

  const triggerFallbackMode = (initialName: string) => {
    setIsFallbackMode(true);
    setSelectedProduct(null);
    setScanSuccessMessage(null);
    reset({
      ...defaultValues,
      name: initialName,
    });
    setStep("form");
  };

  const handleSelectProduct = (product: CatalogProduct) => {
    setSelectedProduct(product);
    setIsFallbackMode(false);
    setScanSuccessMessage(null);
    reset({
      ...defaultValues,
      name: product.name,
      category: product.category,
      storageLocation: product.storageLocation,
    });
    setStep("form");
  };

  // Giả lập quét Barcode
  const handleSimulateScan = (product: CatalogProduct) => {
    playBeepSound();
    setScanSuccessMessage(`Đã quét mã vạch (giả lập): ${product.name} (${product.barcode})`);
    setIsScanning(false);
    setSelectedProduct(product);
    setIsFallbackMode(false);
    reset({
      ...defaultValues,
      name: product.name,
      category: product.category,
      storageLocation: product.storageLocation,
    });
    setStep("form");
  };

  // Quét Barcode thực tế (Camera)
  const handleBarcodeDetected = async (gtin: string, rawCode: string) => {
    setScannerOpen(false);
    try {
      const product = await getProductByBarcode(gtin);
      if (product) {
        // Ánh xạ danh mục từ Backend (FoodCategory) sang Frontend (AddFoodCategory)
        const categoryMap: Record<string, string> = {
          dairy: "milk",
          sauces_spices: "sauce",
          drinks: "drink",
        };
        const mappedCategory = (product.category && categoryMap[product.category]) || "other";

        setSelectedProduct({
          id: product.id || "scanned",
          name: product.name,
          category: mappedCategory as AddFoodCategory,
          storageLocation: "fridge",
          barcode: gtin,
          company: "",
        });
        setIsFallbackMode(false);
        setScanSuccessMessage(`Đã quét mã vạch: ${product.name} (${gtin})`);

        reset({
          ...defaultValues,
          name: product.name,
          category: mappedCategory,
          storageLocation: "fridge",
          openedAt: maxDate,
        });

        // Parse AI từ rawCode
        const foodAIs = parseFoodAIs(rawCode);

        if (foodAIs.expiryDate) {
          setValue("expiryDate", foodAIs.expiryDate, { shouldValidate: true });
        }

        if (foodAIs.lot || foodAIs.weight) {
          const currentNotes = getValues("notes") || "";
          let newNotes = currentNotes;

          if (foodAIs.lot) {
            newNotes += `\nLô: ${foodAIs.lot}`;
          }
          if (foodAIs.weight) {
            newNotes += `\nKL: ${foodAIs.weight}`;
          }

          newNotes = newNotes.trim();
          setValue("notes", newNotes, { shouldValidate: true });
        }

        playBeepSound();
        setStep("form");
      } else {
        playBeepSound();
        setScanSuccessMessage(`Quét mã vạch thành công: ${gtin} (Sản phẩm mới)`);
        triggerFallbackMode(`Sản phẩm mã ${gtin}`);
      }
    } catch (error) {
      console.error("Lỗi tìm sản phẩm:", error);
      alert("Có lỗi khi tra cứu sản phẩm. Vui lòng thử lại sau.");
    }
  };
  async function onSubmit(values: AddFoodFormValues) {
    const category = toAddFoodCategory(values.category);
    const storageLocation = toAddFoodStorageLocation(values.storageLocation);

    if (!category) {
      setError("category", { message: "Vui lòng chọn nhóm thực phẩm." });
      return;
    }

    if (!storageLocation) {
      setError("storageLocation", {
        message: "Vui lòng chọn vị trí bảo quản.",
      });
      return;
    }

    // Ghép NSX vào trường notes để lưu trữ bền vững nếu có
    let finalNotes = values.notes || "";
    if (isFallbackMode && values.manufacturedDate) {
      const nsxLabel = `NSX: ${format(new Date(values.manufacturedDate), "dd/MM/yyyy")}`;
      finalNotes = finalNotes ? `${nsxLabel} | ${finalNotes}` : nsxLabel;
    }

    try {
      await addMutation.mutateAsync({
        name: values.name,
        category,
        openedAt: values.openedAt,
        expiryDate: values.expiryDate || undefined,
        storageLocation,
        notes: finalNotes || undefined,
      });

      router.push("/#digital-fridge");
    } catch (error) {
      if (isAuthError(error)) {
        clearAuthHint();
        setError("root", {
          type: "auth",
          message: getAuthErrorMessage(error),
        });
        return;
      }

      setError("root", {
        message:
          "Chưa thể lưu món này. Bạn thử lại sau ít phút hoặc kiểm tra kết nối nhé.",
      });
    }
  }

  const isAuthRootError = errors.root?.type === "auth";
  const loginHref = getAuthRequiredHref("/foods/new");
  const isBusy = isSubmitting || addMutation.isPending;

  return (
    <div className="w-full">
      {/* ─── BANNER QUÉT THÀNH CÔNG (NẾU CÓ) ─── */}
      {scanSuccessMessage && (
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-600 animate-bounce" />
          <span>{scanSuccessMessage}</span>
        </div>
      )}

      {/* ─── BƯỚC 1: TÌM KIẾM HOẶC QUÉT BARCODE (DEFAULT VIEW) ─── */}
      {step === "search" && (
        <div className="rounded-2xl border bg-background p-6 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-full max-w-lg text-center">
            <h2 className="text-xl font-semibold leading-tight mb-2">Tìm kiếm sản phẩm</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Nhập tên thực phẩm hoặc quét mã vạch để tự động kiểm tra mốc bảo quản khuyến nghị từ hệ thống.
            </p>

            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-13 pl-12 pr-12 rounded-2xl border-muted-foreground/20 focus-visible:ring-primary shadow-sm text-base"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm: Sữa chua, mì tôm, trứng..."
                  type="text"
                  value={searchQuery}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              
              <Button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="h-13 rounded-2xl px-5 gap-2 shrink-0 shadow-sm"
                variant="outline"
              >
                <Barcode className="size-5 text-primary" />
                <span className="hidden sm:inline">Quét Barcode</span>
              </Button>
            </form>

            {/* Gợi ý nhanh */}
            <div className="mt-8 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground block">
                  Gợi ý tìm kiếm phổ biến
                </span>
                <button
                  type="button"
                  onClick={() => setIsScanning(true)}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="size-3 text-amber-500" />
                  Mô phỏng quét (Demo)
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {MOCK_CATALOG_PRODUCTS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSearchQuery(p.name);
                      // Tự động tìm kiếm ngay lập tức
                      setSelectedProduct(p);
                      handleSelectProduct(p);
                    }}
                    className="inline-flex items-center gap-1 text-xs px-3.5 py-2 rounded-2xl border bg-card hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                  >
                    <CornerDownRight className="size-3 text-muted-foreground" />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── BƯỚC 2: KẾT QUẢ TÌM KIẾM ─── */}
      {step === "results" && (
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold">Kết quả tìm thấy</h2>
              <p className="text-xs text-muted-foreground">Có {filteredProducts.length} sản phẩm khớp với từ khóa của bạn.</p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setStep("search")}>
              Quay lại tìm kiếm
            </Button>
          </div>

          <div className="grid gap-3 mb-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-all"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.company}</p>
                </div>
                <Button
                  size="sm"
                  className="rounded-2xl px-4 gap-1"
                  onClick={() => handleSelectProduct(product)}
                >
                  Chọn
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Không thấy sản phẩm bạn cần?
            </span>
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl gap-1 border-primary/45 text-primary hover:bg-primary/5"
              onClick={() => triggerFallbackMode(searchQuery)}
            >
              <Plus className="size-3.5" />
              Tự nhập tay sản phẩm mới
            </Button>
          </div>
        </div>
      )}

      {/* ─── BƯỚC 3: FORM ĐIỀN THÔNG TIN HOÀN THIỆN ─── */}
      {step === "form" && (
        <form
          className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Fallback Form Mode Warning */}
          {isFallbackMode && (
            <Alert className="mb-5 border-amber-200 bg-amber-50 text-amber-950">
              <AlertCircle aria-hidden={true} className="size-4 text-amber-600" />
              <AlertTitle className="font-semibold">Không tìm thấy sản phẩm trong hệ thống</AlertTitle>
              <AlertDescription className="text-amber-900 text-xs">
                Vui lòng điền thông tin chi tiết vào form dự phòng bên dưới để tiếp tục thêm món.
              </AlertDescription>
            </Alert>
          )}

          {errors.root?.message ? (
            <Alert className="mb-5 border-rose-200 bg-rose-50 text-rose-950">
              <AlertCircle aria-hidden={true} className="size-4" />
              <AlertTitle>Chưa lưu được thực phẩm</AlertTitle>
              <AlertDescription className="text-rose-900 text-xs">
                {errors.root.message}
                {isAuthRootError ? (
                  <div className="mt-3">
                    <Button asChild className="rounded-2xl" size="sm">
                      <Link href={loginHref}>
                        <Lock aria-hidden={true} className="size-4" />
                        Đăng nhập
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-5">
            {/* Tên sản phẩm */}
            <FormFieldShell
              error={errors.name?.message}
              id="name"
              label="Tên sản phẩm"
              required
            >
              <Input
                aria-invalid={Boolean(errors.name)}
                autoComplete="off"
                className="h-11 rounded-2xl bg-card"
                id="name"
                readOnly={!isFallbackMode}
                placeholder="Ví dụ: Sữa tươi Vinamilk"
                {...register("name")}
              />
            </FormFieldShell>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Phân mục / Danh mục */}
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <FormFieldShell
                    error={errors.category?.message}
                    id="category"
                    label="Phân mục / Danh mục"
                    required
                  >
                    <Select
                      disabled={isBusy || !isFallbackMode}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        aria-invalid={Boolean(errors.category)}
                        className="h-11 w-full rounded-2xl bg-card"
                        id="category"
                      >
                        <SelectValue placeholder="Chọn nhóm" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldShell>
                )}
              />

              {/* Vị trí bảo quản */}
              <Controller
                control={control}
                name="storageLocation"
                render={({ field }) => (
                  <FormFieldShell
                    error={errors.storageLocation?.message}
                    id="storageLocation"
                    label="Vị trí bảo quản"
                    required
                  >
                    <Select
                      disabled={isBusy}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        aria-invalid={Boolean(errors.storageLocation)}
                        className="h-11 w-full rounded-2xl bg-card"
                        id="storageLocation"
                      >
                        <SelectValue placeholder="Chọn vị trí" />
                      </SelectTrigger>
                      <SelectContent>
                        {STORAGE_LOCATION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldShell>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Ngày mở nắp */}
              <FormFieldShell
                error={errors.openedAt?.message}
                id="openedAt"
                label="Ngày mở nắp"
                required
              >
                <Input
                  aria-invalid={Boolean(errors.openedAt)}
                  className="h-11 rounded-2xl bg-card"
                  id="openedAt"
                  max={maxDate}
                  type="date"
                  {...register("openedAt")}
                />
              </FormFieldShell>

              {/* Hạn sử dụng - HSD */}
              <FormFieldShell
                error={errors.expiryDate?.message}
                id="expiryDate"
                label="Hạn sử dụng (HSD)"
              >
                <Input
                  aria-invalid={Boolean(errors.expiryDate)}
                  className="h-11 rounded-2xl bg-card"
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate")}
                />
              </FormFieldShell>
            </div>

            {/* Ngày sản xuất - NSX (chỉ hiện ở Fallback Form) */}
            {isFallbackMode && (
              <div className="grid gap-5 sm:grid-cols-2">
                <FormFieldShell
                  error={errors.manufacturedDate?.message}
                  id="manufacturedDate"
                  label="Ngày sản xuất (NSX)"
                >
                  <Input
                    aria-invalid={Boolean(errors.manufacturedDate)}
                    className="h-11 rounded-2xl bg-card"
                    id="manufacturedDate"
                    max={maxDate}
                    type="date"
                    {...register("manufacturedDate")}
                  />
                </FormFieldShell>
              </div>
            )}

            {/* Ghi chú */}
            <FormFieldShell
              error={errors.notes?.message}
              id="notes"
              label="Ghi chú"
            >
              <Textarea
                aria-invalid={Boolean(errors.notes)}
                className="min-h-24 rounded-2xl bg-card"
                id="notes"
                placeholder="Ví dụ: đã mở hộp, dùng cho bữa sáng"
                {...register("notes")}
              />
            </FormFieldShell>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              className="h-11 justify-center rounded-2xl"
              variant="outline"
              onClick={() => {
                // Quay lại bước đầu tiên thay vì thoát hẳn nếu muốn
                setStep("search");
              }}
            >
              <ArrowLeft aria-hidden={true} className="size-4" />
              Quay lại tìm kiếm
            </Button>

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                className="h-11 justify-center rounded-2xl px-5"
                disabled={isBusy}
                type="submit"
              >
                {isBusy ? (
                  <LoaderCircle
                    aria-hidden={true}
                    className="size-4 animate-spin motion-reduce:animate-none"
                  />
                ) : null}
                {isBusy ? "Đang lưu..." : "Lưu thực phẩm"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* ─── MODAL GIẢ LẬP QUÉT BARCODE ─── */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-3xl border bg-background p-6 shadow-xl flex flex-col items-center">
            <button
              onClick={() => setIsScanning(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-accent"
              type="button"
            >
              <X className="size-5" />
            </button>

            <Camera className="size-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold mb-1">Trình quét mã vạch</h3>
            <p className="text-xs text-muted-foreground text-center mb-6 max-w-sm">
              Đang mô phỏng camera điện thoại. Đưa nhãn mã vạch của sản phẩm vào khung ngắm để tự động nhận dạng.
            </p>

            {/* Viewport quét giả lập */}
            <div className="relative w-64 h-48 border-2 border-primary/60 rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center mb-6 shadow-inner">
              {/* Corner Brackets */}
              <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-primary" />

              {/* Laser Line */}
              <div className="absolute left-0 w-full h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" style={{
                animation: "scanLine 2.5s infinite ease-in-out"
              }} />
              
              <style>{`
                @keyframes scanLine {
                  0% { top: 10%; }
                  50% { top: 90%; }
                  100% { top: 10%; }
                }
              `}</style>

              <Barcode className="size-16 text-zinc-700 animate-pulse" />
            </div>

            <div className="w-full text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground block mb-3 text-center">
                Chọn nhãn mã vạch (click để mô phỏng quét)
              </span>
              <div className="grid gap-2 sm:grid-cols-2">
                {MOCK_CATALOG_PRODUCTS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSimulateScan(p)}
                    className="flex flex-col items-start p-3 text-left rounded-xl border bg-card hover:border-primary/50 transition-all hover:bg-accent/40 group"
                  >
                    <span className="text-xs font-semibold group-hover:text-primary">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 font-mono tracking-wider">Mã: {p.barcode}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              className="mt-6 w-full rounded-2xl"
              variant="outline"
              onClick={() => setIsScanning(false)}
            >
              Hủy bỏ
            </Button>
          </div>
        </div>
      )}

      <BarcodeScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onDetected={handleBarcodeDetected}
      />
    </div>
  );
}

function isFutureDate(value: string) {
  const date = parseDateInput(value);
  if (!date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date.getTime() > today.getTime();
}

function parseDateInput(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toAddFoodCategory(value: string): AddFoodCategory | null {
  return CATEGORY_OPTIONS.some((option) => option.value === value)
    ? (value as AddFoodCategory)
    : null;
}

function toAddFoodStorageLocation(
  value: string
): AddFoodStorageLocation | null {
  return STORAGE_LOCATION_OPTIONS.some((option) => option.value === value)
    ? (value as AddFoodStorageLocation)
    : null;
}
