import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireClient?: boolean;
}

export function AuthGuard({ children, requireAdmin, requireClient }: AuthGuardProps) {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate({ to: "/login" });
      return;
    }

    if (profile?.role === "banned") {
      navigate({ to: "/" });
      return;
    }

    if (requireAdmin && profile?.role !== "admin") {
      navigate({ to: "/" });
      return;
    }

    if (requireClient && profile?.role === "user") {
      navigate({ to: "/dashboard" });
      return;
    }
  }, [user, profile, isLoading, requireAdmin, requireClient, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (profile?.role === "banned") return null;

  if (requireAdmin && profile?.role !== "admin") return null;

  if (requireClient && profile?.role === "user") return null;

  return <>{children}</>;
}
