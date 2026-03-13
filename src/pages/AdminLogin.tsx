import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError("Invalid email or password. Please try again.");
    } else {
      navigate("/admin");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setError("Could not send reset email. Please check the address.");
    } else {
      setSuccess("Password reset email sent. Please check your inbox.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span className="font-heading text-3xl font-bold" style={{ color: "#f9fafb" }}>
            L2S <span className="text-gradient-gold">Infra</span>
          </span>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.5rem" }}>Admin Panel</p>
        </div>

        <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "1rem", padding: "2rem", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
          <h1 className="font-heading" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f9fafb", marginBottom: "1.5rem" }}>
            {mode === "login" ? "Sign In" : "Reset Password"}
          </h1>

          {error && (
            <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: "0.875rem", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80", fontSize: "0.875rem", borderRadius: "0.5rem", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              {success}
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleForgot} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "0.5rem", paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontSize: "0.875rem", color: "#f9fafb", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {mode === "login" && (
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%", backgroundColor: "#0f172a", border: "1px solid #475569", borderRadius: "0.5rem", paddingLeft: "2.5rem", paddingRight: "2.5rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", fontSize: "0.875rem", color: "#f9fafb", outline: "none", boxSizing: "border-box" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", backgroundColor: "#b8963e", color: "#fff", padding: "0.75rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Send Reset Email"}
            </button>
          </form>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            {mode === "login" ? (
              <button
                onClick={() => { setMode("forgot"); setError(""); }}
                style={{ fontSize: "0.875rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
              >
                Forgot password?
              </button>
            ) : (
              <button
                onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                style={{ fontSize: "0.875rem", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
              >
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
