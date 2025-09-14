import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function OfficialsDashboardPage() {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [comments, setComments] = useState({});
  const [signatures, setSignatures] = useState({});
  const [reports, setReports] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const pieChartRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        const dummyData = {
          petitions: [
            {
              id: 1,
              title: "Increase Planting of More Trees Near Ten Metro Cities",
              description: "Reduce the amount of pollution in air by planting more trees in urban areas.",
              category: "Environment",
              location: "Chennai",
              status: "active",
              signatureCount: 150,
            },
            {
              id: 2,
              title: "Creation of Separate Lane for Two Wheelers on Highways",
              description: "Improve road safety by creating dedicated lanes for motorcycles.",
              category: "Transportation",
              location: "Chennai",
              status: "under_review",
              signatureCount: 80,
            },
            {
              id: 3,
              title: "Regulation 2 of Separate Lane for Bicycles",
              description: "Encourage eco-friendly commuting with bike lanes.",
              category: "Transportation",
              location: "Chennai",
              status: "closed",
              signatureCount: 250,
            },
          ],
          petitionsInLocality: 3,
          pendingReviews: 1,
          resolvedPetitions: 2,
          user: {
            name: "Abc Official",
            role: "official",
            location: "Chennai",
          },
        };
        setData(dummyData);

        const dummyReports = {
          total_petitions: 3,
          active_petitions: 1,
          total_signatures: 480,
          polls: 0,
          change_petitions: "+20%",
          change_signatures: "+15%",
          change_polls: "0%",
          status_breakdown: { active: 1, under_review: 1, closed: 1 },
        };
        setReports(dummyReports);
      } catch (err) {
        console.error("Failed to load dummy data:", err);
        setError(err.message);
      }
    }, 1000);
  }, []);

  // Function to draw pie chart
  const drawPieChart = (ctx, data) => {
    if (!ctx) return;
    const statusData = data.status_breakdown;
    const total = Object.values(statusData).reduce((a, b) => a + b, 0);
    let startAngle = 0;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const [status, count] of Object.entries(statusData)) {
      const angle = (count / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(125, 125);
      ctx.arc(125, 125, 100, startAngle, startAngle + angle, false);
      ctx.fillStyle = status === "active" ? "#006a9a" : status === "under_review" ? "#0097cc" : "#ff6f61";
      ctx.fill();
      startAngle += angle;
    }
  };

  useEffect(() => {
    if (reports && pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext("2d");
      drawPieChart(pieCtx, reports);
    }
  }, [reports]);

  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!data) return <p className="p-6">Loading...</p>;

  const {
    petitions = [],
    petitionsInLocality = 0,
    pendingReviews = 0,
    resolvedPetitions = 0,
    user = {},
  } = data;

  const filteredPetitions =
    activeFilter === "All"
      ? petitions
      : petitions.filter((p) => p.status === activeFilter.toLowerCase().replace(" ", "_"));

  const handleStatusChange = async (petitionId, newStatus) => {
    setData((prevData) => ({
      ...prevData,
      petitions: prevData.petitions.map((p) =>
        p.id === petitionId ? { ...p, status: newStatus } : p
      ),
    }));
    setReports((prevReports) => {
      const newBreakdown = { ...prevReports.status_breakdown };
      newBreakdown[prevData.petitions.find(p => p.id === petitionId).status] -= 1;
      newBreakdown[newStatus] += 1;
      return { ...prevReports, status_breakdown: newBreakdown };
    });
    console.log(`Status changed for petition ${petitionId} to ${newStatus}`);
  };

  const handleCommentSubmit = async (petitionId) => {
    const comment = comments[petitionId];
    if (!comment) return;

    console.log(`Comment submitted for petition ${petitionId}: ${comment}`);
    setComments((prev) => ({ ...prev, [petitionId]: "" }));
  };

  const handleCommentChange = (petitionId, value) => {
    setComments((prev) => ({ ...prev, [petitionId]: value }));
  };

  const handleViewSignatures = async (petitionId) => {
    if (signatures[petitionId]) {
      setSignatures((prev) => ({ ...prev, [petitionId]: null }));
      return;
    }

    const dummySignatures = [
      { user_name: "Timothy", timestamp: "2025-09-10 14:30:00" },
      { user_name: "Smith", timestamp: "2025-09-11 09:15:00" },
      { user_name: "Johnson", timestamp: "2025-09-12 11:45:00" },
    ];
    setSignatures((prev) => ({ ...prev, [petitionId]: dummySignatures }));
  };

  return (
    <section className="flex flex-col min-h-screen">
      <section className="flex flex-1">
        <aside className="w-64 bg-[#006a9a] text-white p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-8">Civix</h2>
          <nav className="space-y-4">
            {[
              { name: "Dashboard", path: "/dashboard", icon: "🏠" },
              { name: "Petitions", path: "/petitions", icon: "📄" },
              { name: "Polls", path: "/polls", icon: "📊" },
              { name: "Reports", path: "/reports", icon: "📝" },
              { name: "Settings", path: "/settings", icon: "⚙️" },
              { name: "Help & Support", path: "/support", icon: "❓" },
            ].map((item, index) => (
              <Link
                key={`sidebar-${item.name}-${index}`} 
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
              {[
                { to: "/dashboard", label: "Home" },
                { to: "/petitions", label: "Petitions" },
                { to: "/polls", label: "Polls" },
                { to: "/reports", label: "Reports" },
              ].map((item, index) => (
                <Link
                  key={`nav-${item.to}-${index}`} 
                  to={item.to}
                  className="hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <section className="flex items-center space-x-2">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white text-[#006699] rounded-lg font-semibold hover:bg-gray-100"
              >
                Citizen Dashboard
              </Link>
              <span className="bg-white text-[#006699] rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </section>
          </header>

          <section className="p-8 flex-1">
            <h1 className="text-2xl font-bold">
              Welcome, {user.name || "Official"}!
            </h1>
            <p className="text-gray-600 mb-8">
              Manage petitions in your locality and respond to community concerns.
            </p>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <section className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg font-semibold mb-2">Petitions in Locality</h3>
                <p className="text-3xl font-bold text-[#006a9a]">{petitionsInLocality}</p>
              </section>
              <section className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
                <p className="text-3xl font-bold text-[#006a9a]">{pendingReviews}</p>
              </section>
              <section className="bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-lg font-semibold mb-2">Resolved Petitions</h3>
                <p className="text-3xl font-bold text-[#006a9a]">{resolvedPetitions}</p>
              </section>
            </section>

            <h2 className="text-xl font-bold mb-4">Full Reports and Analytics</h2>
            <section className="bg-white p-6 rounded-lg shadow mb-12">
              {reports ? (
                <div className="grid grid-cols-1 gap-6">
                  <div className="text-center">
                    <table className="w-full border-collapse mx-auto max-w-2xl">
                      <thead>
                        <tr>
                          <th className="border p-2">Metric</th>
                          <th className="border p-2">Value</th>
                          <th className="border p-2">Change from Last Month</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-2">Total Petitions</td>
                          <td className="border p-2">{reports.total_petitions}</td>
                          <td className="border p-2">{reports.change_petitions}</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Active Petitions</td>
                          <td className="border p-2">{reports.active_petitions}</td>
                          <td className="border p-2">{reports.change_active || "0%"}</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Total Signatures</td>
                          <td className="border p-2">{reports.total_signatures}</td>
                          <td className="border p-2">{reports.change_signatures}</td>
                        </tr>
                        <tr>
                          <td className="border p-2">Polls in Location</td>
                          <td className="border p-2">{reports.polls}</td>
                          <td className="border p-2">{reports.change_polls}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Petition Status Breakdown</h3>
                    <canvas ref={pieChartRef} width="250" height="250" className="mx-auto mb-4"></canvas>
                    <div className="flex justify-center space-x-4">
                      <div style={{ color: "#006a9a" }}>■ Active: {reports.status_breakdown.active}</div>
                      <div style={{ color: "#0097cc" }}>■ Under Review: {reports.status_breakdown.under_review}</div>
                      <div style={{ color: "#ff6f61" }}>■ Closed: {reports.status_breakdown.closed}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center">Loading reports...</p>
              )}
            </section>

            <h2 className="text-xl font-bold mb-4">Petitions in Your Locality</h2>
            <section className="flex space-x-4 mb-6 flex-wrap">
              {[
                "All",
                "Active",
                "Under Review",
                "Closed",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveFilter(status)}
                  className={`px-4 py-2 rounded-lg ${
                    activeFilter === status
                      ? "bg-[#006a9a] text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </section>

            <section className="bg-white p-6 rounded-lg shadow mb-12">
              {filteredPetitions.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No petitions found with current filters
                </p>
              ) : (
                <ul className="space-y-6">
                  {filteredPetitions.map((p) => (
                    <li key={p.id} className="p-4 border rounded">
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="text-gray-600">{p.description}</p>
                      <span className="text-sm text-gray-500 block mb-2">
                        Category: {p.category} | Signatures: {p.signatureCount} | Status: {p.status} | Location: {p.location}
                      </span>
                      <section className="flex flex-col space-y-2">
                        <select
                          value={p.status}
                          onChange={(e) => handleStatusChange(p.id, e.target.value)}
                          className="border p-2 rounded w-48"
                        >
                          <option value="active">Active</option>
                          <option value="under_review">Under Review</option>
                          <option value="closed">Closed</option>
                        </select>
                        <textarea
                          placeholder="Add a comment or response..."
                          value={comments[p.id] || ""}
                          onChange={(e) => handleCommentChange(p.id, e.target.value)}
                          className="border p-2 rounded"
                        />
                        <button
                          onClick={() => handleCommentSubmit(p.id)}
                          className="px-4 py-2 bg-[#006a9a] text-white rounded-lg w-48"
                        >
                          Submit Response
                        </button>
                        <button
                          onClick={() => handleViewSignatures(p.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg w-48"
                        >
                          {signatures[p.id] ? "Hide Signatures" : "View Signatures"}
                        </button>
                        {signatures[p.id] && (
                          <ul className="space-y-1 mt-2">
                            {signatures[p.id].map((sig, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                {sig.user_name} - {sig.timestamp}
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {activeFilter !== "All" && (
              <section className="text-center mt-6 mb-12">
                <button
                  onClick={() => setActiveFilter("All")}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Clear Filters
                </button>
              </section>
            )}
          </section>
        </section>
      </section>

      <footer className="bg-gradient-to-r from-[#006a9a] to-[#0097cc] text-white p-6">
        <section className="flex justify-between flex-col md:flex-row max-w-7xl mx-auto">
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
      </footer>
    </section>
  );
}