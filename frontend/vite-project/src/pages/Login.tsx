import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  "https://job-application-tracker-wiqx.onrender.com/api/v1/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    navigate("/");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-6 rounded-xl w-80 space-y-3"
      >
        <h1 className="text-xl font-bold">Login</h1>

        <input
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 bg-zinc-800 rounded"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-amber-500 text-black p-2 rounded font-bold">
          Login
        </button>

        <p
          className="text-xs text-zinc-400 text-center cursor-pointer"
          onClick={() => navigate("/register")}
        >
          No account? Register
        </p>
      </form>
    </div>
  );
}
