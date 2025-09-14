const fs = require("fs");
const path = require("path");
const Petition = require("../models/Petition");
const Signature = require("../models/Signature");

// Helper: save base64 as image
function saveBase64Image(base64, folder) {
  const base64Data = base64.replace(/^data:image\/png;base64,/, "");
  const fileName = `sign_${Date.now()}.png`;
  const filePath = path.join(folder, fileName);
  fs.writeFileSync(filePath, base64Data, "base64");
  return filePath;
}

// Sign petition
exports.signPetition = async (req, res) => {
  try {
    const { signatureData } = req.body;
    const petitionId = req.params.id;
    const userId = req.user.id;

    if (!signatureData) {
      return res.status(400).json({ message: "Signature data required" });
    }

    const petition = await Petition.findById(petitionId);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    const filePath = saveBase64Image(signatureData, path.join(__dirname, "../uploads/signatures"));

    const signature = new Signature({
      petition: petitionId,
      user: userId,
      signatureFile: filePath
    });

    await signature.save();
    res.status(201).json({ message: "Petition signed successfully", signature });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already signed this petition" });
    }
    console.error("Sign error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all signatures for a petition
exports.getSignatures = async (req, res) => {
  try {
    const petitionId = req.params.id;
    const signatures = await Signature.find({ petition: petitionId })
      .populate("user", "name email")
      .select("signatureFile signedAt");
    res.json({ count: signatures.length, signatures });
  } catch (err) {
    console.error("Get signatures error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
