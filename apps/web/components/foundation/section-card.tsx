import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionCard({
  title,
  description,
  eyebrow,
  action,
  children,
  footer,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn("rounded-2xl border bg-card shadow-sm", className)}>
      {title || description || eyebrow || action ? (
        <CardHeader className="gap-2 px-5 pt-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {eyebrow ? (
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <CardTitle className="text-xl font-semibold leading-tight">
                  {title}
                </CardTitle>
              ) : null}
              {description ? (
                <CardDescription className="mt-2 max-w-2xl leading-6">
                  {description}
                </CardDescription>
              ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
          </div>
        </CardHeader>
      ) : null}
      <CardContent className={cn("px-5 pb-5 sm:px-6", contentClassName)}>
        {children}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}
