


import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { PetitionContext } from "../contexts/PetitionContext";

function PetitionCreation() {
  const { user } = useContext(AuthContext);
  const { createPetition, fetchPetitions } = useContext(PetitionContext);
  const [petition, setPetition] = useState({
    title: "",
    category: "",
    location: "",
    signatureGoal: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPetition({ ...petition, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetition({ ...petition, image: file });
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to create a petition");
      navigate("/login");
      return;
    }
    // Validate fields before submission
    if (!petition.title || !petition.category || !petition.signatureGoal || !petition.description) {
      alert("Please fill in all required fields: Title, Category, Signature Goal, and Description");
      return;
    }

    const formData = new FormData();
    formData.append("title", petition.title);
    formData.append("description", petition.description);
    formData.append("category", petition.category);
    formData.append("location", petition.location || "");
    formData.append("signatureGoal", petition.signatureGoal);
    if (petition.image) formData.append("image", petition.image);

    try {
      await createPetition(formData);
      fetchPetitions();
      alert("Petition created successfully!");
      navigate("/all-petitions");
    } catch (err) {
      alert("Failed to create petition: " + err.message);
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-[#006699] text-white flex flex-col p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Civix</h1>
        <nav className="flex flex-col space-y-3">
          <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#00557a]">
            <span>🏠</span><span>Dashboard</span>
          </Link>
          <Link to="/petitions" className="flex items-center space-x-2 p-2 rounded-lg bg-white text-[#006699] font-semibold">
            <span>📄</span><span>Petitions</span>
          </Link>
          <Link to="/polls" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#00557a]">
            <span>📊</span><span>Polls</span>
          </Link>
          <Link to="/reports" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#00557a]">
            <span>📑</span><span>Reports</span>
          </Link>
          <Link to="/settings" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#00557a]">
            <span>⚙️</span><span>Settings</span>
          </Link>
          <Link to="/help" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[#00557a]">
            <span>❓</span><span>Help & Support</span>
          </Link>
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
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </section>
        </header>

        <section className="flex-1 p-8">
          <section className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create Petition</h2>
            <button
              onClick={() => navigate("/all-petitions")}
              className="bg-[#006699] text-white px-4 py-2 rounded-lg hover:bg-[#00557a]"
            >
              View All Petitions
            </button>
          </section>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-6 bg-white shadow-md rounded-xl p-6"
          >
            <section className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-500">Upload Image</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-3"
              />
            </section>

            <section className="flex flex-col space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Petition Title"
                value={petition.title}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                required
              />
              <section className="flex space-x-2">
                <select
                  name="category"
                  value={petition.category}
                  onChange={handleChange}
                  className="border p-2 rounded-lg flex-1"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Housing">Housing</option>
                </select>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={petition.location}
                  onChange={handleChange}
                  className="border p-2 rounded-lg flex-1"
                />
              </section>
              <input
                type="number"
                name="signatureGoal"
                placeholder="Signature Goal"
                value={petition.signatureGoal}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                min="1"
                required
              />
              <textarea
                name="description"
                placeholder="Describe the issue..."
                rows="4"
                value={petition.description}
                onChange={handleChange}
                className="border p-2 rounded-lg"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-[#006699] text-white p-2 rounded-lg hover:bg-[#00557a]"
              >
                Submit Petition
              </button>
            </section>
          </form>
        </section>

        <footer className="bg-[#006699] text-white text-center p-3">
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

export default PetitionCreation;