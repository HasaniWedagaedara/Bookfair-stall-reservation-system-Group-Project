import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Login failed");
        return;
      }

      const user = await response.json();
      console.log("Logged in:", user);
      navigate("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>User Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        <a href="/admin/login">Admin Login</a> |{" "}
        <a href="/register">Register</a>
      </p>
    </div>
  );
}
