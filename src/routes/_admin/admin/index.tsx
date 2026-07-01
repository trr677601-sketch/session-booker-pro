import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth, type Profile } from "@/providers/auth-provider";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Alex Moreno" },
      { name: "description", content: "Admin panel." },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const supabase = createClient();
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setAllProfiles(data as Profile[]);
      });
  }, []);

  async function handleLogout() {
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">My Dashboard</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{allProfiles.length}</CardTitle>
              <CardDescription>Total Users</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {allProfiles.filter((p) => p.role === "admin").length}
              </CardTitle>
              <CardDescription>Admins</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {allProfiles.filter((p) => p.role === "user" || p.role === "client").length}
              </CardTitle>
              <CardDescription>Users & Clients</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Profiles</CardTitle>
            <CardDescription>
              Logged in as <span className="font-medium text-foreground">{user?.email}</span> (role: {profile?.role})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allProfiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No profiles found. Sign up users to see them here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Name</th>
                      <th className="pb-2 pr-4 font-medium">Email</th>
                      <th className="pb-2 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProfiles.map((p) => (
                      <tr key={p.id} className="border-b border-border/50">
                        <td className="py-2 pr-4">{p.full_name || "—"}</td>
                        <td className="py-2 pr-4 text-muted-foreground">{p.email}</td>
                        <td className="py-2">
                          <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs font-medium">
                            {p.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
