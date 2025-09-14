const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  goal: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String }, // petition image file path
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["active", "closed"], default: "active" },
  createdAt: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model("Petition", petitionSchema);
