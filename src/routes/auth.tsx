import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand/public-shell";
import { ThemeToggle } from "@/components/brand/theme";
import { meta } from "@/lib/business";
export const Route = createFileRoute("/auth")({
  head: () => meta("Owner Sign In", "Secure access to the Braiding By Me business dashboard."),
  component: Auth,
});
function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) nav({ to: "/dashboard" });
    });
  }, [nav]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setMessage("Check your email for a password reset link.");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/auth" },
        });
        if (error) throw error;
        if (data.session) nav({ to: "/dashboard" });
        else setMessage("Check your email to confirm your account before signing in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/dashboard" });
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="min-h-screen bg-muted">
      <div className="wrap py-6 flex justify-between">
        <Link to="/">
          <Brand />
        </Link>
        <ThemeToggle />
      </div>
      <div className="max-w-md mx-auto p-7 mt-10">
        <div className="eyebrow text-rose">A little organisation, a lot of possibilities</div>
        <h1 className="script text-5xl mt-5">Your business space ♡</h1>
        <p className="text-sm text-muted-foreground mb-7">
          Owner access only. Customer bookings stay private.
        </p>
        <form onSubmit={submit} className="space-y-5">
          <label className="field">
            Email
            <input
              required
              type="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {mode !== "reset" && (
            <label className="field">
              Password
              <input
                required
                minLength={8}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}
          {message && (
            <p className="notice" role="status">
              {message}
            </p>
          )}
          <Button disabled={busy} className="w-full">
            {busy
              ? "Please wait…"
              : mode === "login"
                ? "Sign In"
                : mode === "signup"
                  ? "Create Owner Account"
                  : "Send Reset Link"}
          </Button>
        </form>
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={async () => {
            const r = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin + "/auth",
            });
            if (r.error) setMessage(r.error.message);
            else if (!r.redirected) nav({ to: "/dashboard" });
          }}
        >
          Continue with Google
        </Button>
        <div className="flex justify-between mt-4">
          <Button variant="link" onClick={() => setMode(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "Sign in instead" : "Create account"}
          </Button>
          <Button variant="link" onClick={() => setMode("reset")}>
            Forgot password?
          </Button>
        </div>
      </div>
    </main>
  );
}
