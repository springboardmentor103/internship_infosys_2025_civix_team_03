const express = require('express');
const multer = require('multer');
const {
  createPetition,
  getAllPetitions,
  getPetition,
  updatePetition,
  deletePetition,
  signPetition,
  getUserPetitions,
  getUserSignedPetitions,
} = require('../controllers/petitionController');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('image');

// GET all petitions
router.get('/', getAllPetitions);

// POST new petition (auth required) with image upload
router.post('/', auth, (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, createPetition);

// GET /:id
router.get('/:id', getPetition);

// PUT /:id (auth)
router.put('/:id', auth, updatePetition);

// DELETE /:id (auth)
router.delete('/:id', auth, deletePetition);

// POST /:id/sign (auth now)
router.post('/:id/sign', auth, signPetition);

// GET /user (auth) - user's created petitions
router.get('/user', auth, getUserPetitions);

// GET /signed (auth) - user's signed petitions
router.get('/signed', auth, getUserSignedPetitions);

module.exports = router;