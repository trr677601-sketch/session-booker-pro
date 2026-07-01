import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/logout")({
  head: () => ({
    meta: [
      { title: "Logging out — Alex Moreno" },
    ],
  }),
  component: LogoutPage,
});

function LogoutPage() {
  const navigate = useNavigate();
  const supabase = createClient();

  useEffect(() => {
    async function signOut() {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("You've been logged out.");
      }

      navigate({ to: "/" });
    }

    signOut();
  }, [navigate, supabase]);

  return null;
}
