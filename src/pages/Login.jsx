import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { loginWithEmail, loginWithGoogle, signUpWithEmail, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await loginWithEmail({ email, password });
      else await signUpWithEmail({ name, email, password, role: "public" });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream dark:bg-flame-950">
      <div className="bg-flame-950 px-6 py-6 text-center">
        <p className="text-xs font-bold tracking-widest text-gold-500">VOLTA GHANA MISSION</p>
        <h1 className="font-display mt-1 text-2xl text-white">Ignite Hope Digital Evangelism</h1>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {!isFirebaseConfigured && (
            <p className="mb-6 rounded-md bg-gold-100 px-3 py-2 text-center text-xs text-gold-600">
              Demo mode — create an account below, or ask an admin for staff credentials.
            </p>
          )}
          <div className="mb-5 flex rounded-md border border-flame-100 dark:border-flame-800 overflow-hidden text-sm">
            <button onClick={() => setMode("login")} className={`flex-1 py-2 ${mode === "login" ? "bg-flame-900 text-white" : "bg-white dark:bg-flame-900/40 text-ink dark:text-flame-100"}`}>Sign in</button>
            <button onClick={() => setMode("signup")} className={`flex-1 py-2 ${mode === "signup" ? "bg-flame-900 text-white" : "bg-white dark:bg-flame-900/40 text-ink dark:text-flame-100"}`}>New account</button>
          </div>

          <button onClick={handleGoogle} className="mb-4 flex w-full items-center justify-center gap-2 rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-4 py-2.5 text-sm font-medium text-ink dark:text-flame-100 hover:bg-flame-50 dark:hover:bg-flame-800">
            Continue with Google
          </button>
          <div className="mb-4 flex items-center gap-3 text-xs text-ink-soft">
            <div className="h-px flex-1 bg-flame-100 dark:bg-flame-800" /> or <div className="h-px flex-1 bg-flame-100 dark:bg-flame-800" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3" autoComplete="on">
            {mode === "signup" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
                name="name" autoComplete="name"
                className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm text-ink dark:text-flame-50" />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
              name="email" autoComplete="username"
              className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm text-ink dark:text-flame-50" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
              name="password" autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-md border border-flame-100 dark:border-flame-800 bg-white dark:bg-flame-900/40 px-3 py-2 text-sm text-ink dark:text-flame-50" />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button type="submit" disabled={busy}
              className="w-full rounded-md bg-flame-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-flame-800 disabled:opacity-50">
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-ink-soft dark:text-flame-200">
            Just here to give or ask a question? <Link to="/give" className="text-flame-700 dark:text-gold-500 hover:underline">Continue without an account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
