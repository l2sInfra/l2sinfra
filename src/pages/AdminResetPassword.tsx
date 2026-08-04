import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { applySEO } from "@/lib/seo";

/**
 * The route the password-recovery email points at.
 *
 * `auth.tsx` has always sent `redirectTo: /admin/reset-password`, but no such
 * route existed — it fell through to the catch-all and rendered the admin
 * console. So a recovery link silently consumed its token, established a
 * session, and dropped the user into the dashboard with no way to actually
 * change their password. The "Forgot password?" flow was decorative.
 */
export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"ready" | "saving" | "done">("ready");
  const [error, setError] = useState("");

  useEffect(() => {
    applySEO({ title: "Set a new password | L2S Infra", path: "/admin/reset-password", noindex: true });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 12) {
      setError("Use at least 12 characters. Length matters more than symbols.");
      return;
    }
    if (password !== confirm) {
      setError("Those two passwords don't match.");
      return;
    }

    setStatus("saving");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setStatus("ready");
      setError("That didn't save. The reset link may have expired — request a new one.");
      return;
    }

    setStatus("done");
    setTimeout(() => navigate("/admin"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Set a new password</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Choose something long. You'll be signed in straight afterwards.
        </p>

        {status === "done" ? (
          <p role="status" className="text-sm text-foreground bg-muted border border-border rounded-lg p-4">
            Password updated. Taking you to the admin console…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-2">
                New password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-lg pl-10 pr-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
                Confirm it
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {status === "saving" ? "Saving…" : "Save password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
