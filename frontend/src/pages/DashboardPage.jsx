import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { PetitionContext } from "../contexts/PetitionContext";
import { apiFetch } from "../utils/api";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const { petitions, loading: petitionsLoading, error: petitionsError } = useContext(PetitionContext);
  const [dashboardData, setDashboardData] = useState({
    myPetitions: 0,
    successfulPetitions: 0,
    pollsCreated: 0,
  });
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch("http://localhost:5000/api/dashboard");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to load dashboard");
        }
        const data = await res.json();
        const successfulCount = petitions.filter(
          (p) => p.user?._id?.toString() === user?.id?.toString() && p.signatures >= p.signatureGoal
        ).length;
        setDashboardData({
          myPetitions: data.userPetitions || 0,
          successfulPetitions: successfulCount,
          pollsCreated: 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (user && !authLoading) {
      loadDashboard();
    }
  }, [user, authLoading, petitions]);

  const filteredPetitions =
    activeFilter === "All"
      ? petitions
      : petitions.filter((p) => p.category === activeFilter);

  if (authLoading || loading || petitionsLoading) {
    return (
      <section className="flex min-h-screen bg-gray-50 justify-center items-center">
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (error || petitionsError) {
    return (
      <section className="flex min-h-screen bg-gray-50 justify-center items-center">
        <p className="text-red-500">Error: {error || petitionsError}</p>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-[#006a9a] text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Civix</h2>
        <nav className="space-y-4">
          {[
            { name: "Dashboard", path: "/dashboard", icon: "🏠" },
            { name: "Petitions", path: "/petitions", icon: "📄" },
            { name: "Polls", path: "/polls", icon: "📊" },
            { name: "Reports", path: "/reports", icon: "📝" },
            { name: "Settings", path: "/settings", icon: "⚙️" },
            { name: "Help & Support", path: "/help", icon: "❓" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition ${
                location.pathname === item.path
                  ? "bg-white text-[#006a9a] font-semibold"
                  : "hover:bg-[#0097cc]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-600 w-full text-left"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <section className="flex-1 flex flex-col">
        <header className="bg-[#006699] text-white flex justify-between items-center px-6 py-3">
          <nav className="flex-1 flex justify-center space-x-6 text-lg">
            <Link to="/dashboard" className="hover:underline">Home</Link>
            <Link to="/petitions" className="hover:underline">Petitions</Link>
            <Link to="/polls" className="hover:underline">Polls</Link>
            <Link to="/reports" className="hover:underline">Reports</Link>
          </nav>
          <section className="flex items-center space-x-2">
            <span className="bg-white text-[#006699] rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </section>
        </header>

        <section className="p-8 flex-1">
          <h1 className="text-2xl font-bold">
            Welcome, {user.name || "User"}!
          </h1>
          <p className="text-gray-600 mb-8">
            See what’s happening in your community and make your voice heard.
          </p>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <section className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">My Petitions</h3>
              <p className="text-3xl font-bold text-[#006a9a]">{dashboardData.myPetitions}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">Successful Petitions</h3>
              <p className="text-3xl font-bold text-[#006a9a]">{dashboardData.successfulPetitions}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">Polls Created</h3>
              <p className="text-3xl font-bold text-[#006a9a]">{dashboardData.pollsCreated}</p>
            </section>
          </section>

          <h2 className="text-xl font-bold mb-4">Active Petitions Near You</h2>
          <section className="flex space-x-4 mb-6 flex-wrap">
            {[
              "All",
              "Environment",
              "Infrastructure",
              "Education",
              "Public Safety",
              "Transportation",
              "Healthcare",
              "Housing",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-lg ${
                  activeFilter === cat
                    ? "bg-[#006a9a] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </section>

          <section className="bg-white p-6 rounded-lg shadow">
            {filteredPetitions.length === 0 ? (
              <p className="text-gray-600 text-center">
                No petitions found with current filters
              </p>
            ) : (
              <ul className="space-y-4">
                {filteredPetitions.map((p) => (
                  <li key={p._id} className="p-4 border rounded">
                    <Link to={`/petitions/${p._id}`} className="hover:underline">
                      <h3 className="font-bold">{p.title}</h3>
                    </Link>
                    <p className="text-gray-600">{p.description || "No description available"}</p>
                    <span className="text-sm text-gray-500">
                      Category: {p.category} | Signatures: {p.signatures || 0}/{p.signatureGoal || 0}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {activeFilter !== "All" && (
            <section className="text-center mt-6">
              <button
                onClick={() => setActiveFilter("All")}
                className="px-6 py-2 border rounded-lg hover:bg-gray-100"
              >
                Clear Filters
              </button>
            </section>
          )}
        </section>

        <section className="bg-gradient-to-r from-[#006a9a] to-[#0097cc] text-white p-6">
          <section className="flex justify-between flex-col md:flex-row">
            <p>© 2025 Civix. All rights reserved.</p>
            <section className="space-x-4">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/support">Support</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}