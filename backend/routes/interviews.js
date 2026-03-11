const router = require('express').Router();
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id }).populate('application');
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const interview = await Interview.create({ ...req.body, user: req.user.id });
    res.status(201).json(interview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Interview.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;