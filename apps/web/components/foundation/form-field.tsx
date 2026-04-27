import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldShellProps = {
  id: string;
  label: string;
  children: ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export function FormFieldShell({
  id,
  label,
  children,
  description,
  error,
  required = false,
  className,
}: FormFieldShellProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label className="text-sm font-semibold text-foreground" htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {description ? (
        <p className="text-xs leading-5 text-muted-foreground" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium leading-5 text-destructive" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
