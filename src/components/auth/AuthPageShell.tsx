import { Suspense } from "react";
import { AuthOverlayForm } from "@/components/auth/AuthOverlayForm";

export function AuthPageShell({ mode }: { mode: "login" | "register" }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary text-white">
          Chargement…
        </div>
      }
    >
      <AuthOverlayForm initialMode={mode} />
    </Suspense>
  );
}
