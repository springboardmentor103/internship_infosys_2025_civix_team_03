const Petition = require("../models/Petition");

exports.getDashboard = async (req, res) => {
  try {
    const userPetitions = await Petition.countDocuments({ user: req.user.id });
    res.json({
      message: `Welcome ${req.user.name}`,
      userId: req.user.id,
      userPetitions,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error in dashboard" });
  }
};