import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_user/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Alex Moreno" },
      { name: "description", content: "Your personal dashboard." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">My Dashboard</h1>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="outline" size="sm">Admin Panel</Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {profile?.full_name || "—"}</p>
            <p><span className="text-muted-foreground">Email:</span> {user?.email}</p>
            <p>
              <span className="text-muted-foreground">Role:</span>{" "}
              <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs font-medium">
                {profile?.role || "user"}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Status</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.role === "admin" && (
              <p className="text-sm text-muted-foreground">
                You have full admin access.{" "}
                <Link to="/admin" className="text-primary underline-offset-4 hover:underline">
                  Go to Admin Panel
                </Link>
              </p>
            )}
            {profile?.role === "client" && (
              <p className="text-sm text-muted-foreground">
                You're registered as a client. View your bookings and manage your profile here.
              </p>
            )}
            {profile?.role === "user" && (
              <p className="text-sm text-muted-foreground">
                Welcome! Book your first session to become a client and unlock more features.
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
