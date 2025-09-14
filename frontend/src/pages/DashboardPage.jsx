
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../utils/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const location = useLocation();

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("http://localhost:5000/api/dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    }
    load();
  }, []);

  if (!data) return <p className="p-6">Loading...</p>;

  const {
    petitions = [],
    myPetitions = 0,
    successfulPetitions = 0,
    pollsCreated = 0,
    user = {}, 
  } = data;

  const filteredPetitions =
    activeFilter === "All"
      ? petitions
      : petitions.filter((p) => p.category === activeFilter);

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
            { name: "Settings", path: "/reports", icon: "⚙️" },
            { name: "Help & Support", path: "/reports", icon: "❓" },
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
          <section className="flex items-center space-x-4">
            <Link
              to="/officials-dashboard"
              className="px-4 py-2 bg-white text-[#006699] rounded-lg hover:bg-gray-200"
            >
              Officials Dashboard
            </Link>
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
              <p className="text-3xl font-bold text-[#006a9a]">{myPetitions}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">Successful Petitions</h3>
              <p className="text-3xl font-bold text-[#006a9a]">{successfulPetitions}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold mb-2">Polls Created</h3>
              <p className="text-3xl font-bold text-[#006a9a]">{pollsCreated}</p>
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
                {filteredPetitions.map((p, idx) => (
                  <li key={idx} className="p-4 border rounded">
                    <h3 className="font-bold">{p.title}</h3>
                    <p className="text-gray-600">{p.description}</p>
                    <span className="text-sm text-gray-500">
                      Category: {p.category}
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
              <a href="#">Home</a>
              <a href="#">About Us</a>
              <a href="#">Services</a>
              <a href="#">Contact</a>
              <a href="#">Support</a>
              <a href="#">Privacy Policy</a>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}