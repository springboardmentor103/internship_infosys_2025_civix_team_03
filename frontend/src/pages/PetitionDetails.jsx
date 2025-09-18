import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { PetitionContext } from "../contexts/PetitionContext";
import { AuthContext } from "../contexts/AuthContext";
import { apiFetch } from "../utils/api";

function PetitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sigCanvas = useRef(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const { signPetition, fetchPetitions } = useContext(PetitionContext);
  const { user } = useContext(AuthContext);
  const [petition, setPetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSinglePetition() {
      try {
        setLoading(true);
        const res = await apiFetch(`http://localhost:5000/api/petitions/${id}`);
        if (!res.ok) throw new Error("Petition not found");
        const data = await res.json();
        if (data.image) {
          data.image = `data:image/jpeg;base64,${data.image}`; // Adjust MIME type if needed
        }
        // Transform signatures to data URLs
        if (data.signaturesList && Array.isArray(data.signaturesList)) {
          data.signaturesList = data.signaturesList.map(sig => `data:image/png;base64,${sig}`);
        }
        setPetition(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSinglePetition();
  }, [id]);

  const handleSignPetition = () => {
    if (!user) {
      alert("Please log in to sign");
      navigate("/login");
      return;
    }
    setShowSignatureModal(true);
  };

  const handleSaveSignature = async () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature before saving.");
      return;
    }
    try {
      const signatureData = sigCanvas.current.toDataURL("image/png"); // Get base64 string
      await signPetition(id, signatureData); // Pass signature data
      setShowSignatureModal(false);
      sigCanvas.current.clear();
      fetchPetitions();
      // Refetch single petition to update signatures
      const res = await apiFetch(`http://localhost:5000/api/petitions/${id}`);
      const data = await res.json();
      if (data.image) {
        data.image = `data:image/jpeg;base64,${data.image}`; // Adjust MIME type if needed
      }
      if (data.signaturesList && Array.isArray(data.signaturesList)) {
        data.signaturesList = data.signaturesList.map(sig => `data:image/png;base64,${sig}`);
      }
      setPetition(data);
    } catch (err) {
      alert("Failed to sign: " + err.message);
    }
  };

  const handleClearSignature = () => {
    sigCanvas.current.clear();
  };

  const handleCloseModal = () => {
    setShowSignatureModal(false);
    sigCanvas.current.clear();
  };

  if (loading) {
    return <div className="flex min-h-screen bg-gray-100 justify-center items-center"><p>Loading...</p></div>;
  }

  if (error || !petition) {
    return (
      <div className="flex min-h-screen bg-gray-100 justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-700">Petition Not Found</h2>
          <Link to="/all-petitions" className="text-[#006a9a] hover:underline">
            Back to Petitions
          </Link>
        </div>
      </div>
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Link to="/all-petitions" className="text-[#006a9a] hover:underline mb-4 inline-block">
              ← Back to Petitions
            </Link>
            <h2 className="text-2xl font-bold mb-4">{petition.title}</h2>
            {petition.image ? (
              <img
                src={petition.image}
                alt={petition.title}
                className="w-full max-w-md h-auto rounded-lg mb-4"
              />
            ) : (
              <p className="text-gray-500 mb-4">No image available</p>
            )}
            <p className="text-gray-700 mb-4">{petition.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Posted By:</span> {petition.user.name}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Posted On:</span> {new Date(petition.postedDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Category:</span> {petition.category}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Signatures:</span> {petition.signatures} of {petition.signatureGoal}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Status:</span>{" "}
                  <span className={petition.status === "Active" ? "text-green-600" : petition.status === "In Progress" ? "text-yellow-600" : "text-red-600"}>
                    {petition.status}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={handleSignPetition}
              className="px-4 py-2 bg-[#006a9a] text-white rounded-lg hover:bg-[#00557a] mb-6"
            >
              Sign Petition
            </button>
            <h3 className="text-lg font-semibold mb-2">Signatures</h3>
            {petition.signatures > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {petition.signaturesList.map((signature, index) => (
                  <img
                    key={index}
                    src={signature}
                    alt={`Signature ${index + 1}`}
                    className="w-32 h-16 object-contain border border-gray-300 rounded"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No signatures yet.</p>
            )}
          </div>
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

export default PetitionDetails;