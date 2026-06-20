import { ReactNode } from "react";
import { Leaf } from "lucide-react";
import { AppHeader } from "./app-header";

type AuthLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Leaf aria-hidden="true" className="size-7" />
            </span>
            <div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                {title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          {children}

          {footer}
        </div>
      </main>
    </div>
  );
}
