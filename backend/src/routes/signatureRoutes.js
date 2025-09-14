const express = require("express");
const { signPetition, getSignatures } = require("../controllers/signatureController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/sign", auth, signPetition);
router.get("/:id/signatures", auth, getSignatures);

module.exports = router;
