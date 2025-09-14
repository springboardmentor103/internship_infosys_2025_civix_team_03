const Petition = require("../models/Petition");

exports.createPetition = async (req, res) => {
  try {
    const { title, category, location, goal, description } = req.body;
    const createdBy = req.user.id;

    // --- Basic validation before saving ---
    if (!title || !category || !location || !goal || !description) {
      return res.status(400).json({
        error: "All fields (title, category, location, goal, description) are required.",
      });
    }

    const petition = new Petition({
      title,
      category,
      location,
      goal,
      description,
      createdBy,
      image: req.file ? req.file.path : null,
    });

    await petition.save();
    res.status(201).json({ message: "Petition created successfully", petition });
  } catch (err) {
    console.error("Create petition error:", err);

    // Catch Mongoose validation errors and return 400 instead of 500
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find().populate("createdBy", "name email");
    res.json(petitions);
  } catch (err) {
    console.error("Get petitions error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getPetitionById = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id).populate("createdBy", "name email");
    if (!petition)
      return res.status(404).json({ message: "Petition not found" });
    res.json(petition);
  } catch (err) {
    console.error("Get petition error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
