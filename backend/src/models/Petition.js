const mongoose = require('mongoose');

const PetitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  location: String,
  signatureGoal: { type: Number, default: 100 },
  signatures: { type: Number, default: 0 },
  signaturesList: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    signature: { type: String } // Store base64 string
  }],
  status: { type: String, default: 'Active' },
  postedDate: { type: Date, default: Date.now },
  image: { type: String }, // Store base64 string
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Prevent OverwriteModelError
module.exports = mongoose.models.Petition || mongoose.model('Petition', PetitionSchema);