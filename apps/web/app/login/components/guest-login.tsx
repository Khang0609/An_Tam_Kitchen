import { Loader2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type GuestLoginProps = {
  isGuestLoading: boolean;
  anyLoading: boolean;
  onClick: () => void;
};

export function GuestLogin({ isGuestLoading, anyLoading, onClick }: GuestLoginProps) {
  return (
    <Button
      className="h-9 w-full"
      disabled={anyLoading}
      onClick={onClick}
      type="button"
      variant="secondary"
    >
      {isGuestLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Đang vào...
        </>
      ) : (
        <>
          <UserRound className="size-4" />
          Dùng tài khoản khách
        </>
      )}
    </Button>
  );
}
