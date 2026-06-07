import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL =
  "https://job-application-tracker-wiqx.onrender.com/api/v1/auth";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Account created");
    navigate("/login");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-zinc-900 p-6 rounded-xl w-80 space-y-3"
      >
        <h1 className="text-xl font-bold">Register</h1>

        <input
          placeholder="username, just write anything"
          className="w-full p-2 bg-zinc-800 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="email, just write anything"
          className="w-full p-2 bg-zinc-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="password, just write anything "
          type="password"
          className="w-full p-2 bg-zinc-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-amber-500 text-black p-2 rounded font-bold">
          Create account
        </button>

        <p
          className="text-xs text-zinc-400 text-center cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have account?
        </p>
      </form>
    </div>
  );
}
