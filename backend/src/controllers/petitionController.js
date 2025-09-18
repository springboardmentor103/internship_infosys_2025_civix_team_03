const Petition = require('../models/Petition');

// Create petition
exports.createPetition = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    const { title, description, category, location, signatureGoal } = req.body;
    if (!title || !description || !category || !signatureGoal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const petitionData = {
      title,
      description,
      category,
      location,
      signatureGoal: parseInt(signatureGoal),
      user: req.user.id, // From auth middleware
    };

    if (req.file) {
      petitionData.image = req.file.buffer.toString('base64'); // Convert to base64 string
      console.log('Image size:', req.file.buffer.length);
    }

    const petition = await Petition.create(petitionData);
    res.status(201).json(petition);
  } catch (err) {
    console.error('Create petition error:', err);
    res.status(500).json({ error: 'Failed to create petition', details: err.message });
  }
};

// Get all petitions
exports.getAllPetitions = async (_req, res) => {
  try {
    const petitions = await Petition.find().sort({ postedDate: -1 }).populate('user', 'name');
    res.json(petitions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch petitions' });
  }
};

// Get single petition
exports.getPetition = async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id).populate('user', 'name');
    if (!petition) return res.status(404).json({ error: 'Petition not found' });
    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch petition' });
  }
};

// Update petition
exports.updatePetition = async (req, res) => {
  try {
    const petition = await Petition.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name');
    if (!petition) return res.status(404).json({ error: 'Petition not found' });
    res.json(petition);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update petition' });
  }
};

// Delete petition
exports.deletePetition = async (req, res) => {
  try {
    const petition = await Petition.findByIdAndDelete(req.params.id);
    if (!petition) return res.status(404).json({ error: 'Petition not found' });
    res.json({ message: 'Petition deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete petition' });
  }
};



// Get user's petitions

exports.getUserPetitions = async (req, res) => {
  try {
    console.log('Fetching user petitions for user ID:', req.user?.id);
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User ID not found in request' });
    }
    const petitions = await Petition.find({ user: req.user.id }).sort({ postedDate: -1 }).populate('user', 'name');
    console.log('Found petitions:', petitions.length);
    res.json(petitions);
  } catch (err) {
    console.error('Get user petitions error:', err);
    res.status(500).json({ error: 'Failed to fetch user\'s petitions', details: err.message });
  }
};

// Get user's signed petitions

exports.getUserSignedPetitions = async (req, res) => {
  try {
    console.log('Fetching signed petitions for user ID:', req.user?.id);
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User ID not found in request' });
    }
    const allPetitions = await Petition.find({}).populate('user', 'name');
    const signed = allPetitions.filter(p => p.signaturesList.some(sig => sig.userId.toString() === req.user.id.toString()));
    console.log('Found signed petitions:', signed.length);
    res.json(signed);
  } catch (err) {
    console.error('Get signed petitions error:', err);
    res.status(500).json({ error: 'Failed to fetch signed petitions', details: err.message });
  }
};

exports.signPetition = async (req, res) => {
  try {
    const userId = req.user.id; // Require auth for signing
    if (!userId) return res.status(401).json({ error: 'Authentication required to sign' });
    
    const petition = await Petition.findById(req.params.id).populate('user', 'name');
    if (!petition) return res.status(404).json({ error: 'Petition not found' });
    
    // Prevent duplicate signing by the same user
    if (petition.signaturesList.some(sig => sig.userId.toString() === userId.toString())) {
      return res.status(400).json({ error: 'Already signed' });
    }
    
    const signatureData = req.body.signature; // Expect base64 string from frontend
    if (!signatureData) {
      return res.status(400).json({ error: 'Signature data is required' });
    }

    petition.signatures += 1;
    petition.signaturesList.push({ userId, signature: signatureData }); // Store userId and signature
    await petition.save();
    res.json(petition);
  } catch (err) {
    console.error('Sign petition error:', err);
    res.status(500).json({ error: 'Failed to sign petition', details: err.message });
  }
};


