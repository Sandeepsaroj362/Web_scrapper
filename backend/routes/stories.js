const express = require('express');
const router = express.Router();
const { getStories, getStoryById, toggleBookmark } = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getStories);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', authMiddleware, toggleBookmark);

module.exports = router;
