import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { PetitionContext } from "../contexts/PetitionContext";
import { AuthContext } from "../contexts/AuthContext";
import { apiFetch } from "../utils/api";

function AllPetitions() {
  const { petitions, signPetition, fetchPetitions, loading, error } = useContext(PetitionContext);
  const { user } = useContext(AuthContext);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedPetitionId, setSelectedPetitionId] = useState(null);
  const sigCanvas = useRef(null);
  const navigate = useNavigate();

  // State for user-specific petitions
  const [userPetitions, setUserPetitions] = useState([]);
  const [signedPetitions, setSignedPetitions] = useState([]);

  useEffect(() => {
    fetchPetitions();
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const userRes = await apiFetch("http://localhost:5000/api/petitions/user", {
        headers: { Authorization: `Bearer ${user.token}` }, // Add token if required
      });
      const signedRes = await apiFetch("http://localhost:5000/api/petitions/signed", {
        headers: { Authorization: `Bearer ${user.token}` }, // Add token if required
      });
      if (userRes.ok) setUserPetitions(await userRes.json());
      if (signedRes.ok) setSignedPetitions(await signedRes.json());
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const handleSaveSignature = async () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature before saving.");
      return;
    }
    try {
      await signPetition(selectedPetitionId, sigCanvas.current.toDataURL());
      setShowSignatureModal(false);
      sigCanvas.current.clear();
      fetchPetitions();
      fetchUserData();
    } catch (err) {
      alert("Failed to sign petition: " + err.message);
    }
  };


const handleSignPetition = async () => {
  if (!user) {
    alert("Please log in to sign");
    navigate("/login");
    return;
  }
  try {
    const signatureData = "data:image/png;base64,..."; // Placeholder, to be replaced with actual signature logic
    await signPetition(id, signatureData);
    fetchPetitions();
    navigate(`/petitions/${id}`); // Refresh or redirect to same page
    alert("Successfully signed the petition!");
  } catch (err) {
    alert("Failed to sign: " + err.message);
  }
};

  // const handleClearSignature = () => {
  //   sigCanvas.current.clear();
  // };

  // const handleCloseModal = () => {
  //   setShowSignatureModal(false);
  //   sigCanvas.current.clear();
  // };

  const filters = ["All", "Environment", "Infrastructure", "Education", "Public Safety", "Transportation", "Healthcare", "Housing"];

  const getFilteredPetitions = () => {
    if (activeFilter === "My Petitions") return userPetitions;
    if (activeFilter === "Signed by Me") return signedPetitions;
    if (activeFilter !== "All") return petitions.filter((p) => p.category === activeFilter);
    return petitions;
  };

  if (loading) {
    return (
      <section className="flex min-h-screen bg-gray-100 justify-center items-center">
        <p className="text-xl">Loading petitions...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-screen bg-gray-100 justify-center items-center">
        <p className="text-red-500 text-xl">Error loading petitions: {error}</p>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-[#006a9a] text-white flex flex-col p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Civix</h1>
        <nav className="flex flex-col space-y-3">
          <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
            <span>🏠</span><span>Dashboard</span>
          </Link>
          <Link to="/petitions" className="flex items-center space-x-2 p-2 rounded-lg bg-white text-[#006a9a] font-semibold">
            <span>📄</span><span>Petitions</span>
          </Link>
          <Link to="/polls" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
            <span>📊</span><span>Polls</span>
          </Link>
          <Link to="/reports" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
            <span>📑</span><span>Reports</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
            <span>⚙️</span><span>Settings</span>
          </Link>
          <Link to="/help" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
            <span>❓</span><span>Help & Support</span>
          </Link>
        </nav>
      </aside>

      <section className="flex-1 flex flex-col">
        <header className="bg-[#006a9a] text-white flex justify-between items-center px-6 py-3">
          <nav className="flex-1 flex justify-center space-x-6 text-lg">
            <Link to="/dashboard" className="hover:underline">Home</Link>
            <Link to="/petitions" className="hover:underline">Petitions</Link>
            <Link to="/polls" className="hover:underline">Polls</Link>
            <Link to="/reports" className="hover:underline">Reports</Link>
          </nav>
          <section className="flex items-center space-x-2">
            <span className="bg-white text-[#006a9a] rounded-full w-10 h-10 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </section>
        </header>

        <section className="p-8 flex-1">
          <section className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Petitions</h2>
            <button
              onClick={() => navigate("/petitions")}
              className="bg-[#006a9a] text-white px-4 py-2 rounded-lg hover:bg-[#00557a]"
            >
              + Create Petition
            </button>
          </section>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <p className="text-gray-600 mb-4">Browse, sign, and track petitions in your community.</p>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveFilter("All")}
                className={`px-4 py-2 rounded-lg ${activeFilter === "All" ? "bg-[#006a9a] text-white" : "bg-gray-200 text-gray-700"} hover:bg-gray-300`}
              >
                All Petitions
              </button>
              <button
                onClick={() => setActiveFilter("My Petitions")}
                className={`px-4 py-2 rounded-lg ${activeFilter === "My Petitions" ? "bg-[#006a9a] text-white" : "bg-gray-200 text-gray-700"} hover:bg-gray-300`}
              >
                My Petitions
              </button>
              <button
                onClick={() => setActiveFilter("Signed by Me")}
                className={`px-4 py-2 rounded-lg ${activeFilter === "Signed by Me" ? "bg-[#006a9a] text-white" : "bg-gray-200 text-gray-700"} hover:bg-gray-300`}
              >
                Signed by Me
              </button>
            </div>
            <div className="flex space-x-4">
              <select className="p-2 border rounded-lg" defaultValue="All Locations">
                <option>All Locations</option>
              </select>
              <select
                className="p-2 border rounded-lg"
                onChange={(e) => setActiveFilter(e.target.value)}
                defaultValue="All Categories"
              >
                <option>All Categories</option>
                {filters.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
              <select className="p-2 border rounded-lg" defaultValue="All">
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {getFilteredPetitions().map((petition) => (
              <div key={petition._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{new Date(petition.postedDate).toLocaleDateString()}</p>
                  <h3 className="text-lg font-semibold">{petition.title}</h3>
                  <p className="text-gray-700">{petition.description}</p>
                  <p className="text-sm text-gray-500">{`${petition.signatures} of ${petition.signatureGoal} signatures`}</p>
                  <p className="text-sm text-green-600">{petition.status || "Active"}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/petitions/${petition._id}`)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={handleSignPetition}
                    className="px-4 py-2 bg-[#006a9a] text-white rounded-lg hover:bg-[#00557a] mb-6"
                  >
                    Sign Petition
                  </button>
                  {/* <button
                    onClick={() => handleSignPetition(petition._id)}
                    className="px-4 py-2 bg-[#006a9a] text-white rounded-lg hover:bg-[#00557a]"
                    disabled={petition.signaturesList?.includes(user?.id)}
                  >
                    Sign Petition
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          {getFilteredPetitions().length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No petitions found with current filters</p>
            </div>
          )}
        </section>

        {showSignatureModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Sign Petition</h3>
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{ className: "border border-gray-300 w-full h-40 mb-4" }}
                penColor="black"
                backgroundColor="white"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleClearSignature}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Clear
                </button>
                <button
                  onClick={handleSaveSignature}
                  className="px-4 py-2 bg-[#006a9a] text-white rounded-lg hover:bg-[#00557a]"
                >
                  Save Signature
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="bg-[#006a9a] text-white text-center p-3">
          <p>© 2025 Civix. All rights reserved.</p>
          <section className="flex justify-center space-x-6 mt-2">
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/support">Support</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </section>
        </footer>
      </section>
    </section>
  );
}

export default AllPetitions;




// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { PetitionContext } from '../contexts/PetitionContext';
// import { AuthContext } from '../contexts/AuthContext';
//  // Updated import path
// import { apiFetch } from "../utils/api";

// function AllPetitions() {
//   const { petitions, loading, error, fetchPetitions } = useContext(PetitionContext);
//   const { user } = useContext(AuthContext);
//   const [userPetitions, setUserPetitions] = useState([]);
//   const [signedPetitions, setSignedPetitions] = useState([]);
//   const [userLoading, setUserLoading] = useState(false); // New loading state
//   const [activeTab, setActiveTab] = useState('all');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPetitions();
//   }, [fetchPetitions]);

//   const fetchUserData = async () => {
//     if (!user?.id) {
//       console.log('No user ID, skipping user data fetch');
//       return;
//     }
//     setUserLoading(true);
//     try {
//       const [userRes, signedRes] = await Promise.all([
//         apiFetch('http://localhost:5000/api/petitions/user'),
//         apiFetch('http://localhost:5000/api/petitions/signed'),
//       ]);
//       if (!userRes.ok) throw new Error('Failed to fetch user petitions');
//       if (!signedRes.ok) throw new Error('Failed to fetch signed petitions');
//       setUserPetitions(await userRes.json());
//       setSignedPetitions(await signedRes.json());
//     } catch (err) {
//       console.error('Fetch user data error:', err);
//     } finally {
//       setUserLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, [user?.id]); // Only re-run when user.id changes

//   if (loading || userLoading) return <div className="flex min-h-screen bg-gray-100 justify-center items-center"><p>Loading...</p></div>;
//   if (error) return <div className="flex min-h-screen bg-gray-100 justify-center items-center"><p>Error: {error}</p></div>;

//   const filteredPetitions = activeTab === 'all' ? petitions :
//     activeTab === 'my' ? userPetitions :
//     signedPetitions;

//   return (
//     <section className="flex min-h-screen bg-gray-100">
//       <aside className="w-64 bg-[#006a9a] text-white flex flex-col p-4 space-y-4">
//         <h1 className="text-2xl font-bold mb-6">Civix</h1>
//         <nav className="flex flex-col space-y-3">
//           <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
//             <span>🏠</span><span>Dashboard</span>
//           </Link>
//           <Link to="/petitions" className="flex items-center space-x-2 p-2 rounded-lg bg-white text-[#006a9a] font-semibold">
//             <span>📄</span><span>Petitions</span>
//           </Link>
//           <Link to="/polls" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
//             <span>📊</span><span>Polls</span>
//           </Link>
//           <Link to="/reports" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
//             <span>📑</span><span>Reports</span>
//           </Link>
//           <Link to="/settings" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
//             <span>⚙️</span><span>Settings</span>
//           </Link>
//           <Link to="/help" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#0097cc]">
//             <span>❓</span><span>Help & Support</span>
//           </Link>
//         </nav>
//       </aside>

//       <section className="flex-1 flex flex-col">
//         <header className="bg-[#006a9a] text-white flex justify-between items-center px-6 py-3">
//           <nav className="flex-1 flex justify-center space-x-6 text-lg">
//             <Link to="/dashboard" className="hover:underline">Home</Link>
//             <Link to="/petitions" className="hover:underline">Petitions</Link>
//             <Link to="/polls" className="hover:underline">Polls</Link>
//             <Link to="/reports" className="hover:underline">Reports</Link>
//           </nav>
//           <section className="flex items-center space-x-2">
//             <span className="bg-white text-[#006a9a] rounded-full w-10 h-10 flex items-center justify-center font-bold">
//               {user?.name?.charAt(0).toUpperCase() || "U"}
//             </span>
//           </section>
//         </header>

//         <section className="p-8 flex-1">
//           <div className="bg-white p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4">All Petitions</h2>
//             <div className="mb-4 flex space-x-4">
//               <button
//                 onClick={() => setActiveTab('all')}
//                 className={`px-4 py-2 rounded-lg ${activeTab === 'all' ? 'bg-[#006a9a] text-white' : 'bg-gray-200'}`}
//               >
//                 All Petitions
//               </button>
//               <button
//                 onClick={() => setActiveTab('my')}
//                 className={`px-4 py-2 rounded-lg ${activeTab === 'my' ? 'bg-[#006a9a] text-white' : 'bg-gray-200'}`}
//               >
//                 My Petitions
//               </button>
//               <button
//                 onClick={() => setActiveTab('signed')}
//                 className={`px-4 py-2 rounded-lg ${activeTab === 'signed' ? 'bg-[#006a9a] text-white' : 'bg-gray-200'}`}
//               >
//                 Signed by Me
//               </button>
//             </div>
//             {filteredPetitions.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredPetitions.map(petition => (
//                   <div key={petition._id} className="bg-gray-50 p-4 rounded-lg shadow-md">
//                     <img
//                       src={petition.image || 'https://via.placeholder.com/300x200'}
//                       alt={petition.title}
//                       className="w-full h-48 object-cover rounded-t-lg"
//                     />
//                     <div className="p-4">
//                       <h3 className="text-xl font-semibold mb-2">{petition.title}</h3>
//                       <p className="text-gray-600 mb-2">{petition.description.substring(0, 100)}...</p>
//                       <p className="text-sm text-gray-500">Signatures: {petition.signatures} of {petition.signatureGoal}</p>
//                       <Link to={`/petitions/${petition._id}`} className="text-[#006a9a] hover:underline mt-2 inline-block">
//                         View Details
//                       </Link>
//                       <button
//                         onClick={() => navigate(`/petitions/${petition._id}/sign`)} // Example sign action
//                         className="ml-4 px-2 py-1 bg-[#006a9a] text-white rounded-lg hover:bg-[#00557a]"
//                       >
//                         Sign
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No petitions found.</p>
//             )}
//             <Link to="/petitions" className="text-[#006a9a] hover:underline mt-4 inline-block">
//               Create New Petition
//             </Link>
//           </div>
//         </section>

//         <footer className="bg-[#006a9a] text-white text-center p-3">
//           <p>© 2025 Civix. All rights reserved.</p>
//           <section className="flex justify-center space-x-6 mt-2">
//             <Link to="/about">About Us</Link>
//             <Link to="/services">Services</Link>
//             <Link to="/contact">Contact</Link>
//             <Link to="/support">Support</Link>
//             <Link to="/privacy">Privacy Policy</Link>
//           </section>
//         </footer>
//       </section>
//     </section>
//   );
// }

// export default AllPetitions;