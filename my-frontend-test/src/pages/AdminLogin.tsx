import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/auth/admin/login", {
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
      console.log("Admin logged in:", user);
      navigate("/admin/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Admin Email"
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
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#dc3545",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login as Admin
        </button>
      </form>
      <p style={{ marginTop: "20px" }}>
        User? <a href="/login">User Login</a>
      </p>
    </div>
  );
}
