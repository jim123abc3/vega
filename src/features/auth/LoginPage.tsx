import { type FormEvent, useState } from "react";
import { useAuth } from "./authContext";
import { useNavigate, useLocation } from "react-router-dom";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validCredentials = await login(username, password);
    if (!validCredentials) {
      setError("Invalid credentials");
    } else {
      setError(null);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-bg) text-(--color-text)">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-(--color-surface) rounded-lg p-6 shadow border border-(--color-border)"
      >
        <h1 className="text-lg font-semibold mb-4 text-(--color-primary)">
          Sign in
        </h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="w-full rounded border border-(--color-border) bg-(--color-surface-alt) px-3 py-2 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded border border-(--color-border) bg-(--color-surface-alt) px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded bg-(--color-primary) text-xs font-semibold py-2 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}
