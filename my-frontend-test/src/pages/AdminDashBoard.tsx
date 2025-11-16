import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        navigate("/admin/login");
        return;
      }

      const data = await response.json();

      // Check if user is admin
      if (data.role !== "admin") {
        navigate("/login");
        return;
      }

      setUser(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      credentials: "include",
    });
    navigate("/admin/login");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <div
        style={{ background: "#ffe6e6", padding: "20px", borderRadius: "8px" }}
      >
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
        <p style={{ color: "red", fontWeight: "bold" }}>⚡ Admin Access</p>
      </div>
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Logout
      </button>
    </div>
  );
}
