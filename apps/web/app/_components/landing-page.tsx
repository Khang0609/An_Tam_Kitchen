"use client";

import {
  ArrowRight,
  BellRing,
  CalendarDays,
  ClipboardCheck,
  Lock,
  MapPin,
  Plus,
  Refrigerator,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ComponentType } from "react";
import { AppHeader, FoodStatusBadge } from "@/components/foundation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthRequiredHref, useAuthHint } from "@/lib/auth-session";
import { cn } from "@/lib/utils";
import { DigitalFridgeDashboard } from "./digital-fridge-dashboard";

type Feature = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

type FoodRow = {
  name: string;
  location: string;
  note: string;
  status: "safe" | "use_soon" | "check" | "avoid";
};

const features: Feature[] = [
  {
    title: "Ghi nhớ ngày mở nắp",
    description:
      "Lưu ngày mở nắp, hạn dùng trên bao bì và ghi chú cần nhớ cho từng món trong một màn hình.",
    icon: CalendarDays,
  },
  {
    title: "Ưu tiên món cần dùng sớm",
    description:
      "Sắp xếp danh sách theo trạng thái khuyến nghị để cả nhà nhìn nhanh món nên xem trước.",
    icon: ClipboardCheck,
  },
  {
    title: "Nhắc nhở theo vị trí bảo quản",
    description:
      "Theo dõi riêng ngăn mát, ngăn đông và nhiệt độ phòng để gợi ý đúng ngữ cảnh hơn.",
    icon: BellRing,
  },
];

const steps = [
  {
    title: "Quét hoặc chọn sản phẩm",
    description: "Bắt đầu từ barcode hoặc nhập tay tên sản phẩm trong vài giây.",
    icon: ScanLine,
  },
  {
    title: "Nhập ngày mở nắp",
    description: "Thêm ngày mở nắp, vị trí bảo quản và hạn dùng nếu có trên bao bì.",
    icon: CalendarDays,
  },
  {
    title: "Xem trạng thái khuyến nghị",
    description: "Theo dõi nhãn trạng thái bằng chữ rõ ràng, không chỉ dựa vào màu.",
    icon: ClipboardCheck,
  },
];

const foodRows: FoodRow[] = [
  {
    name: "Sữa tươi",
    location: "Ngăn mát",
    note: "Mở 2 ngày trước",
    status: "use_soon",
  },
  {
    name: "Tương cà",
    location: "Nhiệt độ phòng",
    note: "Còn trong mốc tham chiếu",
    status: "safe",
  },
  {
    name: "Xúc xích",
    location: "Ngăn mát",
    note: "Nên kiểm tra trước khi dùng",
    status: "check",
  },
];

export function LandingPage() {
  const reduceMotion = useReducedMotion();
  const hasAuth = useAuthHint();
  const addFoodHref = hasAuth
    ? "/foods/new"
    : getAuthRequiredHref("/foods/new");
  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppHeader />

      <main>
        <section className="border-b bg-[linear-gradient(180deg,var(--background)_0%,var(--card)_100%)]">
          <div className="mx-auto grid max-w-7xl gap-9 px-4 py-9 sm:px-6 sm:py-14 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-8 lg:py-16">
            <motion.div {...motionProps} className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-primary shadow-sm">
                <Sparkles aria-hidden="true" className="size-4" />
                Web demo tủ lạnh số cho gia đình
              </p>

              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Biết món nào nên dùng trước trong tủ lạnh của bạn
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8">
                Bếp An Tâm giúp theo dõi thực phẩm đã mở nắp, nhắc hạn dùng và
                giảm lãng phí trong gia đình mà vẫn để người dùng tự kiểm tra
                thực phẩm trước khi sử dụng.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 justify-center rounded-2xl px-5 text-base shadow-sm"
                >
                  <a href="#digital-fridge">
                    Xem tủ lạnh số
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  className="h-12 justify-center rounded-2xl px-5 text-base"
                  variant="outline"
                >
                  <Link href={addFoodHref}>
                    <Plus aria-hidden="true" className="size-4" />
                    Thêm thực phẩm
                  </Link>
                </Button>
              </div>

              <div className="mt-7 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {["Ngày mở nắp", "Vị trí bảo quản", "Khuyến nghị tham khảo"].map(
                  (item) => (
                    <div
                      className="rounded-2xl border bg-card px-4 py-3 shadow-sm"
                      key={item}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </motion.div>

            <motion.div
              {...motionProps}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 0.5,
                      delay: 0.08,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }
              }
            >
              {hasAuth ? <DashboardMockup /> : <LockedHeroPreview />}
            </motion.div>
          </div>
        </section>

        {hasAuth ? <DigitalFridgeDashboard /> : <LockedDigitalFridgePrompt />}

        <section className="scroll-mt-20 bg-card py-12 sm:py-16" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow="Tính năng chính"
              title="Một màn hình đủ rõ cho việc quản lý hằng ngày"
              description="Trang demo tập trung vào thao tác gia đình thật sự cần: nhớ món đã mở, xem món cần ưu tiên và nhận nhắc nhở theo nơi bảo quản."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  {...motionProps}
                  key={feature.title}
                  transition={
                    reduceMotion
                      ? undefined
                      : {
                          duration: 0.4,
                          delay: index * 0.06,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }
                  }
                >
                  <FeatureCard feature={feature} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="scroll-mt-20 bg-background py-12 sm:py-16" id="add-food">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow="3 bước sử dụng"
              title="Từ món vừa mở nắp đến trạng thái khuyến nghị"
              description="Luồng demo ngắn, dễ trình bày với giám khảo và đủ gần với cách một gia đình dùng sản phẩm."
            />

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    {...motionProps}
                    key={step.title}
                    transition={
                      reduceMotion
                        ? undefined
                        : {
                            duration: 0.4,
                            delay: index * 0.06,
                            ease: [0.22, 1, 0.36, 1] as const,
                          }
                    }
                  >
                    <article className="h-full rounded-3xl border bg-card p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                          <Icon aria-hidden={true} className="size-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            Bước {index + 1}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t bg-card py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Bếp An Tâm
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Giữ căn bếp dễ theo dõi hơn, từng món một.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Bếp An Tâm không thay người dùng tự đánh giá thực phẩm, nhưng giúp
              thông tin về ngày mở nắp, hạn dùng và vị trí bảo quản rõ ràng hơn.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-2xl px-5 text-base">
                <a href="#digital-fridge">Xem tủ lạnh số</a>
              </Button>
              <Button
                asChild
                className="h-12 rounded-2xl px-5 text-base"
                variant="outline"
              >
                <Link href={addFoodHref}>Thêm thực phẩm</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function LockedDigitalFridgePrompt() {
  const loginHref = getAuthRequiredHref("/#digital-fridge");

  return (
    <section className="scroll-mt-20 bg-card py-12 sm:py-16" id="digital-fridge">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="rounded-3xl border bg-background shadow-sm">
          <CardHeader className="items-center px-5 pt-8 text-center sm:px-8 sm:pt-10">
            <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Lock aria-hidden={true} className="size-5" />
            </span>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Tủ lạnh số
            </p>
            <CardTitle className="mt-2 text-2xl font-semibold leading-tight tracking-normal sm:text-3xl">
              Đăng nhập để xem tủ lạnh số của bạn
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              Theo dõi thực phẩm đã mở nắp, hạn dùng và món nên dùng trước sau
              khi đăng nhập.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-8 sm:px-8 sm:pb-10">
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild className="h-11 rounded-2xl px-5">
                <Link href={loginHref}>Đăng nhập</Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-2xl px-5"
                variant="outline"
              >
                <Link href="/signup">Đăng ký</Link>
              </Button>
              <Button
                asChild
                className="h-11 rounded-2xl px-5"
                variant="secondary"
              >
                <Link href={loginHref}>Dùng thử tài khoản khách</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function LockedHeroPreview() {
  return (
    <div className="rounded-[2rem] border bg-card p-5 shadow-[0_24px_70px_rgba(15,75,54,0.12)] sm:p-6">
      <div className="rounded-[1.5rem] border bg-background p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Refrigerator aria-hidden={true} className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Tủ lạnh số cá nhân
            </p>
            <h2 className="font-heading text-lg font-semibold">
              Mở sau khi đăng nhập
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Dashboard cá nhân sẽ hiển thị danh sách thực phẩm, hạn dùng và gợi ý
          ưu tiên sau khi bạn đăng nhập hoặc dùng tài khoản khách.
        </p>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          {["Thực phẩm của bạn", "Hạn dùng", "Món nên dùng trước"].map((item) => (
            <div
              className="rounded-2xl border bg-card px-3 py-3 text-center font-medium text-muted-foreground"
              key={item}
            >
              {item}
            </div>
          ))}
        </div>

        <Button asChild className="mt-6 h-11 w-full rounded-2xl">
          <a href="#digital-fridge">
            Xem cách bắt đầu
            <ArrowRight aria-hidden={true} className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="rounded-[2rem] border bg-card p-3 shadow-[0_24px_70px_rgba(15,75,54,0.16)] sm:p-4">
      <div className="overflow-hidden rounded-[1.5rem] border bg-background">
        <div className="flex items-center justify-between border-b bg-card px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Refrigerator aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Tủ lạnh số
              </p>
              <h2 className="font-heading text-lg font-semibold">
                Bếp hôm nay
              </h2>
            </div>
          </div>
          <FoodStatusBadge status="use_soon" />
        </div>

        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-3xl border bg-card p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Khu vực bảo quản</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Cập nhật theo dữ liệu thực
                </p>
              </div>
              <MapPin aria-hidden="true" className="size-5 text-primary" />
            </div>

            <div className="space-y-3">
              {[
                ["Ngăn mát", "6 món"],
                ["Ngăn đông", "2 món"],
                ["Nhiệt độ phòng", "3 món"],
              ].map(([area, count]) => (
                <div
                  className="flex items-center justify-between rounded-2xl border bg-background px-3 py-3 text-sm"
                  key={area}
                >
                  <span className="font-medium">{area}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {foodRows.map((item) => (
              <div
                className="rounded-3xl border bg-card px-4 py-3 shadow-sm"
                key={item.name}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.location} · {item.note}
                    </p>
                  </div>
                  <FoodStatusBadge status={item.status} />
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-dashed bg-accent/40 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-card text-primary">
                  <Plus aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">Thêm thực phẩm</p>
                  <p className="text-sm text-muted-foreground">
                    Quét mã hoặc nhập tay trong vài bước.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <Card className="h-full rounded-3xl border bg-background shadow-sm transition hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Icon aria-hidden={true} className="size-5" />
        </div>
        <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
        <CardDescription className="text-base leading-7">
          {feature.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-normal sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  );
}
