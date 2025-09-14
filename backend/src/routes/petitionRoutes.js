const express = require("express");
const { createPetition, getAllPetitions, getPetitionById } = require("../controllers/petitionController");
const { auth } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", auth, upload.single("image"), createPetition);
router.get("/", auth, getAllPetitions);
router.get("/:id", auth, getPetitionById);

module.exports = router;
