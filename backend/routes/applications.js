const router = require('express').Router();
const Application = require('../models/Application');
const auth = require('../middleware/auth');

// Get all applications for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create application
router.post('/', auth, async (req, res) => {
  try {
    const app = await Application.create({ ...req.body, user: req.user.id });
    res.status(201).json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update application
router.put('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;